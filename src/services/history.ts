import { TranslationHistory } from '@/types';

const HISTORY_KEY = 'translation_history';
const MAX_HISTORY = 50;

export class HistoryService {
  private history: TranslationHistory[] = [];

  constructor() {
    this.loadHistory();
  }

  private loadHistory() {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        this.history = JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load history:', error);
        this.history = [];
      }
    }
  }

  private saveHistory() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
  }

  addTranslation(translation: Omit<TranslationHistory, 'id' | 'timestamp'>) {
    const newEntry: TranslationHistory = {
      ...translation,
      id: Date.now().toString(),
      timestamp: Date.now(),
      isFavorite: false
    };

    this.history.unshift(newEntry);
    
    // 保持最大历史记录数
    if (this.history.length > MAX_HISTORY) {
      this.history = this.history.slice(0, MAX_HISTORY);
    }

    this.saveHistory();
    return newEntry;
  }

  getHistory(): TranslationHistory[] {
    return this.history;
  }

  toggleFavorite(id: string) {
    const entry = this.history.find(h => h.id === id);
    if (entry) {
      entry.isFavorite = !entry.isFavorite;
      this.saveHistory();
    }
  }

  deleteEntry(id: string) {
    this.history = this.history.filter(h => h.id !== id);
    this.saveHistory();
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
  }
}

export const historyService = typeof window !== 'undefined' ? new HistoryService() : null; 