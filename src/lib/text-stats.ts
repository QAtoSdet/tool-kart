/**
 * Text statistics — pure and unit-tested. Used by the word/character counter.
 */

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  /** Estimated reading time in minutes (200 wpm), rounded up, min 0. */
  readingTimeMinutes: number;
}

export function analyzeText(text: string): TextStats {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

  // Sentences: runs ending in . ! or ? (collapse multiples).
  const sentenceMatches = trimmed === "" ? [] : trimmed.match(/[^.!?]+[.!?]+/g);
  const sentences = sentenceMatches
    ? sentenceMatches.length
    : trimmed === ""
      ? 0
      : 1;

  // Paragraphs: blocks separated by one or more blank lines.
  const paragraphs =
    trimmed === "" ? 0 : trimmed.split(/\n\s*\n/).filter((p) => p.trim() !== "").length;

  const readingTimeMinutes = words === 0 ? 0 : Math.ceil(words / 200);

  return { characters, charactersNoSpaces, words, sentences, paragraphs, readingTimeMinutes };
}
