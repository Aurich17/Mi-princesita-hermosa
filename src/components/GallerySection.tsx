import { useEffect, useMemo, useRef, useState } from "react";
import type { BirthdayAlbum, GalleryItem } from "@/data/content";
import { cn } from "@/lib/utils";

type Props = {
  albums: BirthdayAlbum[];
};

function normalizeLabel(name: string) {
  const trimmed = name.replace(/\.[^/.]+$/, "");
  return trimmed.replace(/[_-]+/g, " ").trim();
}

type ImageKitAuth = {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint?: string;
};

type ImageKitUploadResult = {
  fileId: string;
  url: string;
  label: string;
};

async function getImageKitAuth(): Promise<ImageKitAuth> {
  const res = await fetch("/api/imagekit-auth", { method: "GET" });
  if (!res.ok) throw new Error("auth_failed");
  const json = (await res.json()) as ImageKitAuth;
  if (!json?.token || !json?.signature || !json?.publicKey) {
    throw new Error("bad_auth_payload");
  }
  return json;
}

async function uploadToImageKit(params: {
  file: File;
  auth: ImageKitAuth;
  folder: string;
  fileName: string;
}): Promise<ImageKitUploadResult> {
  const form = new FormData();
  form.append("file", params.file);
  form.append("fileName", params.fileName);
  form.append("folder", params.folder);
  form.append("useUniqueFileName", "true");
  form.append("token", params.auth.token);
  form.append("expire", String(params.auth.expire));
  form.append("signature", params.auth.signature);
  form.append("publicKey", params.auth.publicKey);

  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("upload_failed");
  const json = (await res.json()) as {
    fileId: string;
    url: string;
    name: string;
  };

  const label = normalizeLabel(params.file.name) || "Foto";
  const url = json.url;
  const optimized = url.includes("?") ? `${url}&tr=w-1400` : `${url}?tr=w-1400`;

  return {
    fileId:
      json.fileId || `u-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    label,
    url: optimized,
  };
}

async function fetchAlbum(year: number) {
  const res = await fetch(`/api/gallery-photos?year=${year}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("album_failed");
  const json = (await res.json()) as { year: number; items: GalleryItem[] };
  return json.items ?? [];
}

async function savePhoto(params: {
  year: number;
  label: string;
  url: string;
  imagekitFileId: string;
}) {
  const res = await fetch("/api/gallery-photos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("save_failed");
}

function getFileExtension(name: string) {
  const match = name.match(/\.[0-9a-z]+$/i);
  return match ? match[0] : "";
}

function slugify(input: string) {
  const cleaned = input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
  return cleaned || "foto";
}

export default function GallerySection({ albums }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lightbox, setLightbox] = useState<{
    img: string;
    label: string;
  } | null>(null);

  const [album2026, setAlbum2026] = useState<GalleryItem[]>([]);
  const [loadingAlbum2026, setLoadingAlbum2026] = useState(true);

  const [pendingUploads, setPendingUploads] = useState<
    Array<{ id: string; file: File; previewUrl: string; title: string }>
  >([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const refresh2026 = async () => {
    try {
      setLoadingAlbum2026(true);
      const items = await fetchAlbum(2026);
      setAlbum2026(items);
    } finally {
      setLoadingAlbum2026(false);
    }
  };

  useEffect(() => {
    refresh2026();
  }, []);

  useEffect(() => {
    return () => {
      pendingUploads.forEach((u) => URL.revokeObjectURL(u.previewUrl));
    };
  }, [pendingUploads]);

  const mergedAlbums = useMemo(() => {
    return albums.map((a) => {
      if (a.year === 2026) return { ...a, items: album2026 };
      return a;
    });
  }, [albums, album2026]);

  return (
    <section className="py-12 sm:py-14" id="galeria">
      <h2 className="text-xl font-semibold tracking-tight text-rose-950 sm:text-2xl">
        Galería de cumpleaños
      </h2>

      <div className="mt-8 space-y-12">
        {mergedAlbums.map((album) => (
          <div key={album.year} className="relative">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700/60">
                  {album.year}
                </div>
                <div className="mt-2 text-base font-semibold text-rose-950">
                  {album.title}
                </div>
              </div>

              {album.year === 2026 ? (
                <button
                  type="button"
                  className={cn(
                    "rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(244,63,94,0.22)] transition hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70",
                    busy ? "pointer-events-none opacity-70" : "",
                  )}
                  onClick={() => {
                    setError(null);
                    inputRef.current?.click();
                  }}
                >
                  {busy ? "Subiendo…" : "Agregar fotos 2026"}
                </button>
              ) : null}
            </div>

            {error ? (
              <div className="mt-4 text-sm font-medium text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="mt-6 overflow-x-auto">
              <div className="flex gap-4 pb-1">
                {album.year === 2026 && loadingAlbum2026 ? (
                  <div className="rounded-2xl bg-white/60 px-6 py-10 text-sm text-rose-900/60 shadow-sm">
                    Cargando…
                  </div>
                ) : null}

                {!loadingAlbum2026 && album.items.length === 0 ? (
                  <div className="rounded-2xl bg-white/60 px-6 py-10 text-sm text-rose-900/60 shadow-sm">
                    Aún no hay fotos aquí.
                  </div>
                ) : null}

                {album.items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative w-[240px] shrink-0 overflow-hidden rounded-2xl bg-white/60 shadow-sm"
                  >
                    <div className="aspect-[4/5] w-full bg-white">
                      {item.img ? (
                        <button
                          type="button"
                          className="relative h-full w-full"
                          onClick={() =>
                            setLightbox({
                              img: item.img ?? "",
                              label: item.label,
                            })
                          }
                          aria-label={`Abrir foto: ${item.label}`}
                        >
                          <img
                            src={item.img}
                            alt={item.label}
                            className="absolute inset-0 h-full w-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ) : (
                        <div className="grid h-full w-full place-items-center">
                          <div className="px-5 text-center text-sm font-medium text-rose-900/60">
                            {item.label}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-3 text-sm font-medium text-rose-900/70">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          e.currentTarget.value = "";
          if (files.length === 0) return;

          pendingUploads.forEach((u) => URL.revokeObjectURL(u.previewUrl));
          setPendingUploads(
            files.map((f) => ({
              id: `p-${Date.now()}-${Math.random().toString(16).slice(2)}`,
              file: f,
              previewUrl: URL.createObjectURL(f),
              title: normalizeLabel(f.name) || "Foto",
            })),
          );
          setUploadModalOpen(true);
          setError(null);
        }}
      />

      {uploadModalOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            if (busy) return;
            setUploadModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-rose-100/60 px-4 py-3">
              <div className="text-sm font-semibold text-rose-950">
                Títulos de las fotos (2026)
              </div>
              <button
                type="button"
                className="rounded-full border border-rose-200/70 bg-white px-4 py-2 text-sm font-semibold text-rose-900 shadow-sm"
                onClick={() => {
                  if (busy) return;
                  setUploadModalOpen(false);
                }}
              >
                Cerrar
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {pendingUploads.map((u) => (
                  <div
                    key={u.id}
                    className="overflow-hidden rounded-2xl border border-rose-200/60 bg-white"
                  >
                    <div className="aspect-[6/5] w-full bg-rose-50/30">
                      <img
                        src={u.previewUrl}
                        alt={u.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700/70">
                        Título
                      </label>
                      <input
                        value={u.title}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPendingUploads((prev) =>
                            prev.map((x) =>
                              x.id === u.id ? { ...x, title: v } : x,
                            ),
                          );
                        }}
                        disabled={busy}
                        className="mt-2 w-full rounded-xl border border-rose-200/70 bg-white px-3 py-2 text-sm text-rose-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
                        placeholder="Ej: Pastel, playa, nosotros"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {error ? (
                <div className="mt-4 text-sm font-medium text-rose-700">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-rose-100/60 px-4 py-4">
              <button
                type="button"
                className="rounded-full border border-rose-200/70 bg-white px-5 py-2.5 text-sm font-semibold text-rose-900 shadow-sm"
                disabled={busy}
                onClick={() => {
                  setUploadModalOpen(false);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-full bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(244,63,94,0.22)] transition hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70",
                  busy ? "pointer-events-none opacity-70" : "",
                )}
                onClick={async () => {
                  if (pendingUploads.length === 0) {
                    setUploadModalOpen(false);
                    return;
                  }

                  setBusy(true);
                  setError(null);
                  try {
                    const auth = await getImageKitAuth();
                    const uploaded = await Promise.all(
                      pendingUploads.map(async (p, idx) => {
                        const title = p.title.trim() || `Foto ${idx + 1}`;
                        const ext = getFileExtension(p.file.name);
                        const fileName = `${slugify(title)}${ext || ".jpg"}`;
                        const up = await uploadToImageKit({
                          file: p.file,
                          auth,
                          folder: "/gabi/cumple-2026",
                          fileName,
                        });
                        await savePhoto({
                          year: 2026,
                          label: title,
                          url: up.url,
                          imagekitFileId: up.fileId,
                        });
                        return up;
                      }),
                    );

                    if (uploaded.length > 0) {
                      setUploadModalOpen(false);
                      pendingUploads.forEach((u) =>
                        URL.revokeObjectURL(u.previewUrl),
                      );
                      setPendingUploads([]);
                      await refresh2026();
                    }
                  } catch {
                    setError(
                      "No se pudieron subir algunas imágenes. Revisa la configuración de ImageKit y vuelve a intentar.",
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Subiendo…" : "Subir"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-rose-100/60 px-4 py-3">
              <div className="text-sm font-semibold text-rose-950">
                {lightbox.label}
              </div>
              <button
                type="button"
                className="rounded-full border border-rose-200/70 bg-white px-4 py-2 text-sm font-semibold text-rose-900 shadow-sm"
                onClick={() => setLightbox(null)}
              >
                Cerrar
              </button>
            </div>
            <div className="bg-black">
              <img
                src={lightbox.img}
                alt={lightbox.label}
                className="h-[70vh] w-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
