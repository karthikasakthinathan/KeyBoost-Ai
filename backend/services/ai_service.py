import json, os, re
from groq import AsyncGroq
from models.schemas import GenerateResponse, RealSearch

client = AsyncGroq()  # reads GROQ_API_KEY from .env
MODEL = os.getenv("MODEL", "openai/gpt-oss-120b")

SYSTEM = """You are a digital marketing expert for small businesses in India.
Analyze the business description, then return ONLY valid JSON (no markdown) in this shape:
{"analysis":{"product":str,"service":str,"usp":str,"audience":str,"location":str},
 "primary_keywords":[{"keyword":str,"volume":int}],
 "related_keywords":[...same], "long_tail_keywords":[...same], "location_keywords":[...same],
 "advertisement":{"headline":str,"description":str,"cta":str,"url":"www.yourbrand.com",
   "target_audience":str,"target_location":str,"recommended_keywords":[str],
   "caption":str,"hashtags":[str],"bullets":[str,str,str],
   "photo_query":"2-3 simple English words naming the main PRODUCT to photograph (examples: birthday cake, organic fruits, handmade candles). Do not use the city name or the occasion."}}
Rules: exactly 5 items per keyword list, highest volume first. volume = your estimate of monthly searches in India.
Location keywords use the city in the description (if none, use 'near me' style and location 'India').
Headline MAX 30 characters and description MAX 90 characters (Google Ads limits). Hashtags start with #.
If REAL Google autocomplete searches are provided: they may include irrelevant phrases (other cities or countries,
unrelated products such as party halls, other companies' brand names). Use only the real phrases that fit this business
and its city, copy them exactly, do not reword them, and skip the rest. Fill gaps with your own keywords.
Use the real phrases in the ads too."""

SEED_SYSTEM = """Return ONLY JSON: {"seeds": [str, str, str]}.
Give 3 short Google search phrases (2 to 4 words, lowercase) that a customer would start typing to find this business.
If the description names a city, include the city in one of the phrases."""


def parse_json(text: str):
    return json.loads(re.sub(r"```json|```", "", text).strip())


async def _chat(system: str, user: str, max_tokens: int) -> str:
    extra = {"reasoning_effort": "low"} if "gpt-oss" in MODEL else {}
    res = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        response_format={"type": "json_object"},
        temperature=0.5,
        max_completion_tokens=max_tokens,
        **extra,
    )
    return res.choices[0].message.content


async def get_seeds(description: str) -> list[str]:
    """Step 1: AI picks short phrases to look up in Google autocomplete."""
    try:
        data = parse_json(await _chat(SEED_SYSTEM, f"Business description:\n{description}", 1500))
        return [s for s in data.get("seeds", []) if isinstance(s, str)][:3]
    except Exception as e:
        print("Seed step failed:", e)
        return []


async def generate(description: str, real: list[RealSearch] | None = None) -> GenerateResponse:
    """Step 3: AI builds keywords and ads, using the real searches when we have them."""
    user = f"Business description:\n{description}"
    if real:
        lines = "\n".join(f"- {g.seed}: " + "; ".join(g.suggestions) for g in real)
        user += f"\n\nREAL Google autocomplete searches (what people actually type in India):\n{lines}"
    result = GenerateResponse(**parse_json(await _chat(SYSTEM, user, 4000)))

    # The backend decides what is "real", not the AI: exact match with the real suggestions.
    real_set = {s.strip().lower() for g in (real or []) for s in [g.seed, *g.suggestions]}
    for group in (result.primary_keywords, result.related_keywords, result.long_tail_keywords, result.location_keywords):
        for k in group:
            k.source = "real" if k.keyword.strip().lower() in real_set else "ai"
    result.real_searches = real or []
    return result