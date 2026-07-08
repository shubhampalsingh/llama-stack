"use client";

export type EncodedImage = {
  mediaType: "image/jpeg";
  data: string; // base64, no data: prefix
  previewUrl: string;
};

/** Downscale to max 1600px and encode as JPEG base64 for the API. */
export async function encodeImage(file: File): Promise<EncodedImage> {
  const bitmap = await createImageBitmap(file);
  const maxSide = 1600;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  return {
    mediaType: "image/jpeg",
    data: dataUrl.split(",")[1],
    previewUrl: dataUrl,
  };
}
