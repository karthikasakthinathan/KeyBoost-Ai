export type Keyword = { keyword: string; volume: number; source?: string };
export type RealSearch = { seed: string; suggestions: string[] };
export type Ad = {
  headline: string; description: string; cta: string; url: string; target_audience: string; target_location: string;
  recommended_keywords: string[]; caption: string; hashtags: string[]; bullets: string[]; photo_query: string;
};
export type Result = {
  analysis: { product: string; service: string; usp: string; audience: string; location: string };
  primary_keywords: Keyword[]; related_keywords: Keyword[]; long_tail_keywords: Keyword[];
  location_keywords: Keyword[]; trending_keywords: Keyword[]; real_searches: RealSearch[]; advertisement: Ad;
};
export type Photo = { image: string; credit: string; link: string };

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function post<T>(path: string, body: object): Promise<T> {
  const r = await fetch(API + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(typeof j.detail === "string" ? j.detail : "Request failed");
  return j as T;
}
export const generate = (description: string) => post<Result>("/generate", { description });
export const createImage = (query: string) => post<Photo>("/image", { query });

export const fmt = (v: number) => (v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(".0", "") + "K" : String(v));
export const save = (description: string, result: Result) => sessionStorage.setItem("kb", JSON.stringify({ description, result }));
export const load = (): { description: string; result: Result } | null => {
  try { return JSON.parse(sessionStorage.getItem("kb") || "null"); } catch { return null; }
};