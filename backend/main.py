from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import random
import os

app = FastAPI()

# --- FIX: ALLOW FRONTEND TO CONNECT ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (good for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MOCK AI NARRATOR ---
def generate_fantasy_text(price_change):
    if price_change < -3.0:
        return "The Dragon of Debt has burned the village! Panic spreads."
    elif price_change < -1.0:
        return "Scouts report orcs gathering at the border. Unease grows."
    elif price_change > 3.0:
        return "The King announces a grand festival! Gold flows freely."
    elif price_change > 1.0:
        return "A good harvest season. The merchants are happy."
    else:
        return "The wind is calm. The Kingdom waits."

# --- API ENDPOINTS ---

@app.get("/")
def health_check():
    return {"status": "TradeQuest Backend Online"}

@app.get("/load_level/{level_id}")
def load_level(level_id: str):
    try:
        # Construct the file path relative to this script
        file_path = os.path.join("data", f"{level_id}.json")
        with open(file_path, "r") as f:
            data = json.load(f)
        return {"level": level_id, "total_days": len(data), "market_data": data}
    except FileNotFoundError:
        # Fallback for testing if file doesn't exist
        print(f"File not found: {file_path}")
        raise HTTPException(status_code=404, detail="Level not found")

@app.post("/analyze_turn")
def analyze_turn(change: float):
    story = generate_fantasy_text(change)
    return {"narrative": story}