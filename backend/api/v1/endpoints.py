import io

import numpy as np
import soundfile as sf  # type: ignore
from dependencies import get_models
from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from pydub import AudioSegment  # type: ignore
from util.languages import Language
from util.model import AudioData

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
async def calculate_similarity(body: TextComparison, model=Depends(get_models)):
    return JSONResponse(
        content={
            "score": model["SemanticMatcher"].get_similarity(body.text_1, body.text_2)
        }
    )


@router.post("/api/v1/transcribe_audio")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Form("ENGLISH"),
    model=Depends(get_models),
):
    audio_bytes = await file.read()
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format="webm")

    # Normalize for whisper
    dtype_map = {1: np.int8, 2: np.int16, 4: np.int32}
    dtype = dtype_map.get(audio.sample_width)
    audio = audio.set_channels(1)  # mono
    audio = audio.set_frame_rate(16000)  # 16kHz
    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    samples /= np.iinfo(dtype).max  # type: ignore
    sample_rate = audio.frame_rate

    result = model["WhisperModel"].run_inference(
        AudioData(sampling_rate=sample_rate, raw=samples), source_language=language
    )
    return JSONResponse(content={"text": result["text"]})


class TTSRequest(BaseModel):
    text: str
    language: str


@router.post("/api/v1/generate_audio")
async def generate_audio(body: TTSRequest, model=Depends(get_models)):
    audio_data = model["KokoroModel"].run_inference(body.text, body.language)

    # De-normalize audio array
    denormalized_audio_data = (audio_data.raw * 32767).astype("int16")

    audio_segment = AudioSegment(
        data=denormalized_audio_data,
        frame_rate=audio_data.sampling_rate,
        sample_width=2,  # 16-bit
        channels=1,
    )

    # Write to an in-memory buffer
    buffer = io.BytesIO()
    audio_segment.export(out_f=buffer, format="webm")
    buffer.seek(0)

    return StreamingResponse(
        content=buffer,
        media_type="audio/webm",
        headers={"Content-Disposition": "attachment; filename=output.webm"},
    )
