from flask import request, jsonify 
from google import genai 
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch, UrlContext
from dotenv import load_dotenv 
import os, json 
 
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
    "Use the following URLs as your **primary sources** for any question related to Valley Ranch:\n" 
    + "\n".join(urls) 
    + "\n\nIf the information is not sufficient in these URLs, you MUST automatically use Google Search to find reliable information." 
    + "\nAlways include citations for any URLs used, whether from the provided URLs or from Google Search results." 
    + "\nDo not ask the user for permission to search. Always answer using the tools if needed." 
    + "\nIf the user's question is unrelated to Valley Ranch, meaning it's completely unrelated to Valley Ranch even if you put Valley Ranch in the prompt, clearly state that but still answer using Google Search." 
    + "\nNEVER provide your thinking process or internal deliberations in your response. Just provide the final answer with citations." 
    + "\nNever use Wikipedia as a source." 
    + "\nonly give valley ranch information" 
) 
 
SEARCH_FILE = os.path.join(os.path.dirname(__file__), "Search.json") 

# Store conversation history manually for each session as simple strings
conversation_history = {}

def get_or_create_history(session_id="default"):
    # Get existing conversation history or create new empty string
    if session_id not in conversation_history:
        conversation_history[session_id] = ""
    return conversation_history[session_id]

def chat_post(*args, **kwargs): 
    # Handles AI generation with manual conversation memory
    try: 
        data = request.get_json(silent=True) or {} 
        query = data.get("prompt", "") 
        session_id = data.get("session_id", "default")
         
        if not query: 
            return jsonify({"error": "No prompt provided"}), 400 
 
        # Get conversation history for this session
        history = get_or_create_history(session_id)
        
        # Build the full prompt with conversation context
        if history:
            # Add previous conversation as context
            full_prompt = f"{history}\n\nUser: {query}"
        else:
            # First message in conversation
            full_prompt = f"User: {query}"
        
        # Send to Gemini with full conversation context
        response = client.models.generate_content( 
            model=model, 
            config=GenerateContentConfig( 
                tools=tools, 
                system_instruction=instructions 
            ), 
            contents=full_prompt
        ) 
 
        # Extract response text
        response_text = None
        if hasattr(response, 'text') and response.text:
            response_text = response.text
        elif hasattr(response, 'candidates') and response.candidates:
            candidate = response.candidates[0]
            if hasattr(candidate, 'content') and candidate.content.parts:
                response_text = ''.join([part.text for part in candidate.content.parts if hasattr(part, 'text')])
        
        if not response_text:
            return jsonify({"error": "No response text from AI", "response": "The AI did not provide a text response."}), 500
        
        # Update conversation history
        conversation_history[session_id] = f"{full_prompt}\n\nAssistant: {response_text}"
 
        # Save response 
        with open(SEARCH_FILE, "w", encoding="utf-8") as f: 
            json.dump({"response": response_text}, f, ensure_ascii=False, indent=2) 
 
        return jsonify({"response": response_text}) 
 
    except Exception as e: 
        print(f"Error in chat_post: {str(e)}")
        import traceback 
        traceback.print_exc()
        return jsonify({"error": str(e), "response": "An error occurred processing your request."}), 500 
 
 
def chat_get(*args, **kwargs): 
    # Returns last saved AI response
    try: 
        if not os.path.exists(SEARCH_FILE): 
            return jsonify({"response": None, "message": "No response yet"}) 
         
        with open(SEARCH_FILE, "r", encoding="utf-8") as f: 
            data = json.load(f) 
         
        return jsonify(data) 
     
    except Exception as e: 
        print(f"Error in chat_get: {str(e)}")
        return jsonify({"error": str(e), "response": None}), 500

def clear_session(session_id="default"):
    # Clear a specific conversation history
    if session_id in conversation_history:
        del conversation_history[session_id]
        return True
    return False