from fastapi import APIRouter, HTTPException
from models.schemas import GenerateRequest, GenerateResponse
from services import ai_service, trend_service

router = APIRouter()


@router.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    try:
        description = req.description.strip()
        seeds = await ai_service.get_seeds(description)           # 1. AI picks seed phrases
        real = await trend_service.get_real_searches(seeds)        # 2. real Google suggestions
        data = await ai_service.generate(description, real)        # 3. AI builds results from real data
        data.trending_keywords = await trend_service.get_trending(description, data.analysis.location)
        return data
    except Exception as e:
        print("Generate failed:", e)
        raise HTTPException(status_code=502, detail="Could not generate results. Please try again.")