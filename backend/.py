from google import genai
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch
from dotenv import load_dotenv
import os
import markdown2

load_dotenv()

client = genai.Client(api_key=os.getenv("backup_api_key"))
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

query = "Valley Ranch History events list"

chat = client.chats.create(
    model=model,
    config=GenerateContentConfig(
        tools=tools,
        system_instruction=instructions,
        temperature=0.3
    )
)

# Send message
response = chat.send_message(query)
response_text = response.text

# Convert Markdown → HTML (preserve line breaks)
html_response = str(markdown2.markdown(
    response_text,
    extras=["break-on-newline", "fenced-code-blocks", "tables"]
))

# grounding = response.candidates[0].grounding_metadata
# sources = ""

# for i, chunk in enumerate(grounding.grounding_chunks):
#     sources += f"\n{i}: {chunk.web.title} - {chunk.web.uri}"

# html_response += "\n<p>" + sources + "<p>"

grounding = response.candidates[0].grounding_metadata
sources = ""

for i, chunk in enumerate(grounding.grounding_chunks):
    sources += f'<li><a href="{chunk.web.uri}">{chunk.web.title}</a></li>\n'

html_response += f"<h3>Sources:</h3>\n<ul>{sources}</ul>"

print(html_response)

# print(response)
# print("-----")
# print(response.text)
# Needs response.candidates[0]
# why is there code in response? Investigate
# Fix these citation code, maybe add it to bototm of text, or add it as its own variable, might need another one for links

# # Access which text segments came from which sources
# if grounding and grounding.grounding_supports:
#     print("\nText Attribution:")
#     for support in grounding.grounding_supports:
#         print(f"\nText: '{support.segment.text}'")
#         print(f"From sources: {support.grounding_chunk_indices}")
