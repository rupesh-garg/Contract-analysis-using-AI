from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import io
from pypdf import PdfReader
from google import genai
import json
import ollama

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Warning: GEMINI_API_KEY not found in environment variables.")

client = None
if api_key:
    client = genai.Client(api_key=api_key)

app = FastAPI(title="AI Contract Reviewer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Contract Reviewer API is running"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # 1. Extract Text
        content = await file.read()
        pdf_reader = PdfReader(io.BytesIO(content))
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text() + "\n"
        
        # 1.5 Smart Filter (Check if it's actually a contract)
        keywords = ['agreement', 'contract', 'terms', 'license', 'proposal', 'statement of work', 'between', 'signatory']
        preview_text = text_content[:1000].lower()
        
        if not any(keyword in preview_text for keyword in keywords):
            raise HTTPException(
                status_code=400, 
                detail="Invalid Document: This does not appear to be a legal contract."
            )
        
        # 2. Analyze with Gemini
        #if not client:
        #    raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured.")

        prompt = f"""
        You are a cynical Hollywood entertainment lawyer. Review this contract. 
        Identify clauses related to: 
        1. Perpetuity (forever rights)
        2. Exclusivity (cannot work with others)
        3. Indemnification (creator pays for lawsuits)
        
        Output the result as a JSON list of 'Red Flags' objects. 
        Each object should have:
        - 'clause': The specific clause text (or summary).
        - 'risk_level': 'High' or 'Medium'.
        - 'translation': Explain the clause in simple, professional language. Do not use slang, casual language, profanity, jokes, emojis, or phrases such as "Dude", "basically", or "keys to the kingdom".
        - 'counter_offer': Write a professional, polite, firm legal-style paragraph. Do not use casual language or conversational expressions.
        
        Return ONLY the JSON. No markdown formatting.
        
        Contract Text:
        {text_content}
        """
        
        response = ollama.chat(
          model='gemma3:4b',
          messages=[
            {
              'role': 'user',
             'content': prompt
            }
          ]
        )

        cleaned_response = response['message']['content'].replace('```json', '').replace('```', '').strip()
        
        try:
            analysis_json = json.loads(cleaned_response)
        except json.JSONDecodeError:
             # Fallback if raw text is not perfect JSON
             analysis_json = {"raw_output": response.text, "error": "Failed to parse JSON from AI"}

        return {
            "filename": file.filename,
            "analysis": analysis_json
        }

    except Exception as e:
        print(f"Error: {e}") # Log to console
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
