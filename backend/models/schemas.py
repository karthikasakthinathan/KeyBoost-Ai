from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    description: str = Field(min_length=10, max_length=500)


class Keyword(BaseModel):
    keyword: str
    volume: int = 0      # AI-estimated monthly searches
    source: str = "ai"   # "real" = found in Google autocomplete


class Analysis(BaseModel):
    product: str = ""
    service: str = ""
    usp: str = ""
    audience: str = ""
    location: str = ""


class Advertisement(BaseModel):
    headline: str
    description: str
    cta: str = "Shop Now"
    url: str = "www.yourbrand.com"
    target_audience: str = ""
    target_location: str = ""
    recommended_keywords: list[str] = []
    caption: str = ""
    hashtags: list[str] = []
    bullets: list[str] = []
    photo_query: str = ""


class RealSearch(BaseModel):
    seed: str
    suggestions: list[str] = []


class GenerateResponse(BaseModel):
    analysis: Analysis
    primary_keywords: list[Keyword]
    related_keywords: list[Keyword]
    long_tail_keywords: list[Keyword]
    location_keywords: list[Keyword]
    trending_keywords: list[Keyword] = []
    real_searches: list[RealSearch] = []
    advertisement: Advertisement


class ImageRequest(BaseModel):
    query: str = Field(min_length=2, max_length=100)