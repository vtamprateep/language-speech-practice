from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from lessons.beginner import AT_RESTAURANT
from lessons.mode import MandarinText
from pydantic import BaseModel

text_dialogue_engine = dict()


@asynccontextmanager
async def lifespan(app: FastAPI):
    text_dialogue_engine["mandarin_text"] = MandarinText()
    yield


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/configure/lesson")
async def configure_lesson():
    from lessons.beginner import AT_RESTAURANT

    text_dialogue_engine["mandarin_text"].add_grammar(AT_RESTAURANT["grammar"])
    text_dialogue_engine["mandarin_text"].add_scenario(AT_RESTAURANT["scenarios"])
    text_dialogue_engine["mandarin_text"].add_vocabulary(AT_RESTAURANT["vocabulary"])
    return "Lesson configured!"


class ChatInput(BaseModel):
    text: str


@app.post("/bot/chat")
async def chat(request: Request, input: ChatInput):
    prompt = input.text
    bot_response = text_dialogue_engine["mandarin_text"]._get_bot_response(prompt)
    return JSONResponse(content={"text": bot_response})
