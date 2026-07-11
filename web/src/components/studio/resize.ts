// Downscale + re-encode photos in the browser so uploads and AI-chat drops
// never carry full-camera files into the repo (or the API payload). Mirrors
// what scripts/import-photos.mjs does server-side: longest edge capped,
// optimized JPEG.
export const GALLERY_EDGE = 2200; // what gets saved to assets/listings
export const AI_EDGE = 1100; // what gets sent to the model (vision needs no more)

async function toBitmap(file: Blob): Promise<{ src: CanvasImageSource; w: number; h: number; done?: () => void }> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" } as any);
    return { src: bmp, w: bmp.width, h: bmp.height, done: () => bmp.close() };
  } catch {
    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("Couldn't read that image"));
      i.src = url;
    });
    return { src: img, w: img.naturalWidth, h: img.naturalHeight, done: () => URL.revokeObjectURL(url) };
  }
}

export async function resizeToDataUrl(file: Blob, maxEdge: number, quality = 0.82): Promise<string> {
  const { src, w, h, done } = await toBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(w, h));
  const cw = Math.max(1, Math.round(w * scale));
  const ch = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(src, 0, 0, cw, ch);
  done?.();
  return canvas.toDataURL("image/jpeg", quality);
}
