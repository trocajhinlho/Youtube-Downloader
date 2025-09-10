export default function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9\s-\[\]\(\)]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
