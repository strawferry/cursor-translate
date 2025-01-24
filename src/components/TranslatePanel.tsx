'use client';

import { useState, ChangeEvent } from 'react';
import { TextArea } from './ui/TextArea';
import { Button } from './ui/Button';

interface TranslationResult {
  text: string;
  paragraphs?: string[];
}

export default function TranslatePanel() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [displayMode, setDisplayMode] = useState<'full' | 'parallel'>('full');

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value);
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

  const renderParallelView = () => {
    if (!translatedText?.paragraphs || !sourceText) return null;
    const sourceParagraphs = splitIntoParagraphs(sourceText);

    return (
      <div className="space-y-6">
        {sourceParagraphs.map((sourcePara, index) => (
          <div key={index} className="space-y-2">
            <p className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">{sourcePara}</p>
            <p className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              {translatedText.paragraphs[index] || ''}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderFullView = () => {
    if (!translatedText?.text) return null;
    return (
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
        {translatedText.text}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
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