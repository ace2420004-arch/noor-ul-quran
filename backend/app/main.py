from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import SessionLocal
from backend.app.services.seed_data import init_db

# Import API Routers
from backend.app.api.v1.quran import router as quran_router
from backend.app.api.v1.tafsir import router as tafsir_router
from backend.app.api.v1.search import router as search_router
from backend.app.api.v1.research import router as research_router
from backend.app.api.v1.ai_assistant import router as ai_router
from backend.app.api.v1.audio import router as audio_router
from backend.app.api.v1.hifz import router as hifz_router
from backend.app.api.v1.learning import router as learning_router
from backend.app.api.v1.journal import router as journal_router
from backend.app.api.v1.context import router as context_router
from backend.app.api.v1.admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure DB tables and seed canonical data
    init_db()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Authentic Multilingual Quran, Tafsir, AI Research & Learning Ecosystem API",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers under /api/v1
app.include_router(quran_router, prefix=settings.API_V1_STR)
app.include_router(tafsir_router, prefix=settings.API_V1_STR)
app.include_router(search_router, prefix=settings.API_V1_STR)
app.include_router(research_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(audio_router, prefix=settings.API_V1_STR)
app.include_router(hifz_router, prefix=settings.API_V1_STR)
app.include_router(learning_router, prefix=settings.API_V1_STR)
app.include_router(journal_router, prefix=settings.API_V1_STR)
app.include_router(context_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)

import os
from fastapi import Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Static Frontend Distribution Path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FRONTEND_DIST = os.path.join(ROOT_DIR, "frontend", "dist")

@app.get("/")
def root(request: Request):
    accept = request.headers.get("accept", "")
    dist_index = os.path.join(FRONTEND_DIST, "index.html")
    if "text/html" in accept and os.path.exists(dist_index):
        return FileResponse(dist_index)
    return {
        "project": settings.PROJECT_NAME,
        "arabic": settings.PROJECT_NAME_ARABIC,
        "tagline": "Understand the Quran. Reflect deeply. Live by its guidance.",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Noor-ul-Quran Backend API"}

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    audio_dir = os.path.join(FRONTEND_DIST, "audio")
    if os.path.exists(audio_dir):
        app.mount("/audio", StaticFiles(directory=audio_dir), name="audio")

    icons_dir = os.path.join(FRONTEND_DIST, "icons")
    if os.path.exists(icons_dir):
        app.mount("/icons", StaticFiles(directory=icons_dir), name="icons")

    @app.get("/{full_path:path}")
    async def serve_spa_paths(full_path: str):
        target = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(target) and os.path.isfile(target):
            return FileResponse(target)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"detail": "Not found"}

