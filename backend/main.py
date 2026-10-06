import os
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import keyword, advertising

app = FastAPI(title="KeyBoost AI")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("FRONTEND_URL", "http://localhost:3000").split(","),
    allow_methods=["*"], allow_headers=["*"],
)
app.include_router(keyword.router)
app.include_router(advertising.router)

@app.get("/health")
def health():
    return {"status": "ok"}
