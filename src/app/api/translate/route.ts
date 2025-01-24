import { NextResponse } from 'next/server';
import { translateText, detectLanguage } from '@/services/translate';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const sourceLang = detectLanguage(text);
    const targetLang = sourceLang === 'en' ? 'zh' : 'en';

    const translatedText = await translateText({
      text,
      sourceLang,
      targetLang,
    });

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
} 