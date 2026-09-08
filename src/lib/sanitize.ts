import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel"],
  });
}

export function escapeCsvValue(value: string): string {
  const escaped = value.replace(/"/g, '""');
  if (/^[=+\-@]/.test(escaped)) {
    return `"'\${escaped}"`;
  }
  return `"${escaped}"`;
}
