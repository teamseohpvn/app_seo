import OpenAI from 'openai';
import { ArticleResult, GenerateArticleRequest } from './types';
import { SEO_2026_SYSTEM_PROMPT, TONE_DESCRIPTIONS } from './prompts';

function cleanJsonString(str: string): string {
  return str
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

export async function generateWithOpenAI(
  req: GenerateArticleRequest,
  apiKey: string
): Promise<ArticleResult> {
  const openai = new OpenAI({ apiKey });
  const modelName = req.model || 'gpt-4o';

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

    promptText += `\n- Từ khóa chính (Primary): ${primary}`;
    promptText += `\n- Từ khóa phụ (Secondary): ${secondary}`;
    promptText += `\n- Từ khóa ngữ nghĩa (LSI): ${lsi}`;
  }

  // Construct message content
  const userContent: OpenAI.Chat.ChatCompletionContentPart[] = [
    { type: 'text', text: promptText },
  ];

  if (req.mediaBase64 && req.mediaMimeType && req.mediaMimeType.startsWith('image/')) {
    userContent.push({
      type: 'image_url',
      image_url: {
        url: `data:${req.mediaMimeType};base64,${req.mediaBase64}`,
      },
    });
  }

  const completion = await openai.chat.completions.create({
    model: modelName,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SEO_2026_SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    temperature: 0.7,
  });

  const responseText = completion.choices[0]?.message?.content || '{}';

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
      providerUsed: 'OpenAI ChatGPT',
      modelUsed: modelName,
    };
  } catch (err) {
    console.error('Failed to parse OpenAI JSON:', responseText, err);
    return {
      title: req.topic,
      metaTitle: req.topic,
      metaDescription: 'Bài viết được tạo bởi OpenAI ChatGPT',
      slug: req.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      contentMarkdown: responseText,
      keyTakeaways: [],
      keywordsUsed: [],
      providerUsed: 'OpenAI ChatGPT',
      modelUsed: modelName,
    };
  }
}
