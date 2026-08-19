export function isSvgImage(url: string) {
  return /\.svg($|\?)/i.test(url);
}
