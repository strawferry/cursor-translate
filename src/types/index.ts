export interface TranslationHistory {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: 'en' | 'zh';
  targetLang: 'en' | 'zh';
  timestamp: number;
  isFavorite?: boolean;
} 