from google import genai
from dotenv import load_dotenv
import os
import json

load_dotenv()
client = genai.Client(os.getenv("API_KEY"))
model = "gemini-2.5-flash"
contents = (
	f"Use the provided URL contents to answer the user's question."
	f"Only if the information cannot be found in the provided contexts, search the web for reliable sources and use their info.\n\n"
	f"Always cite the source URLs.\n\n"
)
load_prompt_json = os.path.join(os.path.dirname(__file__), "search.json")
try:
	with open(load_prompt_json, "r", encoding="utf-8") as f:
		prompt_data = json.load(f)
		query = prompt_data.get("prompt", "")
except (FileNotFoundError, json.JSONDecodeError):
	query = "What's Valley Ranch's history?"

response = client.models.generate_content(
    model = model,
	contents = contents + query,
)

print(response.text) # For Now

# Old Code had a bug that wasn't fixing (forgot where in the Gemini API Docs I got it), so decided to try my own apporach

# def answer_query(query: str, urls: list[str], use_search: bool = True) -> dict:
# 	"""
# 	Use provided URLs (and optional GoogleSearch) to answer `query`.
# 	Returns a dict with 'answer' and 'url_context_metadata'.
# 	"""
# 	# Build tools: include UrlContext with the provided URLs
# 	tools = []
# 	if urls:
# 		tools.append(Tool(url_context=UrlContext(urls=urls)))
# 	# Optionally include GoogleSearch tool
# 	if use_search:
# 		tools.append(Tool(google_search=GoogleSearch()))

# 	# Instruct the model to rely on the provided URL contexts

# 	response = client.models.generate_content(
# 		model=model_id,
# 		contents=contents,
# 		config=GenerateContentConfig(tools=tools),
# 	)

# 	# Aggregate text parts
# 	answer_parts = []
# 	for part in response.candidates[0].content.parts:
# 		answer_parts.append(part.text)
# 	answer_text = "\n".join(answer_parts)

# 	return {
# 		"answer": answer_text,
# 		"url_context_metadata": response.candidates[0].url_context_metadata,
# 		"raw_response": response,
# 	}

# # Example usage when run as a script
# if __name__ == "__main__":
# 	YOUR_URL = "https://irvingchamber.com/resources-and-tools/irving-area-maps/valley-ranch/"

# 	# Load query from JSON file next to this script (query.json)
# 	config_path = os.path.join(os.path.dirname(__file__), "query.json")
# 	query = ""
# 	try:
# 		with open(config_path, "r", encoding="utf-8") as f:
# 			data = json.load(f)
# 			query = data.get("query", "")
# 	except (FileNotFoundError, json.JSONDecodeError):
# 		# fallback to empty query (or you can set a default here)
# 		query = ""

# 	result = answer_query(query, [YOUR_URL])
# 	print(result["answer"])
# 	print(result["url_context_metadata"])
# 	print(result["answer"])
# 	print(result["url_context_metadata"])
# 	try:
# 		with open(config_path, "r", encoding="utf-8") as f:
# 			data = json.load(f)
# 			query = data.get("query", "")
# 	except (FileNotFoundError, json.JSONDecodeError):
# 		# fallback to empty query (or you can set a default here)
# 		query = ""

# 	result = answer_query(query, [YOUR_URL])
# 	print(result["answer"])
# 	print(result["url_context_metadata"])
# 	print(result["answer"])
# 	print(result["url_context_metadata"])
