import { NextRequest, NextResponse } from 'next/server';
import { generateArticle } from '@/lib/ai';
import { GenerateArticleRequest } from '@/lib/ai/types';

export const maxDuration = 60; // 60 seconds timeout for long articles

export async function POST(req: NextRequest) {
  try {
    const body: GenerateArticleRequest = await req.json();

    if (!body.topic || !body.topic.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập chủ đề bài viết!' },
        { status: 400 }
      );
    }

    const serverApiKeys = {
      gemini: process.env.GEMINI_API_KEY,
      openai: process.env.OPENAI_API_KEY,
      claude: process.env.ANTHROPIC_API_KEY,
    };

    const result = await generateArticle(body, serverApiKeys);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Error generating article:', error);
    const msg = error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi tạo bài viết';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
