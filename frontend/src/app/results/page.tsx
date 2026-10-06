"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Keyword, Result, load } from "@/lib/api";
import KeywordCard from "@/components/KeywordCard";
import AdPreview from "@/components/AdPreview";

type Saved = { description: string; result: Result };

export default function Results() {
  const [s, setS] = useState<Saved | null | undefined>(undefined);
  useEffect(() => setS(load()), []);
  if (s === undefined) return null;
  if (!s) return <main className="p-10 text-center"><p className="mb-3 text-mute">No results yet.</p><Link href="/" className="font-bold text-brand">← Back to search</Link></main>;

  const { description, result: r } = s;
  const a = r.analysis;
  const copy = (t: string) => navigator.clipboard?.writeText(t);
  const real = r.real_searches ?? [];
  const groups: [string, string, Keyword[]][] = [
    ["🎯", "Primary keywords", r.primary_keywords], ["🔎", "Related keywords", r.related_keywords],
    ["📝", "Long-tail keywords", r.long_tail_keywords], ["📍", "Location keywords", r.location_keywords],
  ];
  if (r.trending_keywords.length) groups.push(["📈", "Current / trending keywords", r.trending_keywords]);

  function download() {
    const q = (t: string) => `"${t.replace(/"/g, '""')}"`;
    const lines = [
      "category,keyword,est_monthly_searches,source",
      ...groups.flatMap(([, t, items]) => items.map((i) => `${q(t)},${q(i.keyword)},${i.volume},${i.source === "real" ? "real" : "ai"}`)),
      ...real.flatMap((g) => g.suggestions.map((x) => `${q("Real search (Google autocomplete)")},${q(x)},,real`)),
      "", `${q("Ad headline")},${q(r.advertisement.headline)}`, `${q("Ad description")},${q(r.advertisement.description)}`,
    ];
    const el = document.createElement("a");
    el.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    el.download = "keyboost-results.csv"; el.click();
  }
  const chips: [string, string][] = [["Product", a.product], ["Service", a.service], ["USP", a.usp], ["Audience", a.audience], ["Location", a.location]];

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20">
      <Link href="/" className="text-sm font-bold text-brand">← Back to search</Link>
      <div className="mb-5 mt-2 flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-3xl font-extrabold tracking-tight">Keyword &amp; advertising insights</h1>
          <p className="text-mute">Based on your description, here are the most relevant keywords and ad ideas.</p></div>
        <button onClick={download} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-brand shadow-sm">Download results</button>
      </div>

      <div className="mb-6 rounded-2xl border border-line bg-white p-4">
        <div className="flex items-start justify-between gap-3"><div><p className="font-extrabold">Your description</p><p className="text-mute">{description}</p></div>
          <Link href="/" className="rounded-full border border-line px-3 py-1 text-sm font-bold">Edit</Link></div>
        <div className="mt-3 flex flex-wrap gap-2">{chips.filter(([, v]) => v).map(([l, v]) => <span key={l} className="rounded-full bg-mist px-3 py-1 text-sm"><b>{l}:</b> {v}</span>)}</div>
      </div>

      <h2 className="mb-1 text-2xl font-extrabold">🤖 Keywords built from real searches + AI</h2>
      <p className="mb-3 text-sm text-mute">Keywords with a <b className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] text-white">REAL</b> badge were found in real Google searches. The others are AI suggestions. Volume numbers are AI estimates.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{groups.map(([i, t, items]) => <KeywordCard key={t} icon={i} title={t} items={items} />)}</div>

      <h2 className="mb-1 mt-10 text-2xl font-extrabold">📊 Real search data</h2>
      <p className="mb-3 text-sm text-mute">What people are actually typing into Google search (autocomplete suggestions). Google does not share volume numbers here.</p>
      {real.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {real.map((g) => (
            <section key={g.seed} className="rounded-2xl border border-line bg-white p-4">
              <h3 className="mb-2 text-sm text-mute">People searching “{g.seed}” also type</h3>
              <ul>
                {g.suggestions.map((x) => (
                  <li key={x} className="flex items-center justify-between gap-2 border-t border-line py-2 text-sm first:border-0">
                    <span>{x}</span>
                    <button aria-label={`Copy ${x}`} onClick={() => copy(x)} className="text-mute hover:text-brand">⧉</button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-line bg-white p-4 text-sm text-mute">Real search data kidaikkala (Google suggestions ippo available illa). AI keywords mela irukku.</p>
      )}

      <h2 className="mb-3 mt-10 text-2xl font-extrabold">Advertising ideas</h2>
      <AdPreview ad={r.advertisement} />
    </main>
  );
}