import os, random, urllib.parse, httpx
from fastapi import APIRouter
from models.schemas import ImageRequest

router = APIRouter()
APP = "KeyBoost_AI"  # utm_source (your Unsplash app name)


async def unsplash(query: str, key: str):
    headers = {"Authorization": f"Client-ID {key}", "Accept-Version": "v1"}
    async with httpx.AsyncClient(timeout=20, headers=headers) as c:
        # try the full query first, then the first 2 words
        for q in dict.fromkeys([query, " ".join(query.split()[:2])]):
            r = await c.get("https://api.unsplash.com/search/photos", params={
                "query": q, "per_page": 20, "orientation": "squarish", "content_filter": "high",
            })
            if r.status_code != 200:
                return None
            results = r.json().get("results", [])
            if results:
                p = random.choice(results)
                try:  # Unsplash rule: trigger the download endpoint when a photo is used
                    await c.get(p["links"]["download_location"])
                except Exception:
                    pass
                profile = p["user"]["links"]["html"] + f"?utm_source={APP}&utm_medium=referral"
                return {"image": p["urls"]["regular"], "credit": f"Photo by {p['user']['name']} on Unsplash", "link": profile}
    return None


def pollinations(query: str):
    prompt = f"Photorealistic professional advertising photo of {query}, natural light, shallow depth of field, no text, no logo"
    url = ("https://image.pollinations.ai/prompt/" + urllib.parse.quote(prompt)
           + f"?width=1024&height=1024&nologo=true&seed={random.randint(1, 999999)}")
    return {"image": url, "credit": "AI image by Pollinations", "link": "https://pollinations.ai"}


@router.post("/image")
async def image(req: ImageRequest):
    key = os.getenv("UNSPLASH_ACCESS_KEY")
    if key:
        result = await unsplash(req.query, key)
        if result:
            return result
    return pollinations(req.query)  # no key, or Unsplash failed