import { describe, it, expect } from "vitest";
import { analyzeText } from "./text-stats";

describe("analyzeText", () => {
  it("returns zeros for empty text", () => {
    const s = analyzeText("");
    expect(s).toMatchObject({
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
    });
  });

  it("counts words and characters", () => {
    const s = analyzeText("Hello world");
    expect(s.words).toBe(2);
    expect(s.characters).toBe(11);
    expect(s.charactersNoSpaces).toBe(10);
  });

  it("counts sentences and paragraphs", () => {
    const text = "First sentence. Second one!\n\nA new paragraph here.";
    const s = analyzeText(text);
    expect(s.sentences).toBe(3);
    expect(s.paragraphs).toBe(2);
  });

  it("estimates reading time", () => {
    const words = Array.from({ length: 400 }, () => "word").join(" ");
    expect(analyzeText(words).readingTimeMinutes).toBe(2);
  });
});
