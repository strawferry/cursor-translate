'use client';

import { useState, ChangeEvent, useCallback, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { detectLanguage } from '@/services/translate';
import { speechService } from '@/services/speech';
import { Volume, StopCircle } from 'lucide-react';
import { historyService } from '@/services/history';
import { TranslationHistory as HistoryType } from '@/types';
import { TranslationHistory } from './TranslationHistory';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface TranslationResult {
  text: string;
  paragraphs?: string[];
  sourceLang?: 'en' | 'zh';
  targetLang?: 'en' | 'zh';
}

export default function TranslatePanel() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLang, setDetectedLang] = useState<'en' | 'zh' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<HistoryType[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (historyService) {
      setHistory(historyService.getHistory());
    }
  }, []);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setSourceText(newText);
    
    if (newText.trim()) {
      const lang = detectLanguage(newText);
      setDetectedLang(lang);
    } else {
      setDetectedLang(null);
    }
  };

  const splitIntoParagraphs = (text: string): string[] => {
    return text.split(/\n+/).filter(para => para.trim().length > 0);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: sourceText }),
      });
      
      const data = await response.json();
      
      const result = {
        text: data.translatedText,
        paragraphs: splitIntoParagraphs(data.translatedText)
      };
      
      setTranslatedText(result);

      if (historyService) {
        const newEntry = historyService.addTranslation({
          sourceText,
          translatedText: data.translatedText,
          sourceLang: detectedLang || 'en',
          targetLang: (detectedLang || 'en') === 'en' ? 'zh' : 'en'
        });
        setHistory(historyService.getHistory());
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeak = useCallback((text: string, lang: 'en' | 'zh') => {
    if (!speechService) return;
    
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
    } else {
      speechService.speak(text, lang);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const renderText = (text: string, lang: 'en' | 'zh', className: string = '') => (
    <div className={`relative group ${className}`}>
      <p className="pr-10">{text}</p>
      <button
        onClick={() => handleSpeak(text, lang)}
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        title={isPlaying ? '停止播放' : '播放'}
      >
        {isPlaying ? (
          <StopCircle className="w-5 h-5" />
        ) : (
          <Volume className="w-5 h-5" />
        )}
      </button>
    </div>
  );

  const handleHistorySelect = (entry: HistoryType) => {
    setSourceText(entry.sourceText);
    setTranslatedText({
      text: entry.translatedText,
      paragraphs: splitIntoParagraphs(entry.translatedText),
      sourceLang: entry.sourceLang,
      targetLang: entry.targetLang
    });
    setDetectedLang(entry.sourceLang);
    setShowHistory(false);
  };

  const handleToggleFavorite = (id: string) => {
    if (historyService) {
      historyService.toggleFavorite(id);
      setHistory(historyService.getHistory());
    }
  };

  const handleDeleteHistory = (id: string) => {
    if (historyService) {
      historyService.deleteEntry(id);
      setHistory(historyService.getHistory());
    }
  };

  const handleClearHistory = () => {
    if (historyService) {
      historyService.clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="bg-white/50 backdrop-blur-xl border-none shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-medium">
              {detectedLang ? (
                <span className="text-sm font-normal text-muted-foreground">
                  {detectedLang === 'zh' ? '检测到中文' : 'Detected English'}
                </span>
              ) : (
                "中英文互译"
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2"
            >
              {showHistory ? '返回翻译' : '历史记录'}
              {!showHistory && history.length > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-primary/10 rounded-full">
                  {history.length}
                </span>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="请输入要翻译的文本..."
              value={sourceText}
              onChange={handleTextChange}
              rows={6}
              className="resize-none bg-muted/50 border-none focus:ring-1 focus:ring-primary/20"
            />
            <Button 
              onClick={handleTranslate}
              disabled={isTranslating || !sourceText.trim()}
              className="absolute bottom-4 right-4"
              size="sm"
            >
              {isTranslating ? '翻译中...' : '翻译'}
            </Button>
          </div>

          {showHistory ? (
            <TranslationHistory
              history={history}
              onSelect={handleHistorySelect}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDeleteHistory}
              onClear={handleClearHistory}
            />
          ) : (
            <>
              {translatedText && (
                <div className="space-y-6 pt-4">
                  <Separator />
                  {/* 整体翻译结果 */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">整体翻译</h3>
                    <Card className="bg-muted/50 border-none">
                      <CardContent className="p-4">
                        {renderText(
                          translatedText.text,
                          (detectedLang || 'en') === 'en' ? 'zh' : 'en',
                          ''
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* 对照翻译 */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">对照翻译</h3>
                    <div className="space-y-3">
                      {splitIntoParagraphs(sourceText).map((sourcePara, index) => (
                        <div key={index} className="grid gap-2">
                          <Card className="bg-muted/50 border-none">
                            <CardContent className="p-3">
                              {renderText(
                                sourcePara,
                                detectedLang || 'en',
                                ''
                              )}
                            </CardContent>
                          </Card>
                          <Card className="bg-primary/5 border-none">
                            <CardContent className="p-3">
                              {renderText(
                                translatedText.paragraphs?.[index] || '',
                                (detectedLang || 'en') === 'en' ? 'zh' : 'en',
                                ''
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 