import Anthropic from '@anthropic-ai/sdk';
import { ArticleResult, GenerateArticleRequest } from './types';
import { SEO_2026_SYSTEM_PROMPT, TONE_DESCRIPTIONS } from './prompts';

function cleanJsonString(str: string): string {
  const match = str.match(/\{[\s\S]*\}/);
  if (match) {
    return match[0];
  }
  return str.trim();
}

export async function generateWithClaude(
  req: GenerateArticleRequest,
  apiKey: string
): Promise<ArticleResult> {
  const anthropic = new Anthropic({ apiKey });
  const modelName = req.model || 'claude-3-5-sonnet-20241022';

  const toneDesc = req.tone === 'custom' && req.customTonePrompt 
    ? req.customTonePrompt 
    : TONE_DESCRIPTIONS[req.tone] || TONE_DESCRIPTIONS.natural;

  let promptText = `
HÃY VIẾT BÀI BÁO / BÀI VIẾT CHUẨN SEO 2026:
- Chủ đề: ${req.topic}
- Phong cách văn phong: ${toneDesc}
- Độ dài mục tiêu: Khoảng ${req.targetWordCount || 1500} từ
`;

  if (req.referenceUrl) {
    promptText += `\n- Tham khảo URL: ${req.referenceUrl}`;
  }

  if (req.referenceContent) {
    promptText += `\n- Nội dung gốc tham khảo:\n"""\n${req.referenceContent.slice(0, 3000)}\n"""`;
  }

  if (req.keywords && req.keywords.length > 0) {
    const primary = req.keywords.filter(k => k.type === 'primary').map(k => k.keyword).join(', ');
    const secondary = req.keywords.filter(k => k.type === 'secondary').map(k => k.keyword).join(', ');
    const lsi = req.keywords.filter(k => k.type === 'lsi').map(k => k.keyword).join(', ');

    promptText += `\n- Từ khóa chính: ${primary}`;
    promptText += `\n- Từ khóa phụ: ${secondary}`;
    promptText += `\n- Từ khóa ngữ nghĩa LSI: ${lsi}`;
  }

  
  if (req.customPrompt && req.customPrompt.trim()) {
    promptText += `\n\n- YÊU CẦU ĐẶC BIỆT / PROMPT CHỈ ĐẠO CỦA NGƯỜI DÙNG (YÊU CẦU ĐỌC & VIẾT BÀI):\n"""\n${req.customPrompt.trim()}\n"""\n(QUAN TRỌNG: Hãy đọc kỹ tài liệu và tuân thủ nghiêm ngặt chỉ đạo trên!)`;
  }

  promptText += `\n\nLƯU Ý: CHỈ TRẢ VỀ DUY NHẤT CHUỖI JSON HỢP LỆ VỚI CÁC TRƯỜNG NHƯ ĐÃ QUY ĐỊNH, KHÔNG BỎ THÊM BẤT KỲ VĂN BẢN NÀO BÊN NGOÀI.`;

  const contentBlocks: Anthropic.MessageParam['content'] = [];

  if (
    req.mediaBase64 &&
    req.mediaMimeType &&
    ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(req.mediaMimeType)
  ) {
    contentBlocks.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: req.mediaMimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
        data: req.mediaBase64,
      },
    });
  }

  contentBlocks.push({
    type: 'text',
    text: promptText,
  });

  const response = await anthropic.messages.create({
    model: modelName,
    max_tokens: 4096,
    system: SEO_2026_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: contentBlocks,
      },
    ],
  });

  let responseText = '';
  for (const block of response.content) {
    if (block.type === 'text') {
      responseText += block.text;
    }
  }

  try {
    const parsed = JSON.parse(cleanJsonString(responseText));
    return {
      title: parsed.title || req.topic,
      metaTitle: parsed.metaTitle || parsed.title || req.topic,
      metaDescription: parsed.metaDescription || '',
      slug: parsed.slug || '',
      contentMarkdown: parsed.contentMarkdown || '',
      faqSchemaJson: typeof parsed.faqSchemaJson === 'string' 
        ? parsed.faqSchemaJson 
        : JSON.stringify(parsed.faqSchemaJson, null, 2),
      keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [],
      keywordsUsed: Array.isArray(parsed.keywordsUsed) ? parsed.keywordsUsed : [],
      providerUsed: 'Anthropic Claude',
      modelUsed: modelName,
    };
  } catch (err) {
    console.error('Failed to parse Claude JSON output:', responseText, err);
    return {
      title: req.topic,
      metaTitle: req.topic,
      metaDescription: 'Bài viết được tạo bởi Anthropic Claude',
      slug: req.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      contentMarkdown: responseText,
      keyTakeaways: [],
      keywordsUsed: [],
      providerUsed: 'Anthropic Claude',
      modelUsed: modelName,
    };
  }
}
