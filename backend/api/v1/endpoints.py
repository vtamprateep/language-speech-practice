from dependencies import get_models
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from util.languages import Language

router = APIRouter()


class TextTranslate(BaseModel):
    text: str
    sourceLang: Language
    targetLang: Language


@router.post("/api/v1/translate_text")
async def translate_text(body: TextTranslate, model=Depends(get_models)):
    text_translation_model = model["TextTranslator"]
    return JSONResponse(
        content={
            "text": text_translation_model.translate(
                text=body.text, source=body.sourceLang, target=body.targetLang
            )
        }
    )
