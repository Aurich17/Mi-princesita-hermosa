/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import ImageKit from "@imagekit/nodejs";
import { createClient } from "@supabase/supabase-js";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  build: {
    sourcemap: "hidden",
  },
  plugins: [
    {
      name: "imagekit-auth-dev",
      configureServer(server) {
        const env = loadEnv(server.config.mode, process.cwd(), "");

        server.middlewares.use("/api/imagekit-auth", (req, res, next) => {
          if (req.method !== "GET") return next();

          const publicKey = env.IMAGEKIT_PUBLIC_KEY;
          const privateKey = env.IMAGEKIT_PRIVATE_KEY;
          const urlEndpoint = env.IMAGEKIT_URL_ENDPOINT ?? "";

          res.setHeader("Content-Type", "application/json");

          if (!publicKey || !privateKey) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: "missing_imagekit_env",
                required: ["IMAGEKIT_PUBLIC_KEY", "IMAGEKIT_PRIVATE_KEY"],
              }),
            );
            return;
          }

          const client = new ImageKit({ privateKey });
          const auth = client.helper.getAuthenticationParameters();
          res.statusCode = 200;
          res.end(JSON.stringify({ ...auth, publicKey, urlEndpoint }));
        });

        server.middlewares.use(
          "/api/imagekit-album",
          async (req, res, next) => {
            if (req.method !== "GET") return next();

            const publicKey = env.IMAGEKIT_PUBLIC_KEY;
            const privateKey = env.IMAGEKIT_PRIVATE_KEY;
            const urlEndpoint = env.IMAGEKIT_URL_ENDPOINT;

            res.setHeader("Content-Type", "application/json");

            if (!publicKey || !privateKey || !urlEndpoint) {
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  error: "missing_imagekit_env",
                }),
              );
              return;
            }

            const url = new URL(req.url ?? "", "http://localhost");
            const year = Number(url.searchParams.get("year") ?? "2026");
            const folder =
              year === 2026 ? "/gabi/cumple-2026/" : "/gabi/cumple-2025/";

            try {
              const client = new ImageKit({ privateKey });
              const files = await client.assets.list({
                path: folder,
                type: "file",
                fileType: "image",
                sort: "DESC_CREATED",
                limit: 200,
              });

              const optimizeUrl = (u: string) =>
                u.includes("?") ? `${u}&tr=w-1400` : `${u}?tr=w-1400`;

              const items = (files ?? [])
                .filter((f: any) => f.type === "file")
                .map((f: any) => ({
                  id: f.fileId ?? f.filePath ?? f.name,
                  label: f.name ?? "Foto",
                  img: f.url ? optimizeUrl(f.url) : undefined,
                  createdAt: f.createdAt,
                }));

              res.statusCode = 200;
              res.end(JSON.stringify({ year, items }));
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(e?.message ?? "error") }));
            }
          },
        );

        server.middlewares.use(
          "/api/gallery-photos",
          async (req, res, next) => {
            const supabaseUrl = env.SUPABASE_URL;
            const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;
            res.setHeader("Content-Type", "application/json");

            if (!supabaseUrl || !supabaseServiceKey) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "missing_supabase_env" }));
              return;
            }

            const supabase = createClient(supabaseUrl, supabaseServiceKey, {
              auth: { persistSession: false, autoRefreshToken: false },
            });

            if (req.method === "GET") {
              const url = new URL(req.url ?? "", "http://localhost");
              const year = Number(url.searchParams.get("year") ?? "2026");
              const { data, error } = await supabase
                .from("birthday_photos")
                .select("id, year, label, url, imagekit_file_id, created_at")
                .eq("year", year)
                .order("created_at", { ascending: false });

              if (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "select_failed" }));
                return;
              }

              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  year,
                  items: (data ?? []).map((r: any) => ({
                    id: r.id,
                    label: r.label,
                    img: r.url,
                    imagekitFileId: r.imagekit_file_id,
                    createdAt: r.created_at,
                  })),
                }),
              );
              return;
            }

            if (req.method === "POST") {
              let raw = "";
              req.on("data", (c: any) => {
                raw += String(c);
              });
              req.on("end", async () => {
                try {
                  const body = raw ? JSON.parse(raw) : {};
                  const year = Number(body?.year ?? 2026);
                  const label = String(body?.label ?? "Foto");
                  const photoUrl = String(body?.url ?? "");
                  const imagekitFileId = body?.imagekitFileId
                    ? String(body.imagekitFileId)
                    : null;

                  if (!photoUrl.startsWith("http")) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "bad_url" }));
                    return;
                  }

                  const { data, error } = await supabase
                    .from("birthday_photos")
                    .insert({
                      year,
                      label,
                      url: photoUrl,
                      imagekit_file_id: imagekitFileId,
                    })
                    .select(
                      "id, year, label, url, imagekit_file_id, created_at",
                    )
                    .single();

                  if (error) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: "insert_failed" }));
                    return;
                  }

                  res.statusCode = 200;
                  res.end(
                    JSON.stringify({
                      item: {
                        id: data.id,
                        label: data.label,
                        img: data.url,
                        imagekitFileId: data.imagekit_file_id,
                        createdAt: data.created_at,
                      },
                    }),
                  );
                } catch (e: any) {
                  res.statusCode = 500;
                  res.end(
                    JSON.stringify({ error: String(e?.message ?? "error") }),
                  );
                }
              });
              return;
            }

            return next();
          },
        );
      },
    },
    react({
      babel: {
        plugins: ["react-dev-locator"],
      },
    }),
    tsconfigPaths(),
  ],
});
