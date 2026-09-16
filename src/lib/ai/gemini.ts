import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { ArticleResult, GenerateArticleRequest } from './types';
import { SEO_2026_SYSTEM_PROMPT, TONE_DESCRIPTIONS } from './prompts';

function cleanJsonString(str: string): string {
  // Remove markdown json fences if any
  const cleaned = str
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return cleaned;
}

export async function generateWithGemini(
  req: GenerateArticleRequest,
  apiKey: string
): Promise<ArticleResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Choose model
  const modelName = req.model || 'gemini-2.0-flash';
  
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SEO_2026_SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const promptParts: (string | Part)[] = [];

  // Build the user prompt
  let promptText = `
HÃY VIẾT MỘT BÀI BÁO / BÀI VIẾT CHUẨN SEO 2026 THEO YÊU CẦU SAU:

1. CHỦ ĐỀ / TIÊU ĐỀ: ${req.topic}
2. HÌNH THỨC ĐẦU VÀO: ${req.inputMode}
`;

  if (req.referenceUrl) {
    promptText += `\n- Link tham khảo: ${req.referenceUrl}`;
  }

  if (req.referenceContent) {
    promptText += `\n- Nội dung gốc tham khảo/bài viết đối thủ:\n"""\n${req.referenceContent.slice(0, 3000)}\n"""\n(Hãy phân tích bài này, bổ sung các góc nhìn thiếu sót và viết một bài mới sâu sắc, toàn diện hơn)`;
  }

  const toneDesc = req.tone === 'custom' && req.customTonePrompt 
    ? req.customTonePrompt 
    : TONE_DESCRIPTIONS[req.tone] || TONE_DESCRIPTIONS.natural;

  promptText += `\n3. PHONG CÁCH VĂN PHONG YÊU CẦU: ${toneDesc}`;

  if (req.keywords && req.keywords.length > 0) {
    const primary = req.keywords.filter(k => k.type === 'primary').map(k => k.keyword).join(', ');
    const secondary = req.keywords.filter(k => k.type === 'secondary').map(k => k.keyword).join(', ');
    const lsi = req.keywords.filter(k => k.type === 'lsi').map(k => k.keyword).join(', ');

    promptText += `\n4. DANH SÁCH TỪ KHÓA BẮT BUỘC SỬ DỤNG TỰ NHIÊN:`;
    if (primary) promptText += `\n   - Từ khóa chính (Primary - Bắt buộc có trong Title, H1, ít nhất 1 H2 và mở bài): ${primary}`;
    if (secondary) promptText += `\n   - Từ khóa phụ (Secondary - Phân bổ ở các thẻ H2, H3): ${secondary}`;
    if (lsi) promptText += `\n   - Từ khóa ngữ nghĩa (LSI/Entities): ${lsi}`;
  }

  promptText += `\n5. ĐỘ DÀI MỤC TIÊU: Khoảng ${req.targetWordCount || 1500} từ.`;
  promptText += `\n6. BẢO ĐẢM CÓ: Khối Direct Answer, Key Takeaways, Bảng so sánh (Table), FAQ Schema JSON-LD.`;

  promptParts.push(promptText);

  // If multimodal image/video is provided
  if (req.mediaBase64 && req.mediaMimeType) {
    promptParts.push({
      inlineData: {
        data: req.mediaBase64,
        mimeType: req.mediaMimeType,
      },
    });
  }

  const response = await model.generateContent(promptParts);
  const responseText = response.response.text();

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
      providerUsed: 'Google Gemini',
      modelUsed: modelName,
    };
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', responseText, err);
    // Fallback if model returned plain markdown
    return {
      title: req.topic,
      metaTitle: req.topic,
      metaDescription: 'Bài viết được tạo bởi Google Gemini',
      slug: req.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      contentMarkdown: responseText,
      keyTakeaways: [],
      keywordsUsed: [],
      providerUsed: 'Google Gemini',
      modelUsed: modelName,
    };
  }
}
