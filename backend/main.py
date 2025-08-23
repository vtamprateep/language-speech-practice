import io
from contextlib import asynccontextmanager
from typing import Any

import soundfile as sf  # type: ignore
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from util.languages import Language
from util.model import AudioData, SemanticMatcher, TextTranslator, WhisperModel

# text_dialogue_engine = dict()
core_models: dict[str, Any] = dict()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # text_dialogue_engine["mandarin_text"] = MandarinText()
    core_models["SemanticMatcher"] = SemanticMatcher()
    core_models["TextTranslator"] = TextTranslator()
    core_models["WhisperModel"] = WhisperModel()
    yield


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatInput(BaseModel):
    text: str


# @app.post("/bot/chat")
# async def chat(request: Request, input: ChatInput):
#     prompt = input.text
#     bot_response = text_dialogue_engine["mandarin_text"]._get_bot_response(prompt)
#     return JSONResponse(content={"text": bot_response})


class TextTranslate(BaseModel):
    text: str
    sourceLang: Language
    targetLang: Language


@app.put("/translate_text")
async def translate_text(body: TextTranslate):
    model = core_models["TextTranslator"]
    return JSONResponse(
        content={
            "text": model.translate(
                text=body.text, source=body.sourceLang, target=body.targetLang
            )
        }
    )


class TextComparison(BaseModel):
    text_1: str
    text_2: str


@app.put("/calculate_similarity")
async def calculate_similarity(body: TextComparison):
    print(body)
    model = core_models["SemanticMatcher"]
    text_1 = body.text_1
    text_2 = body.text_2
    return JSONResponse(content={"score": str(model.get_similarity(text_1, text_2))})


@app.post("/transcribe_audio")
async def transcribe_audio(
    file: UploadFile = File(...), language: str = Form("ENGLISH")
):
    audio_bytes = await file.read()
    data_arr, sample_rate = sf.read(io.BytesIO(audio_bytes))

    model = core_models["WhisperModel"]
    result = model.run_inference(
        AudioData(sampling_rate=sample_rate, raw=data_arr), source_language=language
    )
    return JSONResponse(content={"text": result["text"]})
