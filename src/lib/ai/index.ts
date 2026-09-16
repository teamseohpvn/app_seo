import { ArticleResult, GenerateArticleRequest, ModelOption } from './types';
import { generateWithGemini } from './gemini';
import { generateWithOpenAI } from './openai';
import { generateWithClaude } from './claude';

export const AVAILABLE_MODELS: ModelOption[] = [
  // Google Gemini - Thế hệ mới nhất 2026
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash (Khuyên dùng chính thức ⭐)',
    provider: 'gemini',
    description: 'Mô hình chuẩn của Google: Tốc độ cao, tối ưu GEO & E-E-A-T chuẩn xác, tiếng Việt tự nhiên.',
    badge: 'Khuyên dùng chính thức',
    supportsVision: true,
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash (Thế hệ mới 2026)',
    provider: 'gemini',
    description: 'Thế hệ Gemini 3.x tân tiến nhất: Trí tuệ vượt bậc, văn phong tiếng Việt xuất sắc.',
    badge: 'Mới nhất 2026',
    supportsVision: true,
  },
  {
    id: 'gemini-3.5-pro',
    name: 'Gemini 3.5 Pro (Siêu suy luận)',
    provider: 'gemini',
    description: 'Mô hình tư duy chuyên sâu đỉnh cao của Google: Bối cảnh khổng lồ, tổng hợp đa nguồn, viết bài phân tích cấp chuyên gia.',
    badge: 'Trí tuệ cao nhất',
    supportsVision: true,
  },

  // OpenAI ChatGPT
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'openai',
    description: 'Mô hình flagship thông minh nhất của OpenAI: Cấu trúc lập luận mạch lạc, hỗ trợ phân tích hình ảnh.',
    badge: 'Thông minh',
    supportsVision: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: 'Nhanh, nhẹ, tối ưu chi phí cho các bài viết ngắn và tin tức nhanh.',
    badge: 'Nhanh',
    supportsVision: true,
  },

  // Anthropic Claude
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'claude',
    description: 'Đỉnh cao về văn phong: Tự nhiên như con người viết, giàu cảm xúc, không bị rập khuôn AI.',
    badge: 'Văn phong đỉnh nhất',
    supportsVision: true,
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'claude',
    description: 'Nhỏ gọn, phản hồi tức thì với khả năng diễn đạt lưu loát.',
    badge: 'Siêu tốc',
    supportsVision: true,
  },
];

export async function generateArticle(
  req: GenerateArticleRequest,
  serverApiKeys: {
    gemini?: string;
    openai?: string;
    claude?: string;
  }
): Promise<ArticleResult> {
  const customKey = req.customApiKey?.trim();

  switch (req.provider) {
    case 'gemini': {
      const apiKey = customKey || serverApiKeys.gemini || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          'Thiếu Gemini API Key! Hãy cấu hình trong Cài đặt (Settings) hoặc thêm GEMINI_API_KEY vào biến môi trường.'
        );
      }
      return generateWithGemini(req, apiKey);
    }

    case 'openai': {
      const apiKey = customKey || serverApiKeys.openai || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(
          'Thiếu OpenAI API Key! Hãy cấu hình trong Cài đặt (Settings) hoặc thêm OPENAI_API_KEY vào biến môi trường.'
        );
      }
      return generateWithOpenAI(req, apiKey);
    }

    case 'claude': {
      const apiKey = customKey || serverApiKeys.claude || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error(
          'Thiếu Anthropic Claude API Key! Hãy cấu hình trong Cài đặt (Settings) hoặc thêm ANTHROPIC_API_KEY vào biến môi trường.'
        );
      }
      return generateWithClaude(req, apiKey);
    }

    default:
      throw new Error(`Provider không hợp lệ: ${req.provider}`);
  }
}
