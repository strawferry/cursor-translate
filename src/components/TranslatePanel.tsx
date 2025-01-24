'use client';

import { useState, ChangeEvent, useCallback, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { detectLanguage } from '@/services/translate';
import { speechService } from '@/services/speech';
import { Volume, StopCircle, Copy, Check } from 'lucide-react';
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
  const [copiedText, setCopiedText] = useState<string | null>(null);

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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000); // 2秒后重置复制状态
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const renderText = (text: string, lang: 'en' | 'zh', className: string = '') => (
    <div className={`relative group ${className}`}>
      <p className="pr-20">{text}</p>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
        <button
          onClick={() => handleCopy(text)}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          title="复制文本"
        >
          {copiedText === text ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-gray-500" />
          )}
        </button>
        <button
          onClick={() => handleSpeak(text, lang)}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          title={isPlaying ? '停止播放' : '播放'}
        >
          {isPlaying ? (
            <StopCircle className="w-4 h-4 text-gray-500" />
          ) : (
            <Volume className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>
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
    <div className="container max-w-4xl mx-auto p-4 min-h-screen flex flex-col">
      <h1 className="text-2xl font-medium text-center mb-8">中英文互译</h1>
      
      <Card className="flex-1 bg-white/80 backdrop-blur-xl border-none shadow-lg">
        <CardHeader className="border-b border-gray-100/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {detectedLang && (
                <span className="text-sm text-muted-foreground">
                  {detectedLang === 'zh' ? '检测到中文' : 'Detected English'}
                </span>
              )}
            </div>
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

        <CardContent className="space-y-6 p-6">
          <div className="relative">
            <Textarea
              placeholder="请输入要翻译的文本..."
              value={sourceText}
              onChange={handleTextChange}
              rows={6}
              className="resize-none bg-gray-50/50 border-none focus:ring-2 focus:ring-blue-500/20 text-base"
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
                <div className="space-y-6">
                  <Separator className="bg-gray-100/50" />
                  
                  {/* 整体翻译结果 */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">整体翻译</h3>
                    <Card className="bg-gray-50/50 border-none hover:bg-gray-50/80 transition-colors">
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
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">对照翻译</h3>
                    <div className="space-y-4">
                      {splitIntoParagraphs(sourceText).map((sourcePara, index) => (
                        <div key={index} className="grid gap-3">
                          <Card className="bg-gray-50/50 border-none hover:bg-gray-50/80 transition-colors">
                            <CardContent className="p-4">
                              {renderText(
                                sourcePara,
                                detectedLang || 'en',
                                ''
                              )}
                            </CardContent>
                          </Card>
                          <Card className="bg-blue-50/50 border-none hover:bg-blue-50/80 transition-colors">
                            <CardContent className="p-4">
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