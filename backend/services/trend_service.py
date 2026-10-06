import asyncio, os, re, json
import httpx
from models.schemas import Keyword, RealSearch
from services.ai_service import client

SUGGEST_URL = "https://suggestqueries.google.com/complete/search"


async def _suggest(c: httpx.AsyncClient, seed: str):
    try:
        r = await c.get(SUGGEST_URL, params={"client": "firefox", "q": seed, "hl": "en", "gl": "in"})
        if r.status_code != 200:
            return None
        items = [s for s in r.json()[1] if isinstance(s, str) and s.lower() != seed.lower()][:6]
        return RealSearch(seed=seed, suggestions=items) if items else None
    except Exception as e:
        print("Autocomplete failed:", e)
        return None


async def get_real_searches(seeds: list[str]) -> list[RealSearch]:
    """What people actually type in Google search (autocomplete). Returns [] on any problem."""
    seeds = list(dict.fromkeys(s.strip() for s in seeds if s.strip()))[:3]
    async with httpx.AsyncClient(timeout=8, headers={"User-Agent": "Mozilla/5.0"}) as c:
        found = await asyncio.gather(*[_suggest(c, s) for s in seeds])
    return [f for f in found if f]


async def get_trending(description: str, location: str) -> list[Keyword]:
    """Optional. Returns [] when disabled or on any error."""
    if os.getenv("ENABLE_TRENDS", "false").lower() != "true":
        return []
    try:
        r = await client.chat.completions.create(
            model=os.getenv("TREND_MODEL", "groq/compound-mini"),
            messages=[{"role": "user", "content":
                f"Search the web for search terms trending right now in India for this business: {description} "
                f"(location: {location}). Reply ONLY with a JSON array of up to 5 objects "
                '{"keyword": str, "volume": int} (rough monthly searches). Reply [] if nothing relevant.'}],
        )
        text = r.choices[0].message.content or ""
        m = re.search(r"\[.*\]", text, re.S)
        return [Keyword(**k) for k in json.loads(m.group(0))][:5] if m else []
    except Exception as e:
        print("Trend lookup failed:", e)
        return []