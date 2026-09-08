export const IMAGE_PLACEHOLDER = "/assets/demo/card-back-classic.svg";

export function isSvgImage(url: string) {
  return /\.svg($|\?)/i.test(url);
}

export function isPackageLogoImage(url: string) {
  return /\/(all-star|mvp)-logo\.png($|\?)/i.test(url);
}

export function isStoredUploadUrl(url: string) {
  return url.startsWith("/api/uploads/");
}

export function isLegacyDiskUploadUrl(url: string) {
  return /^\/uploads\//i.test(url);
}

/** Resolve image src for display; legacy disk paths fall back to placeholder. */
export function resolveImageSrc(url: string | undefined | null): string {
  if (!url) return IMAGE_PLACEHOLDER;
  if (isLegacyDiskUploadUrl(url)) return IMAGE_PLACEHOLDER;
  return url;
}
