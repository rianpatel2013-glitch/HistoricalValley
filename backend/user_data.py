# Learning how to connect to Supabase with Python

import os
from supabase import create_client, Client
from supabase.client import ClientOptions
from dotenv import load_dotenv

load_dotenv()
url: str = os.getenv("Supabase_url")
key: str = os.getenv("Supabase_api_key")

supabase: Client = create_client(
    url,
    key,
    options=ClientOptions(
        postgrest_client_timeout=10,
        storage_client_timeout=10,
        schema="public",
    )
)

response = (
    supabase.table("")
    .insert({"id": 1, "name": "Pluto"})
    .execute()
)