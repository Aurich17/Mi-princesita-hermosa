import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("missing_supabase_env");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function readJsonBody(req: any) {
  if (req.body && typeof req.body === "object") return req.body;
  return new Promise<any>((resolve, reject) => {
    let data = "";
    req.on("data", (chunk: any) => {
      data += String(chunk);
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("bad_json"));
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(req: any, res: any) {
  try {
    const supabase = getSupabase();

    if (req.method === "GET") {
      const year = Number(req.query?.year ?? "2026");
      const { data, error } = await supabase
        .from("birthday_photos")
        .select("id, year, label, url, imagekit_file_id, created_at")
        .eq("year", year)
        .order("created_at", { ascending: false });

      if (error) {
        res.status(500).json({ error: "select_failed" });
        return;
      }

      res.status(200).json({
        year,
        items: (data ?? []).map((r: any) => ({
          id: r.id,
          label: r.label,
          img: r.url,
          imagekitFileId: r.imagekit_file_id,
          createdAt: r.created_at,
        })),
      });
      return;
    }

    if (req.method === "POST") {
      const body = await readJsonBody(req);
      const year = Number(body?.year ?? 2026);
      const label = String(body?.label ?? "Foto");
      const url = String(body?.url ?? "");
      const imagekitFileIdRaw = body?.imagekitFileId ?? body?.imagekit_file_id;
      const imagekitFileId = imagekitFileIdRaw
        ? String(imagekitFileIdRaw)
        : null;

      if (!url.startsWith("http")) {
        res.status(400).json({ error: "bad_url" });
        return;
      }

      const { data, error } = await supabase
        .from("birthday_photos")
        .insert({
          year,
          label,
          url,
          imagekit_file_id: imagekitFileId,
        })
        .select("id, year, label, url, imagekit_file_id, created_at")
        .single();

      if (error) {
        res.status(500).json({ error: "insert_failed" });
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
      return;
    }

    res.status(405).json({ error: "method_not_allowed" });
  } catch (e: any) {
    const msg = String(e?.message ?? "error");
    res.status(500).json({ error: msg });
  }
}

