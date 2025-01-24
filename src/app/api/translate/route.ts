import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    // TODO: 实现 DeepSeek API 调用
    // 这里先mock返回结果
    const translatedText = `Translated: ${text}`;

    return NextResponse.json({ translatedText });
  } catch (error) {
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
} 