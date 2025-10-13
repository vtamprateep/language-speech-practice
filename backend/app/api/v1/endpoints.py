import io

import numpy as np

# import soundfile as sf  # type: ignore
from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

# from pydub import AudioSegment  # type: ignore
from app.dependencies import get_clients, get_models
from app.util.languages import Language
from app.util.model import AudioData

router = APIRouter()


class TextTranslate(BaseModel):
    text: str
    sourceLang: Language
    targetLang: Language


@router.post("/api/v1/translate_text")
async def translate_text(body: TextTranslate, model=Depends(get_models)):
    return JSONResponse(
        content={
            "text": model["TextTranslator"].translate(
                text=body.text, source=body.sourceLang, target=body.targetLang
            )
        }
    )


class TextComparison(BaseModel):
    text_1: str
    text_2: str


@router.post("/api/v1/calculate_similarity")
async def calculate_similarity(body: TextComparison, client=Depends(get_clients)):
    client = client["HFInferenceClient"]
    score = client.sentence_similarity({
        "source_sentence": body.text_1,
        "sentences": [body.text_2]
    })
    return JSONResponse(
        content={
            "score": str(score)
        }
    )


class TTSRequest(BaseModel):
    text: str
    language: str


# @router.post("/api/v1/generate_audio")
# async def generate_audio(body: TTSRequest, model=Depends(get_models)):
#     audio_data = model["KokoroModel"].run_inference(body.text, body.language)

#     # De-normalize audio array
#     denormalized_audio_data = (audio_data.raw * 32767).astype("int16")

#     audio_segment = AudioSegment(
#         data=denormalized_audio_data,
#         frame_rate=audio_data.sampling_rate,
#         sample_width=2,  # 16-bit
#         channels=1,
#     )

#     # Write to an in-memory buffer
#     buffer = io.BytesIO()
#     audio_segment.export(out_f=buffer, format="webm")
#     buffer.seek(0)

#     return StreamingResponse(
#         content=buffer,
#         media_type="audio/webm",
#         headers={"Content-Disposition": "attachment; filename=output.webm"},
#     )
