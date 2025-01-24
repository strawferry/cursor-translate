import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    // TODO: 实现 DeepSeek API 调用
    // 这里先模拟翻译结果，之后会替换为真实的 API 调用
    const translatedText = text.split('\n').map(line => {
      if (line.trim()) {
        return `Translated: ${line.trim()}`;
      }
      return '';
    }).join('\n');

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
} 