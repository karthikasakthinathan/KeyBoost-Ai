"use client";
import { useState } from "react";
import { Keyword, fmt } from "@/lib/api";

export default function KeywordCard({ icon, title, items }: { icon: string; title: string; items: Keyword[] }) {
  const [done, setDone] = useState("");
  const max = Math.max(1, ...items.map((i) => i.volume));
  const copy = (t: string, k: string) => navigator.clipboard?.writeText(t).then(() => { setDone(k); setTimeout(() => setDone(""), 900); });

  return (
    <section className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-extrabold">{icon} {title}</h3>
        <button onClick={() => copy(items.map((i) => i.keyword).join("\n"), "all")} className="text-xs font-bold text-brand">{done === "all" ? "Copied" : "Copy all"}</button>
      </div>
      <ul>
        {items.map((i) => (
          <li key={i.keyword} className="grid grid-cols-[1fr_56px_40px_22px] items-center gap-2 border-t border-line py-2 text-sm first:border-0">
            <span>
              {i.keyword}
              {i.source === "real" && <span title="Found in real Google searches" className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">REAL</span>}
            </span>
            <span className="h-1.5 overflow-hidden rounded-full bg-mist"><span className="block h-full rounded-full bg-gradient-to-r from-brand to-sky" style={{ width: `${(i.volume / max) * 100}%` }} /></span>
            <span className="text-right font-bold">{fmt(i.volume)}</span>
            <button aria-label={`Copy ${i.keyword}`} onClick={() => copy(i.keyword, i.keyword)} className="text-mute hover:text-brand">{done === i.keyword ? "✓" : "⧉"}</button>
          </li>
        ))}
      </ul>
    </section>
  );
}