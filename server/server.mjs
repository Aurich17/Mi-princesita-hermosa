import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import dotenv from "dotenv";
import ImageKit from "@imagekit/nodejs";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "2mb" }));

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("missing_supabase_env");
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

app.get("/api/imagekit-auth", (req, res) => {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT ?? "";

  if (!publicKey || !privateKey) {
    res.status(500).json({
      error: "missing_imagekit_env",
      required: ["IMAGEKIT_PUBLIC_KEY", "IMAGEKIT_PRIVATE_KEY"],
    });
    return;
  }

  const client = new ImageKit({ privateKey });
  const auth = client.helper.getAuthenticationParameters();
  res.status(200).json({ ...auth, publicKey, urlEndpoint });
});

app.get("/api/gallery-photos", async (req, res) => {
  try {
    const year = Number(req.query?.year ?? "2026");
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("birthday_photos")
      .select("id, year, label, url, imagekit_file_id, created_at")
      .eq("year", year)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("supabase_select_failed", {
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details,
      });
      res.status(500).json({
        error: "select_failed",
        details: error.message,
      });
      return;
    }

    res.status(200).json({
      year,
      items: (data ?? []).map((r) => ({
        id: r.id,
        label: r.label,
        img: r.url,
        imagekitFileId: r.imagekit_file_id,
        createdAt: r.created_at,
      })),
    });
  } catch (e) {
    res.status(500).json({ error: String(e?.message ?? "error") });
  }
});

app.post("/api/gallery-photos", async (req, res) => {
  try {
    const year = Number(req.body?.year ?? 2026);
    const label = String(req.body?.label ?? "Foto");
    const photoUrl = String(req.body?.url ?? "");
    const imagekitFileId = req.body?.imagekitFileId
      ? String(req.body.imagekitFileId)
      : null;

    if (!photoUrl.startsWith("http")) {
      res.status(400).json({ error: "bad_url" });
      return;
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("birthday_photos")
      .insert({
        year,
        label,
        url: photoUrl,
        imagekit_file_id: imagekitFileId,
      })
      .select("id, year, label, url, imagekit_file_id, created_at")
      .single();

    if (error) {
      console.error("supabase_insert_failed", {
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details,
      });
      res.status(500).json({
        error: "insert_failed",
        details: error.message,
      });
      return;
    }

    res.status(200).json({
      item: {
        id: data.id,
        label: data.label,
        img: data.url,
        imagekitFileId: data.imagekit_file_id,
        createdAt: data.created_at,
      },
    });
  } catch (e) {
    res.status(500).json({ error: String(e?.message ?? "error") });
  }
});

const distDir = path.resolve(__dirname, "..", "dist");
app.use(express.static(distDir));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const port = Number(process.env.PORT ?? "3000");
app.listen(port, "0.0.0.0", () => {
  console.log(`server listening on http://0.0.0.0:${port}`);
});
