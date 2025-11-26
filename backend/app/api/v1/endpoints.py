
import logging

from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.dependencies import get_clients, get_models
from app.util.format import to_camel_case
from app.util.languages import Language

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


@router.get("/api/v1/get_vocabulary_by_level")
async def get_vocabulary_by_level(level: int, client=Depends(get_clients)):
    range_start = 0
    client = client["SupabaseClient"]
    output = []

    # Supabase has 1,000 record limit, loop to collect all records
    while True:
        response = (
            client.table("vocabulary")
            .select("*")
            .eq("level", level)
            .range(range_start, range_start + 999)
            .execute()
        )
        output += response.data

        if len(response.data) < 1000:
            break

        range_start += 1000

    # Format to camelCase
    return [
        {to_camel_case(k): v for k, v in entry.items()}
        for entry in output
    ]


@router.get("/api/v1/get_vocabulary_by_id")
async def get_vocabulary_by_id(arr_id: list[int] = Query(...), client=Depends(get_clients)):
    range_start = 0
    client = client["SupabaseClient"]
    output = []

    # Supabase has 1,000 record limit, loop to collect all records
    while True:
        response = (
            client.table("vocabulary")
            .select("*")
            .in_("id", arr_id)
            .range(range_start, range_start + 999)
            .execute()
        )
        output += response.data

        if len(response.data) < 1000:
            break

        range_start += 1000

    # Format to camelCase
    return [
        {to_camel_case(k): v for k, v in entry.items()}
        for entry in output
    ]


@router.get("/api/v1/get_vocabulary_top_n_frequency")
async def get_vocabulary_top_n_frequency(n: int = 10, client=Depends(get_clients)):
    client = client["SupabaseClient"]
    response = (
        client.table("vocabulary")
        .select("*")
        .not_.is_("relative_freq_pct", "null")
        .order("level", desc=False)
        .order("relative_freq_pct", desc=True)
        .limit(n)
        .execute()
    )

    return [
        {to_camel_case(k): v for k, v in entry.items()}
        for entry in response.data
    ]


@router.get("/api/v1/get_vocabulary_progress")
async def get_vocabulary_progress(
    user_id: str,
    arr_id: list[int] = Query(...),
    client=Depends(get_clients)
):
    client = client["SupabaseClient"]
    response = (
        client.table("vocabulary_progress")
        .select("vocabulary_id", "count_wrong", "count_correct")
        .in_("vocabulary_id", arr_id)
        .execute()
    )

    # Identify missing vocabulary IDs
    retrieved_vocab_id = set([
        entry["vocabulary_id"]
        for entry in response.data
    ])
    missing_vocab_id = set(arr_id).difference(retrieved_vocab_id)
    
    # Add missing vocabulary ID entries with defaults
    for id in missing_vocab_id:
        response.data.append({
            "vocabulary_id": id,
            "count_wrong": 0,
            "count_correct": 0
        })

    # Format and return response
    return [
        {to_camel_case(k): v for k, v in entry.items()}
        for entry in response.data
    ]
