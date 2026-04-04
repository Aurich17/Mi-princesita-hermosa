import ImageKit from "@imagekit/nodejs";

function getClient() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error("missing_imagekit_env");
  }

  return { client: new ImageKit({ privateKey }), urlEndpoint };
}

function folderForYear(year: number) {
  if (year === 2026) return "/gabi/cumple-2026/";
  return "/gabi/cumple-2025/";
}

function optimizeUrl(url: string) {
  return url.includes("?") ? `${url}&tr=w-1400` : `${url}?tr=w-1400`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  try {
    const yearRaw = String(req.query?.year ?? "2026");
    const year = Number(yearRaw);
    const folder = folderForYear(year);

    const { client } = getClient();
    const files = await client.assets.list({
      path: folder,
      type: "file",
      fileType: "image",
      sort: "DESC_CREATED",
      limit: 200,
    });

    const items = (files ?? [])
      .filter((f: any) => f.type === "file")
      .map((f: any) => ({
        id: f.fileId ?? f.filePath ?? f.name,
        label: f.name ?? "Foto",
        img: f.url ? optimizeUrl(f.url) : undefined,
        createdAt: f.createdAt,
      }));

    res.status(200).json({ year, items });
  } catch (e: any) {
    const msg = String(e?.message ?? "error");
    res.status(500).json({ error: msg });
  }
}
