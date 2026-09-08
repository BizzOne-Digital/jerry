export function isSvgImage(url: string) {
  return /\.svg($|\?)/i.test(url);
}

export function isPackageLogoImage(url: string) {
  return /\/(all-star|mvp)-logo\.png($|\?)/i.test(url);
}
