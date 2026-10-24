"use client";

import { useMemo, useState } from "react";
import { analyzeText } from "@/lib/text-stats";

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800/60">
      <div className="text-xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <div className="space-y-5">
      <label htmlFor="wc-text" className="sr-only">
        Text to analyze
      </label>
      <textarea
        id="wc-text"
        rows={8}
        placeholder="Type or paste your text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat value={stats.words} label="Words" />
        <Stat value={stats.characters} label="Characters" />
        <Stat value={stats.charactersNoSpaces} label="No spaces" />
        <Stat value={stats.sentences} label="Sentences" />
        <Stat value={stats.paragraphs} label="Paragraphs" />
        <Stat value={`${stats.readingTimeMinutes} min`} label="Read time" />
      </div>
    </div>
  );
}
