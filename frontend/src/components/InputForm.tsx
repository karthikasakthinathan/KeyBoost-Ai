"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generate, save } from "@/lib/api";
import Loading from "./Loading";

const EXAMPLES = ["Organic skincare products", "Handmade candles online", "Fresh fruits delivery in Coimbatore", "Online clothing store"];

export default function InputForm() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  async function go() {
    const t = text.trim();
    if (t.length < 10) { setErr("Write at least 10 characters about your business."); return; }
    setBusy(true); setErr("");
    try { save(t, await generate(t)); router.push("/results"); }
    catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong."); setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-white p-4 text-left shadow-[0_24px_50px_-28px_rgba(10,76,245,.45)]">
      <label htmlFor="desc" className="sr-only">Describe your product or company</label>
      <textarea id="desc" value={text} maxLength={500} onChange={(e) => setText(e.target.value)} placeholder="Describe your product or company..."
        className="h-28 w-full resize-none rounded-xl border border-line bg-mist p-3 text-[15px] outline-none focus:border-brand" />
      <div className="mt-1 text-right text-xs text-mute">{text.length}/500</div>
      <button onClick={go} disabled={busy} className="mt-2 w-full rounded-full bg-brand py-3 font-bold text-white shadow-lg shadow-brand/40 hover:brightness-110 disabled:opacity-60">
        {busy ? "Analyzing…" : "Generate keywords and ad ideas"}
      </button>
      {busy && <Loading />}
      {err && <p role="alert" className="mt-2 text-sm text-red-600">{err}</p>}
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((x) => (
          <button key={x} onClick={() => setText(x)} className="rounded-full border border-line px-3 py-1 text-sm text-mute hover:border-brand hover:text-brand">{x}</button>
        ))}
      </div>
    </div>
  );
}