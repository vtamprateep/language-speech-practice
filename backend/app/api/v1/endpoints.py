import io
import logging

import numpy as np
from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from app.dependencies import get_clients, get_models
from app.util.languages import Language
from app.util.model import AudioData

LOG = logging.getLogger(__name__)
router = APIRouter()


class TextTranslate(BaseModel):
    text: str
    sourceLang: Language
    targetLang: Language


@router.post("/api/v1/translate_text")
async def translate_text(body: TextTranslate, model=Depends(get_models)):
    translated_text = model["TextTranslator"].translate(
        text=body.text, source=body.sourceLang, target=body.targetLang
    )
    LOG.info(f"text: {translated_text}")
    return JSONResponse(
        content={
            "text": translated_text
        }
    )


class TextComparison(BaseModel):
    text_1: str
    text_2: str


@router.post("/api/v1/calculate_similarity")
async def calculate_similarity(body: TextComparison, client=Depends(get_clients)):
    client = client["HFInferenceClient"]
    score = client.sentence_similarity(
        body.text_1,
        [body.text_2],
        model="sentence-transformers/all-MiniLM-L6-v2"
    )
    LOG.info(f"score: {str(score[0])}")
    return JSONResponse(
        content={
            "score": str(score[0])
        }
    )


class TTSRequest(BaseModel):
    text: str
    language: str
