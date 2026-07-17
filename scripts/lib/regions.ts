/**
 * Marker-region utilities shared by apply-tokens.ts and prune-site.ts.
 *
 * A region is delimited by a pair of marker comments:
 *   HAAZEL:NAME ... /HAAZEL:NAME
 * (comment syntax varies by file type; only the marker text matters).
 */

export function findMarkerLine(
  lines: string[],
  marker: string,
  opts: { closing: boolean; from?: number },
): number {
  const needle = (opts.closing ? "/" : "") + marker;
  for (let i = opts.from ?? 0; i < lines.length; i++) {
    const line = lines[i];
    const idx = line.indexOf(needle);
    if (idx === -1) continue;
    // Boundary: next char must not extend the marker name (COLORS vs COLORS-ROOT).
    const after = line[idx + needle.length];
    if (after !== undefined && /[\w-]/.test(after)) continue;
    // For opening markers, reject the closing form.
    if (!opts.closing && line.slice(Math.max(0, idx - 1), idx) === "/") continue;
    return i;
  }
  return -1;
}

export function replaceRegion(content: string, name: string, body: string[]): string {
  const marker = `HAAZEL:${name}`;
  const lines = content.split("\n");
  const start = findMarkerLine(lines, marker, { closing: false });
  if (start === -1) throw new Error(`Missing marker ${marker}`);
  const end = findMarkerLine(lines, marker, { closing: true, from: start + 1 });
  if (end === -1) throw new Error(`Missing closing marker /${marker}`);
  return [...lines.slice(0, start + 1), ...body, ...lines.slice(end)].join("\n");
}
