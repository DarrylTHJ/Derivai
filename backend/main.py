import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

# --- TRY TO LOAD ENV (Safe Mode) ---
try:
    from dotenv import load_dotenv
    # Force Python to find .env in the backend folder
    env_path = Path(__file__).parent / '.env'
    load_dotenv(dotenv_path=env_path)
    print(f"📂 Loading environment from: {env_path}")
except ImportError:
    print("⚠️ WARNING: python-dotenv not installed. Skipping .env load.")

# --- GET KEY ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("❌ ERROR: API Key is missing! Check your .env file.")
else:
    print("✅ API Key loaded successfully.")
    genai.configure(api_key=GEMINI_API_KEY)

# --- MODEL ROSTER ---
MODEL_ROSTER = [
  "gemini-2.5-flash",
  "gemini-3-flash-preview",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-pro"
]

app = FastAPI()

# --- CORS (Allow Frontend Connection) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- NARRATIVE ENGINE ---
def get_ai_narrative(change):
    # Fallback if no key
    if not GEMINI_API_KEY:
        return "The archives are sealed (API Key Missing).", "None"

    vibe = "CHAOS" if abs(change) > 3 else "CALM"
    prompt = f"Write a fantasy RPG sentence about the market moving {change}%. Vibe: {vibe}."

    for model_name in MODEL_ROSTER:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            return response.text.strip(), model_name
        except Exception as e:
            continue

    return "The stars are silent...", "Error"

# --- ENDPOINTS ---
@app.get("/")
def health_check():
    return {"status": "Online", "key_loaded": bool(GEMINI_API_KEY)}

@app.get("/load_level/{level_id}")
def load_level(level_id: str):
    try:
        # Construct path safely
        file_path = Path("data") / f"{level_id}.json"
        with open(file_path, "r") as f:
            data = json.load(f)
        return {"level": level_id, "market_data": data}
    except FileNotFoundError:
        print(f"❌ File not found: {file_path}")
        raise HTTPException(status_code=404, detail="Level not found")

@app.post("/analyze_turn")
def analyze_turn(change: float):
    story, model = get_ai_narrative(change)
    print(f"🔮 AI: {story} ({model})")
    return {"narrative": story}