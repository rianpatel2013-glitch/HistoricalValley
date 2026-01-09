from flask import request, jsonify
from google import genai
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch
from google.genai import errors
from dotenv import load_dotenv
import os
import markdown2

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
        try:
            response = chat.send_message(query)
        except errors.ClientError as e:
            # If quota exceeded, retry with a different API key
            if "429" in str(e):
                try:
                    # Retry by creating a new client and chat session with the backup api key
                    backup_client = genai.Client(api_key=os.getenv("Backup_api_key"))
                    new_chat = backup_client.chats.create(
                        model=model,
                        config=GenerateContentConfig(
                            tools=tools,
                            system_instruction=instructions,
                            temperature=0.3
                        )
                    )
                    response = new_chat.send_message(query)
                    # Only update session if successful
                    chat_sessions[session_id] = new_chat

                except errors.ClientError as backup_error:
                    # Both keys exhausted
                    if "429" in str(backup_error):
                        return jsonify({
                            "error": "API quota exceeded",
                            "response": "Both API keys have exceeded their daily quota. Please try again later."
                        }), 429
                    else:
                        raise
            else:
                raise

        # Getting response
        response_text = response.text

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

        sources = ""
        
        if response.candidates and len(response.candidates) > 0:
            grounding = response.candidates[0].grounding_metadata
            if grounding and hasattr(grounding, 'grounding_chunks') and grounding.grounding_chunks:
                for chunk in grounding.grounding_chunks:
                    if hasattr(chunk, 'web') and chunk.web:
                        sources += f'<li><a href="{chunk.web.uri}" class="source">{chunk.web.title}</a></li>\n'
        
        if sources:
            html_response += f"<h3>Sources:</h3>\n<ul>{sources}</ul>"

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
