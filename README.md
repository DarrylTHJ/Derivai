# AI-Powered Historical Trading Simulator

TradeQuest is a gamified financial trading simulator that disguises historical market data (e.g., the 2020 Covid Crash, 2000 Dot-com Bubble) as fantasy RPG scenarios. It utilizes a Python FastAPI backend for data processing and uses Google Gemini AI to generate procedural narratives based on real-time market movements.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:
* **Node.js** (v18 or higher)
* **Python** (v3.10 or higher)
* **Google Gemini API Key** (Get one at aistudio.google.com)

---

## 🛠 Installation Guide

You will need to set up the **Backend** (Python) and **Frontend** (React) separately.

### 1. Backend Setup (The Engine)

Open your terminal and run the following commands to set up the Python server and download the historical market data.

**For Windows:**
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python setup_data.py

**For Mac/Linux:**
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 setup_data.py

### 2. Frontend Setup (The Interface)

Open a **NEW** terminal window (keep the backend one open) and run these commands from the project root.

cd ..
npm install

---

## 🏃‍♂️ How to Run

To play the game, you must run **both** the backend and frontend servers simultaneously in separate terminals.

### Terminal 1: Start the Backend
*Ensure you are inside the `backend` folder and your virtual environment is active.*

**Important:** Open `backend/main.py` and paste your Gemini API Key into the `GEMINI_API_KEY` variable before running.

python -m uvicorn main:app --reload

*You should see a message saying: `Application startup complete.`*

### Terminal 2: Start the Frontend
*Ensure you are inside the project root folder.*

npm run dev

### Access the Game
Open your web browser and navigate to:
http://localhost:5173

---

## 📂 Troubleshooting

* **"Module not found: uvicorn"**: Ensure you activated the virtual environment (`.\venv\Scripts\activate`) before running the server.
* **Chart not moving**: Check Terminal 1. If there are errors, ensure your API Key is correct and that you ran `python setup_data.py`.
