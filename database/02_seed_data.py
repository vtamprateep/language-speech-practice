"""Seed database tables with data from data files"""

import json
from dotenv import load_dotenv
from supabase import create_client, Client
import os


def seed_vocabulary(client: Client, seed_path: str):
    with open(seed_path, "r") as fp:
        data = json.load(fp)

    # Format camelCase columns to snake_case
    column_name_map = {
        "partOfSpeech": "part_of_speech",
        "topicEnglish": "topic_english",
        "vocabularyEnglish": "vocabulary_english"
    }

    formatted_data = []
    for entry in data:
        new_entry = {
            column_name_map.get(k, k): v
            for k, v in entry.items()
        }
        formatted_data.append(new_entry)

    response = client.table("vocabulary").upsert(formatted_data).execute()
    return response


def seed_grammar(client: Client, seed_path: str):
    with open(seed_path, "r") as fp:
        data = json.load(fp)

    response = client.table("grammar").upsert(formatted_data).execute()
    return response

    
def get_supabase_client(url: str, key: str) -> Client:
    return create_client(url, key)


VOCABULARY_SEED_PATH = "./seed/vocabulary_data.json"
GRAMMAR_SEED_PATH = "./seed/grammar_data.json"

if __name__ == "__main__":

    # Set-up client
    load_dotenv()
    client = get_supabase_client(
        os.environ["DB_URL"],
        os.environ["DB_SERVICE_KEY"]
    )

    # # Load vocabulary data
    # response = seed_vocabulary(client, VOCABULARY_SEED_PATH)
    # print(f"Inserted into vocabulary response: {response}")

    # Load grammar data
    repsonse = seed_grammar(client, GRAMMAR_SEED_PATH)
    print(f"Inserted into grammar repsonse: {response}")