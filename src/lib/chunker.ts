export type RawDoc = { id: string; text: string };
export function chunk(text: string, size = 700, overlap = 120) {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let i = 0;
  while (i < words.length) {
    const slice = words.slice(i, i + size);
    out.push(slice.join(" "));
    i += size - overlap;
  }
  return out;
}
export function expand(raw: RawDoc[]) {
  const docs: RawDoc[] = [];
  for (const d of raw) {
    const pieces = chunk(d.text);
    pieces.forEach((p, idx) =>
      docs.push({ id: `${d.id}#${idx + 1}`, text: p })
    );
  }
  return docs;
}
