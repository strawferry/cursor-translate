import { useState } from 'react';
import type { TranslationHistory as HistoryType } from '@/types';
import { Button } from './ui/button';
import { Star, Trash2, Clock } from 'lucide-react';

interface TranslationHistoryProps {
  history: HistoryType[];
  onSelect: (entry: HistoryType) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function TranslationHistory({
  history,
  onSelect,
  onToggleFavorite,
  onDelete,
  onClear
}: TranslationHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(h => h.isFavorite);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            <Clock className="w-4 h-4 mr-1" />
            全部
          </Button>
          <Button
            variant={filter === 'favorites' ? 'default' : 'outline'}
            onClick={() => setFilter('favorites')}
          >
            <Star className="w-4 h-4 mr-1" />
            收藏
          </Button>
        </div>
        <Button variant="outline" onClick={onClear}>
          清空历史
        </Button>
      </div>

      <div className="space-y-2">
        {filteredHistory.map(entry => (
          <div
            key={entry.id}
            className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <div className="flex justify-between items-start mb-2">
              <div 
                className="flex-1 cursor-pointer" 
                onClick={() => onSelect(entry)}
              >
                <div className="space-y-2">
                  <p className="text-gray-900 dark:text-gray-100">
                    {entry.sourceText}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {entry.translatedText}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <button
                  onClick={() => onToggleFavorite(entry.id)}
                  className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    entry.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{formatDate(entry.timestamp)}</span>
              <span className="text-xs">
                {entry.sourceLang === 'zh' ? '中文' : 'English'} → {entry.targetLang === 'zh' ? '中文' : 'English'}
              </span>
            </div>
          </div>
        ))}
        
        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {filter === 'all' ? '暂无翻译历史' : '暂无收藏记录'}
          </div>
        )}
      </div>
    </div>
  );
} 