from flask import request, jsonify
from google import genai
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch, UrlContext
from dotenv import load_dotenv
import os
import json

load_dotenv()
client = genai.Client(api_key=os.getenv("Gemini_api_key"))
model = "gemini-2.5-flash"

tools = [
    Tool(url_context=UrlContext()),
    Tool(google_search=GoogleSearch())
]

urls = [
    "https://www.valleyranch.org",
    "https://www.cypresswaters.com/",
    "https://irvingchamber.com/resources-and-tools/irving-area-maps/valley-ranch/",
    "https://www.irvingtexas.com/plan-your-visit/about-irving/valley-ranch/",
    "https://statisticalatlas.com/neighborhood/Texas/Irving/Valley-Ranch/Overview",
    "https://www.trulia.com/n/tx/irving/valley-ranch/90246/",
    "https://www.irvingtexas.com/plan-your-visit/about-irving/history/"
]

instructions = (
    "You are a knowledgeable research assistant.\n\n"
    "You have access to two tools: 'url_context' and 'google_search'.\n"
    "Use the following URLs as your **primary sources** for any question related to Valley Ranch:\n"
    + "\n".join(urls)
    + "\n\nIf the information is not sufficient in these URLs, you MUST automatically use Google Search to find reliable information."
    + "\nAlways include citations for any URLs used, whether from the provided URLs or from Google Search results."
    + "\nDo not ask the user for permission to search. Always answer using the tools if needed."
    + "\nIf the user's question is unrelated to Valley Ranch, first indicate clearly: "
      "'This question is not related to Valley Ranch. I will answer using reliable online sources.' "
      "Then automatically use Google Search and cite the sources."
    + "\n**Never use Wikipedia as a source under any circumstances.**"
)

chat = client.chats.create(
    model=model,
    config=GenerateContentConfig(
        tools=tools,
        system_instruction=instructions
    )
)

SEARCH_FILE = os.path.join(os.path.dirname(__file__), "search.json")

def generate_response():
    """Handles POST requests: reads user prompt, sends to Gemini, saves to search.json"""
    data = request.get_json(silent=True) or {}
    query = data.get("prompt", "")

    if not query:
        return jsonify({"error": "No prompt provided"}), 400

    user_input = f"User's question: {query}"
    res = chat.send_message(user_input)

    # Save the AI response to search.json
    with open(SEARCH_FILE, "w", encoding="utf-8") as f:
        json.dump({"response": res.text}, f, ensure_ascii=False, indent=2)

    return jsonify({"message": "Processing complete", "response": res.text})


def get_response():
    if not os.path.exists(SEARCH_FILE):
        return jsonify({"response": None, "message": "No response yet"}), 404

    with open(SEARCH_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    return jsonify(data)