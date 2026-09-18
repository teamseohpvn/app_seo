export type AIProvider = 'gemini' | 'openai' | 'claude';

export interface ModelOption {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  badge?: string;
  supportsVision: boolean;
}

export type ToneType = 
  | 'natural'      // Đời thường, gần gũi
  | 'smooth'       // Mượt mà, cảm xúc, storytelling
  | 'technical'    // Kỹ thuật, chuyên sâu
  | 'formal'       // Hành chính, trang trọng
  | 'humorous'     // Hài hước, dí dỏm, Gen Z
  | 'persuasive'   // Thuyết phục, bán hàng
  | 'custom';      // Tùy biến phong cách

export type InputMode = 'topic' | 'url' | 'image' | 'video';

export interface ParsedKeyword {
  keyword: string;
  type: 'primary' | 'secondary' | 'lsi';
  count: number;
}

export interface GenerateArticleRequest {
  provider: AIProvider;
  model: string;
  topic: string;
  inputMode: InputMode;
  referenceUrl?: string;
  referenceContent?: string;
  mediaBase64?: string;
  mediaMimeType?: string;
  keywords: ParsedKeyword[];
  tone: ToneType;
  customTonePrompt?: string;
  customPrompt?: string; // Prompt chỉ đạo / Yêu cầu AI đọc và viết bài
  targetWordCount?: number;
  includeFaqSchema?: boolean;
  includeComparisonTable?: boolean;
  customApiKey?: string; // Optional BYOK key
  customBaseUrl?: string; // Optional Custom OpenAI Base URL / Proxy
}

export interface ArticleResult {
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  contentMarkdown: string;
  faqSchemaJson?: string;
  keyTakeaways: string[];
  keywordsUsed: { keyword: string; count: number }[];
  providerUsed: string;
  modelUsed: string;
}

export interface SeoScoreDetails {
  totalScore: number;
  wordCount: number;
  hasDirectAnswer: boolean;
  hasTable: boolean;
  hasFaq: boolean;
  hasH2H3: boolean;
  headingsCount: { h1: number; h2: number; h3: number };
  keywordScore: number;
  keywordMatched: number;
  totalKeywords: number;
  suggestions: string[];
}
