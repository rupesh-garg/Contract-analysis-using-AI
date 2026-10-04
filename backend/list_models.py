import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("GEMINI_API_KEY not found.")
else:
    try:
        client = genai.Client(api_key=api_key)
        print("Listing available models...")
        # The new SDK might have a different way to list methods, 
        # but let's try the common patterns or use the error hint.
        # Check if client.models.list() exists
        for m in client.models.list():
            print(f"- {m.name}")
            
    except Exception as e:
        print(f"Error listing models: {e}")
