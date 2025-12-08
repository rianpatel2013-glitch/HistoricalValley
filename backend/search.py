from flask import request, jsonify
from google import genai
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch
from dotenv import load_dotenv
import os
import markdown2
import json

load_dotenv()

client = genai.Client(api_key=os.getenv("Gemini_api_key"))
model = "gemini-2.5-flash"

tools = [
    Tool(google_search=GoogleSearch())
]

instructions = (
    "Your goal is to answer the user's questions."
    + "\nAdd Valley Ranch in Irving, Texas as context, but if you cannot find any info that makes sense, don't use it as context."
    + "\nUse Google Search to find reliable information."
    + "\nAlways include citations for which URLs you use."
    + "\nFormat your answers in Markdown with headings, bullet points, and emojis where appropriate."
    + "\nNEVER provide your thinking process. Just provide the final answer with citations."
)

# Store chat sessions
chat_sessions = {}

def chat_post(*args, **kwargs):
    try:
        data = request.get_json(silent=True) or {}
        query = data.get("prompt", "")
        session_id = data.get("session_id", "default")

        if not query:
            return jsonify({"error": "No prompt provided"}), 400

        if session_id not in chat_sessions or chat_sessions[session_id] is None:
            chat_sessions[session_id] = client.chats.create(
                model=model,
                config=GenerateContentConfig(
                    tools=tools,
                    system_instruction=instructions,
                    temperature=0.3
                )
            )

        chat = chat_sessions[session_id]

        # Send message
        response = chat.send_message(query)

        # Extract response text safely
        response_text = None
        if hasattr(response, "text") and response.text:
            response_text = response.text
        elif hasattr(response, "candidates") and response.candidates:
            candidate = response.candidates[0]
            if hasattr(candidate, "content") and candidate.content.parts:
                response_text = "".join(
                    [part.text for part in candidate.content.parts if hasattr(part, "text")]
                )

        if not response_text:
            return jsonify({
                "error": "No response text from AI",
                "response": "The AI did not provide a response."
            }), 500

        # Convert Markdown → HTML (preserve line breaks)
        html_response = markdown2.markdown(
            response_text,
            extras=["break-on-newline", "fenced-code-blocks", "tables"]
        )

        return jsonify({"response": html_response})

    except Exception as e:
        print(f"Error in chat_post: {str(e)}")
        import traceback
        traceback.print_exc()

        if session_id in chat_sessions:
            chat_sessions[session_id] = None

        return jsonify({
            "error": str(e),
            "response": f"An error occurred: {str(e)}"
        }), 500
