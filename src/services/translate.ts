import { DEEPSEEK_API_KEY, DEEPSEEK_API_URL } from '@/config';

interface TranslateOptions {
  text: string;
  sourceLang?: string;
  targetLang?: string;
}

export async function translateText({ text, sourceLang, targetLang }: TranslateOptions) {
  const prompt = `Translate the following ${sourceLang || 'text'} to ${targetLang || 'English'}:\n\n${text}`;
  
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Translation failed');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Translation service error:', error);
    throw error;
  }
}

export function detectLanguage(text: string): 'en' | 'zh' {
  // 简单的语言检测：检查是否包含中文字符
  const hasChineseChar = /[\u4e00-\u9fa5]/.test(text);
  return hasChineseChar ? 'zh' : 'en';
} 