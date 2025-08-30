from contextlib import asynccontextmanager
from typing import Any

from app.api.v1 import endpoints
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.util.model import (
    KokoroModel,
    SemanticMatcher,
    TextTranslator,
    WhisperModel,
)

# text_dialogue_engine = dict()
core_models: dict[str, Any] = dict()


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = {
        "SemanticMatcher": SemanticMatcher(),
        "TextTranslator": TextTranslator(),
        "WhisperModel": WhisperModel(),
        "KokoroModel": KokoroModel(),
    }
    yield
    app.state.model.clear()


app = FastAPI(lifespan=lifespan)
app.include_router(endpoints.router)
app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
