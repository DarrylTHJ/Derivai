import yfinance as yf
import pandas as pd
import json
import os

# Create data directory if not exists
if not os.path.exists("data"):
    os.makedirs("data")

def download_scenario(name, ticker, start_date, end_date):
    print(f"📉 Downloading {name} ({ticker})...")
    
    # FIX: auto_adjust=True fixes the column naming issue (returns 'Close' instead of 'Adj Close')
    df = yf.download(ticker, start=start_date, end=end_date, auto_adjust=True, progress=False)
    
    # FIX: Detect and remove MultiIndex layers if they exist
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.droplevel(1)

    # Ensure we have a valid price column
    price_col = 'Close' 
    if price_col not in df.columns:
        # Fallback search
        for col in df.columns:
            if 'Close' in str(col):
                price_col = col
                break
    
    # Calculate daily percentage change
    df['Pct_Change'] = df[price_col].pct_change() * 100
    df = df.dropna()

    # Convert to game format
    game_data = []
    for date, row in df.iterrows():
        game_data.append({
            "date": str(date.date()),
            "price": round(float(row[price_col]), 2),
            "change": round(float(row['Pct_Change']), 2),
            "volume": int(row['Volume']) if 'Volume' in row else 0
        })

    # Save to file
    with open(f"data/{name}.json", "w") as f:
        json.dump(game_data, f)
    print(f"✅ Saved {len(game_data)} turns for {name}!")

# --- DEFINING THE LEVELS ---
try:
    # Level 1: The Covid Crash (Easy - Quick Recovery)
    download_scenario("level_1", "SPY", "2020-02-15", "2020-05-01")

    # Level 2: The Crypto Winter (Hard - Long slow bleed)
    download_scenario("level_2", "BTC-USD", "2021-11-01", "2022-02-01")

    # Level 3: The Dot Com Bubble (Expert - High Volatility)
    download_scenario("level_3", "QQQ", "2000-03-01", "2000-06-01")

    print("\n🎉 All Scenarios Ready! You can now run the server.")
    
except Exception as e:
    print(f"\n❌ Something went wrong: {e}")