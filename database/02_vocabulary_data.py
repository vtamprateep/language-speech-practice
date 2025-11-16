"""Seed database tables with data from data files"""

import json
import os

from dotenv import load_dotenv
from hanziconv import HanziConv
from supabase import Client, create_client


def seed_vocabulary(client: Client, seed_path: str):
    with open(seed_path, "r") as fp:
        data = json.load(fp)

    response = client.table("vocabulary").upsert(formatted_data).execute()
    return response


def get_all_vocabulary(client: Client):
    range_start = 0
    all_data = []

    while True:
        response = client.table("vocabulary").select("*").range(range_start, range_start + 999).execute()
        data = response.data
        all_data += data

        if len(data) < 1000:
            break

        range_start += 1000
    
    return all_data


def trad_to_simplified(text: str) -> str:
    return HanziConv.toSimplified(text)

    
def get_supabase_client(url: str, key: str) -> Client:
    return create_client(url, key)


VOCABULARY_SEED_PATH = "./seed/vocabulary_data.json"

if __name__ == "__main__":

    # Set-up client
    load_dotenv()
    client = get_supabase_client(
        os.environ["DB_URL"],
        os.environ["DB_SERVICE_KEY"]
    )

    update_local_json(client, VOCABULARY_SEED_PATH)

    # # Load vocabulary data
    # response = seed_vocabulary(client, VOCABULARY_SEED_PATH)
    # print(f"Inserted into vocabulary response: {response}")

    # Get all vocabulary data
    # response = client.table("vocabulary").select("*").execute()
    # data = response.data

    # print(data)
    
    # # Generate simplified
    # for entry in data:
    #     entry["simplified"] = trad_to_simplified(entry["traditional"])
    
    # # Upsert back to table
    # response = client.table("vocabulary").upsert(data).execute()
    # print(response.count)