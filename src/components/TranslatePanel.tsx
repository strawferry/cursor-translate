'use client';

import { useState, ChangeEvent, useCallback } from 'react';
import { TextArea } from './ui/TextArea';
import { Button } from './ui/Button';
import { detectLanguage } from '@/services/translate';
import { speechService } from '@/services/speech';
import { Volume, StopCircle } from 'lucide-react';

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
  const [displayMode, setDisplayMode] = useState<'full' | 'parallel'>('full');
  const [detectedLang, setDetectedLang] = useState<'en' | 'zh' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      
      setTranslatedText({
        text: data.translatedText,
        paragraphs: splitIntoParagraphs(data.translatedText)
      });
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

  const renderParallelView = () => {
    if (!translatedText?.paragraphs || !sourceText) return null;
    const sourceParagraphs = splitIntoParagraphs(sourceText);
    const sourceLang = detectedLang || 'en';
    const targetLang = sourceLang === 'en' ? 'zh' : 'en';

    return (
      <div className="space-y-6">
        {sourceParagraphs.map((sourcePara, index) => (
          <div key={index} className="space-y-2">
            {renderText(
              sourcePara,
              sourceLang,
              'bg-gray-50 dark:bg-gray-900 p-3 rounded-lg'
            )}
            {renderText(
              translatedText.paragraphs[index] || '',
              targetLang,
              'bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg'
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFullView = () => {
    if (!translatedText?.text) return null;
    const targetLang = detectedLang === 'en' ? 'zh' : 'en';
    
    return renderText(
      translatedText.text,
      targetLang,
      'bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <Button
            onClick={() => setDisplayMode('full')}
            variant={displayMode === 'full' ? 'default' : 'outline'}
          >
            整体显示
          </Button>
          <Button
            onClick={() => setDisplayMode('parallel')}
            variant={displayMode === 'parallel' ? 'default' : 'outline'}
          >
            对照显示
          </Button>
        </div>
        {detectedLang && (
          <div className="text-sm text-gray-500">
            {detectedLang === 'zh' ? '检测到中文' : 'Detected English'}
          </div>
        )}
      </div>

      <TextArea
        placeholder="请输入要翻译的文本..."
        value={sourceText}
        onChange={handleTextChange}
        rows={6}
      />

      <Button 
        onClick={handleTranslate}
        disabled={isTranslating || !sourceText.trim()}
        className="w-full"
      >
        {isTranslating ? '翻译中...' : '翻译'}
      </Button>

      {translatedText && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">翻译结果:</h3>
          {displayMode === 'parallel' ? renderParallelView() : renderFullView()}
        </div>
      )}
    </div>
  );
} 