export function sanitizeAttribute(attr: string): string {
  if (!attr) return "";
  return String(attr).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function sanitizeUrl(url: string, isImage = false): string {
  if (!url) return "";
  let sanitized = String(url).trim();
  sanitized = sanitizeAttribute(sanitized);

  const isDangerous = /^(javascript|vbscript|file|data):/i.test(sanitized);

  if (isDangerous) {
    if (isImage && /^data:image\//i.test(sanitized)) {
      return sanitized;
    }
    return "#";
  }
  return sanitized;
}
