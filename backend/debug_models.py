import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Error: GEMINI_API_KEY not found in environment variables.")
else:
    print(f"API Key found: {api_key[:5]}...{api_key[-5:]}")
    
    # Configure the old library
    genai.configure(api_key=api_key)
    
    print("\n--- Available Models (google-generativeai) ---")
    try:
        for m in genai.list_models():
            print(f"Name: {m.name}")
            print(f"  - Supported methods: {m.supported_generation_methods}")
    except Exception as e:
        print(f"Error listing models with google-generativeai: {e}")

    # Optional: Check with new library too for comparison since main.py uses it
    try:
        from google import genai as new_genai
        print("\n--- Available Models (google-genai / New SDK) ---")
        client = new_genai.Client(api_key=api_key)
        for m in client.models.list():
             print(f"- {m.name}")
    except ImportError:
        print("\n(google-genai library not installed, skipping new SDK check)")
    except Exception as e:
        print(f"\nError listing models with google-genai (New SDK): {e}")
