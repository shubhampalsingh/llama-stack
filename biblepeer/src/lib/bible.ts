// Public-domain scripture via bible-api.com (World English Bible by default).

export interface Passage {
  reference: string;
  translation: string;
  text: string;
  verses: { verse: number; text: string }[];
}

const REF_PATTERN = /^[1-3]?\s?[A-Za-z .]+\s?\d{1,3}(:\d{1,3}(-\d{1,3})?)?(-\d{1,3}(:\d{1,3})?)?$/;

export function isValidReference(ref: string): boolean {
  return ref.trim().length >= 3 && ref.trim().length <= 60 && REF_PATTERN.test(ref.trim());
}

export async function fetchPassage(
  reference: string,
  translation: "web" | "kjv" = "web"
): Promise<Passage> {
  if (!isValidReference(reference)) {
    throw new BibleError("That doesn't look like a passage reference (try e.g. John 3:1-21).");
  }

  const url = `https://bible-api.com/${encodeURIComponent(reference.trim())}?translation=${translation}`;
  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  } catch {
    throw new BibleError("Couldn't reach the scripture service. Please try again.");
  }

  if (!res.ok) {
    throw new BibleError(
      res.status === 404
        ? "Passage not found — check the book name and verse range."
        : "The scripture service had trouble with that reference."
    );
  }

  const data = (await res.json()) as {
    reference?: string;
    text?: string;
    translation_id?: string;
    verses?: { verse: number; text: string }[];
  };

  if (!data.text || !data.reference) {
    throw new BibleError("Passage not found — check the book name and verse range.");
  }

  // Keep studies to a sane length (~15k chars ≈ several chapters).
  if (data.text.length > 15000) {
    throw new BibleError("That's a long stretch of scripture — pick a passage under ~3 chapters.");
  }

  return {
    reference: data.reference,
    translation: (data.translation_id ?? translation).toUpperCase(),
    text: data.text.trim(),
    verses: (data.verses ?? []).map((v) => ({ verse: v.verse, text: v.text.trim() })),
  };
}

export class BibleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BibleError";
  }
}
