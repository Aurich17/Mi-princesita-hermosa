/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageKit from "@imagekit/nodejs";

export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

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

  res.status(200).json({
    ...auth,
    publicKey,
    urlEndpoint,
  });
}
