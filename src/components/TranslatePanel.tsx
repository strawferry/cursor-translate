'use client';

import { useState } from 'react';
import { TextArea } from './ui/TextArea';
import { Button } from './ui/Button';

export default function TranslatePanel() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [displayMode, setDisplayMode] = useState<'full' | 'parallel'>('full');

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
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
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
        onChange={(e) => setSourceText(e.target.value)}
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
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            {translatedText}
          </div>
        </div>
      )}
    </div>
  );
} 