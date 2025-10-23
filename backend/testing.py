# from google import genai
# from google.genai.types import Tool, GenerateContentConfig, GoogleSearch, UrlContext
# from dotenv import load_dotenv
# import os
# import json

# load_dotenv()
# client = genai.Client(api_key=os.getenv("Gemini_api_key"))
# model = "gemini-2.5-flash"

# tools = [
#     Tool(url_context=UrlContext()),
#     Tool(google_search=GoogleSearch())
# ]

# urls = [
# 	"https://www.valleyranch.org",
# 	"https://www.cypresswaters.com/",
# 	"https://irvingchamber.com/resources-and-tools/irving-area-maps/valley-ranch/",
# 	"https://www.irvingtexas.com/plan-your-visit/about-irving/valley-ranch/",
# 	"https://statisticalatlas.com/neighborhood/Texas/Irving/Valley-Ranch/Overview",
# 	"https://www.trulia.com/n/tx/irving/valley-ranch/90246/",
# 	"https://www.irvingtexas.com/plan-your-visit/about-irving/history/"
# ]

# contents = (
# 	"Use the following urls as your primary sources to answer the user's question: "
#     + "\n".join(urls)
# 	+ "\nOnly if you can't get sufficient info to answer the user's question from these sources, perform a Google Search and try to only use reliable sources."
# 	+ "\nAlways cite your sources like which of the provided URLs you used and/or if necessary, the reliable websites you found through your Google Search."
# )

# load_prompt_json = os.path.join(os.path.dirname(__file__), "search.json")
# with open(load_prompt_json, "r", encoding="utf-8") as f:
# 	query = json.load(f).get("prompt", "")

# response = client.models.generate_content_stream(
#     model = model,
# 	contents = contents + f"User's question: {query}",
#     config=GenerateContentConfig(
#         tools=tools,
#     )
# )

# for stream in response:
#     print(stream.text)