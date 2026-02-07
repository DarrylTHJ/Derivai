const API_URL = 'http://127.0.0.1:8000';

export interface MarketDay {
  date: string;
  price: number;
  change: number;
  volume: number;
}

export const api = {
  // Check if backend is online
  healthCheck: async () => {
    try {
      const res = await fetch(`${API_URL}/`);
      return await res.json();
    } catch (e) {
      console.error("Backend offline");
      return null;
    }
  },

  // Load a specific level (e.g., 'level_1')
  loadLevel: async (levelId: string) => {
    const res = await fetch(`${API_URL}/load_level/${levelId}`);
    if (!res.ok) throw new Error('Failed to load level');
    return await res.json();
  },

  // Ask AI for narrative
  analyzeTurn: async (change: number) => {
    const res = await fetch(`${API_URL}/analyze_turn?change=${change}`, {
      method: 'POST',
    });
    return await res.json();
  }
};