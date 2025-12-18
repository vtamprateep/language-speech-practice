import logging

from fastapi import APIRouter, Depends, Query
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.dependencies import get_clients, get_models
from app.util.format import to_camel_case
from app.util.languages import Language
from app.util.srs.policy import ExponentialSRSPolicy, SRSItem

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
    return JSONResponse(content={"text": translated_text})


class TextComparison(BaseModel):
    text_1: str
    text_2: str


@router.post("/api/v1/calculate_similarity")
async def calculate_similarity(body: TextComparison, client=Depends(get_clients)):
    client = client["HFInferenceClient"]
    score = client.sentence_similarity(
        body.text_1, [body.text_2], model="sentence-transformers/all-MiniLM-L6-v2"
    )
    LOG.info(f"score: {str(score[0])}")
    return JSONResponse(content={"score": str(score[0])})


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
    return [{to_camel_case(k): v for k, v in entry.items()} for entry in output]


@router.get("/api/v1/get_vocabulary_by_id")
async def get_vocabulary_by_id(
    arr_id: list[int] = Query(...), client=Depends(get_clients)
):
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
    return [{to_camel_case(k): v for k, v in entry.items()} for entry in output]


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

    return [{to_camel_case(k): v for k, v in entry.items()} for entry in response.data]


@router.get("/api/v1/get_vocabulary_progress")
async def get_vocabulary_progress(
    user_id: str, arr_id: list[int] = Query(...), client=Depends(get_clients)
):
    client = client["SupabaseClient"]
    response = (
        client.table("vocabulary_progress")
        .select("id", "user_id", "vocabulary_id", "count_wrong", "count_correct")
        .eq("user_id", user_id)
        .in_("vocabulary_id", arr_id)
        .execute()
    )

    return [{to_camel_case(k): v for k, v in entry.items()} for entry in response.data]


class VocabularyProgressNewRecords(BaseModel):
    vocabulary_id: list[int]


@router.put("/api/v1/put_vocabulary_progress_new_records/{user_id}")
def put_vocabulary_progress_new_records(
    user_id: str, body: VocabularyProgressNewRecords, client=Depends(get_clients)
):
    """Creates new records in vocabulary_progress table for each arr_id representing
    a new vocabulary_id."""

    client = client["SupabaseClient"]

    # Format data to be inserted
    data = [{"user_id": user_id, "vocabulary_id": id} for id in body.vocabulary_id]

    response = client.table("vocabulary_progress").insert(data).execute()

    return [{to_camel_case(k): v for k, v in entry.items()} for entry in response.data]


class VocabularyProgress(BaseModel):
    id: int
    user_id: str
    vocabulary_id: int
    count_wrong: int
    count_correct: int


@router.put("/api/v1/put_vocabulary_progress_update_records")
def put_vocabulary_progress_update_records(
    body: list[VocabularyProgress], client=Depends(get_clients)
):
    """Update track record of getting a vocabulary correct or wrong. Returns
    last record updated."""
    client = client["SupabaseClient"]

    # Perform update
    for entry in body:
        json_entry = jsonable_encoder(entry)
        response = (
            client.table("vocabulary_progress")
            .update(json_entry)
            .eq("id", entry.id)
            .execute()
        )

    return [{to_camel_case(k): v for k, v in entry.items()} for entry in response.data]


@router.get("/api/v1/get_vocabulary_id_by_policy/{user_id}")
def get_vocabulary_id_by_policy(user_id: str, client=Depends(get_clients)):
    """Returns array of vocabulary ID that user should review next. For vocabulary seen, passes
    through policy to see if they have been mastered. Pads vocabulary ID arr with new vocabulary
    up to 8 total entries."""
    client = client["SupabaseClient"]
    TARGET_VOCABULARY = 8

    # Get all vocabulary progress for a user
    response = (
        client.table("vocabulary_progress")
        .select("id", "user_id", "vocabulary_id", "count_wrong", "count_correct")
        .eq("user_id", user_id)
        .execute()
    )
    vocab_progress_all = response.data
    vocab_progress_all_id = [
        entry["vocabulary_id"]
        for entry in vocab_progress_all
    ]

    if vocab_progress_all != []:
        # Determine which vocabulary needs review
        vocabulary_id_arr = ExponentialSRSPolicy.retrieve_items(
            [
                SRSItem(
                    id=entry["vocabulary_id"],
                    count_correct=entry["count_correct"],
                    count_wrong=entry["count_wrong"],
                )
                for entry in vocab_progress_all
            ],
            N=TARGET_VOCABULARY,
        )
    else:
        vocabulary_id_arr = []

    # Pad remaining vocabulary
    pad_vocab = TARGET_VOCABULARY - len(vocabulary_id_arr)
    response = (
        client.table("vocabulary")
        .select("id")
        .not_.is_("relative_freq_pct", "null")
        .not_.in_("id", vocab_progress_all_id)
        .order("relative_freq_pct", desc=True)
        .limit(pad_vocab)
        .execute()
    )

    return [entry["id"] for entry in response.data] + vocabulary_id_arr
