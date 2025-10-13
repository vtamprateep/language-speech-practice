import os
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient

from app.api.v1 import endpoints
from app.util.model import TextTranslator

core_models: dict[str, Any] = dict()


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = {
        "TextTranslator": TextTranslator(),
    }
    app.state.clients = {
        "HFInferenceClient": InferenceClient(
            provider="hf-inference",
            api_key=os.environ["HF_TOKEN"]
        )
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
