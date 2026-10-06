"use client";
import { useEffect, useState } from "react";
import { Ad, createImage } from "@/lib/api";

const TABS = ["Google search ad", "Social media ad", "Ad copy and details"];
const card = "rounded-2xl border border-line bg-white p-5";

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  const run = () => navigator.clipboard?.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 1000); });
  return <button onClick={run} className="shrink-0 rounded-full border border-line px-3 py-1 text-xs font-bold text-brand hover:bg-mist">{ok ? "Copied" : label}</button>;
}
function GoogleWord() {
  const l: [string, string][] = [["G", "#4285f4"], ["o", "#ea4335"], ["o", "#fbbc05"], ["g", "#4285f4"], ["l", "#34a853"], ["e", "#ea4335"]];
  return <span className="text-lg font-bold">{l.map(([c, k], i) => <span key={i} style={{ color: k }}>{c}</span>)}</span>;
}
function Chips({ items }: { items: string[] }) {
  return <div className="flex flex-wrap gap-2">{items.map((x) => <span key={x} className="rounded-full border border-line bg-mist px-3 py-1 text-sm">{x}</span>)}</div>;
}

export default function AdPreview({ ad }: { ad: Ad }) {
  const [tab, setTab] = useState(0);
  const [img, setImg] = useState("");
  const [credit, setCredit] = useState<{ name: string; link: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const tags = ad.hashtags.join(" ");

  async function photo() {
    setBusy(true); setMsg("");
    try {
      const p = await createImage(ad.photo_query);
      if (!p.image.startsWith("https://")) throw new Error("Bad image");
      await new Promise<void>((ok, fail) => {
        const im = new Image();
        im.onload = () => ok();
        im.onerror = () => fail(new Error("Image did not load. Wait 15 seconds and try again."));
        im.src = p.image;
      });
      setImg(p.image);
      setCredit({ name: p.credit, link: p.link.startsWith("https://") ? p.link : "" });
    } catch (e) { setMsg(e instanceof Error ? e.message : "Photo failed"); }
    setBusy(false);
  }

  // Social media tab open aana auto ah photo edukkum
  useEffect(() => { if (tab === 1 && !img && !busy) photo(); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows: [string, string][] = [
    ["Ad headline", ad.headline], ["Ad description", ad.description], ["Call to action", ad.cta],
    ["Instagram caption", ad.caption], ["Hashtags", tags], ["Target audience", ad.target_audience],
    ["Target location", ad.target_location], ["Recommended ad keywords", ad.recommended_keywords.join(", ")],
  ];
  const all = rows.map(([l, v]) => `${l}: ${v}`).join("\n");

  return (
    <div>
      <div role="tablist" className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t, i) => (
          <button key={t} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}
            className={`rounded-full border px-4 py-2 text-sm font-bold ${tab === i ? "border-brand bg-brand text-white" : "border-line bg-white text-mute hover:text-brand"}`}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={card}>
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2"><GoogleWord /><span className="text-sm font-bold text-mute">Search ad preview</span></div>
              <CopyBtn text={`${ad.headline}\n${ad.description}`} />
            </div>
            <div className="rounded-xl border border-line bg-air p-4">
              <p className="text-xs font-bold">Sponsored</p>
              <p className="mt-1 text-xl font-bold leading-snug text-[#1a4fd6]">{ad.headline}</p>
              <p className="text-sm font-bold text-[#188038]">{ad.url}</p>
              <p className="mt-1 text-sm text-mute">{ad.description}</p>
              <span className="mt-3 inline-block rounded-full bg-brand px-4 py-1.5 text-sm font-bold text-white">{ad.cta}</span>
            </div>
          </div>
          <div className={card}>
            <div className="mb-3 flex items-center justify-between gap-2"><h3 className="font-extrabold">Keywords this ad targets</h3><CopyBtn text={ad.recommended_keywords.join(", ")} label="Copy keywords" /></div>
            <Chips items={ad.recommended_keywords} />
            <p className="mb-1 mt-5 text-sm text-mute">Target audience</p><p className="text-sm">{ad.target_audience}</p>
            <p className="mb-1 mt-3 text-sm text-mute">Target location</p><p className="text-sm">{ad.target_location}</p>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={card}>
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-xs text-white">◎</span><span className="text-sm font-bold text-mute">Instagram ad preview</span></div>
              <CopyBtn text={`${ad.caption} ${tags}`} />
            </div>
            <div className="mx-auto max-w-sm overflow-hidden rounded-xl border border-line">
              <div className="flex items-center gap-2 p-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand to-sky text-sm font-bold text-white">Y</span>
                <div><p className="text-sm font-bold leading-none">yourbrand</p><p className="text-xs text-mute">Sponsored · {ad.target_location}</p></div></div>
              <div className="relative flex aspect-square flex-col justify-end bg-gradient-to-br from-brand to-sky bg-cover bg-center p-5 text-white" style={img ? { backgroundImage: `url("${img}")` } : undefined}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                {busy && <p className="absolute inset-0 grid animate-pulse place-items-center bg-black/30 text-sm font-bold">Finding photo…</p>}
                <div className="relative">
                  <h4 className="text-2xl font-extrabold leading-tight">{ad.headline}</h4>
                  <ul className="my-2 text-sm">{ad.bullets.map((b) => <li key={b}>✓ {b}</li>)}</ul>
                  <span className="inline-block rounded-full bg-white px-4 py-1.5 text-sm font-bold text-brand">{ad.cta}</span>
                </div>
              </div>
              <div className="p-3 text-sm"><p className="mb-1 text-lg">♡ &nbsp;💬 &nbsp;➤</p><p><b>yourbrand</b> {ad.caption} <span className="text-brand">{tags}</span></p></div>
            </div>
          </div>
          <div className={card}>
            <div className="mb-1 flex items-center justify-between"><h3 className="font-extrabold">Post caption</h3><CopyBtn text={ad.caption} /></div>
            <p className="text-sm">{ad.caption}</p>
            <div className="mb-2 mt-5 flex items-center justify-between"><h3 className="font-extrabold">Hashtags</h3><CopyBtn text={tags} /></div>
            <Chips items={ad.hashtags} />
            <p className="mb-1 mt-5 text-sm text-mute">Button</p><p className="text-sm font-bold">{ad.cta}</p>
            <button onClick={photo} disabled={busy} className="mt-5 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
              {busy ? "Finding photo…" : img ? "New photo" : "Find realistic photo"}
            </button>
            {credit && <p className="mt-3 text-xs text-mute">{credit.link ? <a href={credit.link} target="_blank" rel="noreferrer" className="underline">{credit.name}</a> : credit.name}</p>}
            {msg && <p role="alert" className="mt-2 text-xs text-red-600">{msg}</p>}
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className={card}>
          <div className="mb-4 flex items-center justify-between gap-2"><h3 className="font-extrabold">Ad copy and details</h3><CopyBtn text={all} label="Copy all" /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {rows.map(([l, v]) => (
              <div key={l} className="flex items-start justify-between gap-3 rounded-xl bg-mist p-3">
                <div><p className="text-xs text-mute">{l}</p><p className="text-sm">{v}</p></div>
                <CopyBtn text={v} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}