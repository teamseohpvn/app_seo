'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { SettingsModal } from '@/components/SettingsModal';
import { ModelSelector } from '@/components/ModelSelector';
import { KeywordUploader } from '@/components/KeywordUploader';
import { InputHub } from '@/components/InputHub';
import { ToneSelector } from '@/components/ToneSelector';
import { SeoScorecard } from '@/components/SeoScorecard';
import { Editor } from '@/components/Editor';
import {
  AIProvider,
  ArticleResult,
  InputMode,
  ModelOption,
  ParsedKeyword,
  ToneType,
} from '@/lib/ai/types';
import { AVAILABLE_MODELS } from '@/lib/ai';
import { calculateSeoScore } from '@/lib/seoScorer';
import { trackKeywordDensity } from '@/lib/keywordParser';
import {
  Sparkles,
  Loader2,
  FileCheck,
  Send,
  Zap,
  ArrowRight,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Home() {
  // API Keys state (BYOK)
  const [apiKeys, setApiKeys] = useState<{
    gemini: string;
    openai: string;
    claude: string;
    openaiBaseUrl?: string;
  }>({
    gemini: '',
    openai: '',
    claude: '',
    openaiBaseUrl: '',
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Generation inputs
  const [selectedModel, setSelectedModel] = useState<ModelOption>(AVAILABLE_MODELS[0]);
  const [inputMode, setInputMode] = useState<InputMode>('topic');
  const [topic, setTopic] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [referenceContent, setReferenceContent] = useState('');
  const [mediaBase64, setMediaBase64] = useState<string | undefined>(undefined);
  const [mediaMimeType, setMediaMimeType] = useState<string | undefined>(undefined);
  const [targetWordCount, setTargetWordCount] = useState<number>(1500);
  const [keywords, setKeywords] = useState<ParsedKeyword[]>([]);
  const [tone, setTone] = useState<ToneType>('natural');
  const [customTonePrompt, setCustomTonePrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  // Generation status & result
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [article, setArticle] = useState<ArticleResult | null>(null);

  // Load API keys from localStorage on mount
  useEffect(() => {
    try {
      const savedKeys = localStorage.getItem('appseo_api_keys');
      if (savedKeys) {
        setApiKeys(JSON.parse(savedKeys));
      }
    } catch (e) {
      console.error('Error loading api keys:', e);
    }
  }, []);

  const handleSaveApiKeys = (keys: {
    gemini: string;
    openai: string;
    claude: string;
    openaiBaseUrl?: string;
  }) => {
    setApiKeys(keys);
    localStorage.setItem('appseo_api_keys', JSON.stringify(keys));
  };

  const hasKeyForProvider = (provider: AIProvider): boolean => {
    return !!apiKeys[provider]?.trim();
  };

  // Real-time density tracking
  const updatedKeywords = useMemo(() => {
    if (!article?.contentMarkdown) return keywords;
    return trackKeywordDensity(article.contentMarkdown, keywords);
  }, [article?.contentMarkdown, keywords]);

  // Real-time SEO Score calculation
  const seoScoreDetails = useMemo(() => {
    if (!article) {
      return {
        totalScore: 0,
        wordCount: 0,
        hasDirectAnswer: false,
        hasTable: false,
        hasFaq: false,
        hasH2H3: false,
        headingsCount: { h1: 0, h2: 0, h3: 0 },
        keywordScore: 0,
        keywordMatched: 0,
        totalKeywords: keywords.length,
        suggestions: ['Bắt đầu tạo bài viết để chấm điểm SEO.'],
      };
    }

    return calculateSeoScore(
      article.title,
      article.metaTitle,
      article.metaDescription,
      article.contentMarkdown,
      updatedKeywords
    );
  }, [article, updatedKeywords, keywords.length]);

  // Trigger celebration on score >= 95
  useEffect(() => {
    if (seoScoreDetails.totalScore >= 95) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [seoScoreDetails.totalScore]);

  // Sample prompt helper
  const handleLoadSample = (sampleTopic: string, sampleKeywords: string[], sampleTone: ToneType) => {
    setTopic(sampleTopic);
    setTone(sampleTone);
    const parsedKws: ParsedKeyword[] = sampleKeywords.map((k, idx) => ({
      keyword: k,
      type: idx === 0 ? 'primary' : idx <= 3 ? 'secondary' : 'lsi',
      count: 0,
    }));
    setKeywords(parsedKws);
  };

  // Generate action
  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Vui lòng nhập chủ đề bài viết!');
      return;
    }

    // Determine custom key if available
    const customKey = apiKeys[selectedModel.provider]?.trim();

    try {
      setIsGenerating(true);
      setGenerationStep('Đang kết nối tới mô hình AI...');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedModel.provider,
          model: selectedModel.id,
          topic: topic.trim(),
          inputMode,
          referenceUrl: referenceUrl.trim() || undefined,
          referenceContent: referenceContent.trim() || undefined,
          mediaBase64: mediaBase64 || undefined,
          mediaMimeType: mediaMimeType || undefined,
          keywords: keywords.map(k => ({ keyword: k.keyword, type: k.type, count: 0 })),
          tone,
          customTonePrompt: tone === 'custom' ? customTonePrompt : undefined,
          customPrompt: customPrompt.trim() || undefined,
          targetWordCount,
          customApiKey: customKey || undefined,
          customBaseUrl: selectedModel.provider === 'openai' ? (apiKeys.openaiBaseUrl?.trim() || undefined) : undefined,
        }),
      });

      setGenerationStep('Đang tối ưu chuẩn SEO 2026 & sinh định dạng...');

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi tạo bài viết');
      }

      setArticle(data);
    } catch (err: unknown) {
      console.error('Generation error:', err);
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định khi tạo bài viết';
      alert(`Lỗi: ${msg}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        apiKeysConfigured={{
          gemini: hasKeyForProvider('gemini'),
          openai: hasKeyForProvider('openai'),
          claude: hasKeyForProvider('claude'),
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Generator Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Model Selector */}
            <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm">
              <ModelSelector
                selectedModelId={selectedModel.id}
                onSelectModel={setSelectedModel}
                hasKeyForProvider={hasKeyForProvider}
              />
            </div>

            {/* 2. Input Hub */}
            <InputHub
              inputMode={inputMode}
              onChangeInputMode={setInputMode}
              topic={topic}
              onChangeTopic={setTopic}
              referenceUrl={referenceUrl}
              onChangeReferenceUrl={setReferenceUrl}
              referenceContent={referenceContent}
              onChangeReferenceContent={setReferenceContent}
              mediaBase64={mediaBase64}
              mediaMimeType={mediaMimeType}
              onSetMedia={(b64, mime) => {
                setMediaBase64(b64);
                setMediaMimeType(mime);
              }}
              targetWordCount={targetWordCount}
              onChangeTargetWordCount={setTargetWordCount}
              customPrompt={customPrompt}
              onChangeCustomPrompt={setCustomPrompt}
            />

            {/* 3. Keyword Uploader */}
            <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm">
              <KeywordUploader
                keywords={updatedKeywords}
                onChangeKeywords={setKeywords}
              />
            </div>

            {/* 4. Tone Selector */}
            <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm">
              <ToneSelector
                selectedTone={tone}
                onChangeTone={setTone}
                customPrompt={customTonePrompt}
                onChangeCustomPrompt={setCustomTonePrompt}
              />
            </div>

            {/* 5. Submit Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              id="btn-generate-article"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-base shadow-xl shadow-indigo-600/25 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{generationStep || 'Đang tạo bài viết...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Viết bài chuẩn SEO & GEO 2026</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Output & Live SEO Score (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Live SEO Scorecard */}
            <SeoScorecard scoreDetails={seoScoreDetails} />

            {/* Editor or Empty State */}
            {article ? (
              <Editor
                article={article}
                onChangeContent={content =>
                  setArticle({ ...article, contentMarkdown: content })
                }
                onChangeTitle={title => setArticle({ ...article, title })}
                onChangeMetaTitle={metaTitle =>
                  setArticle({ ...article, metaTitle })
                }
                onChangeMetaDesc={metaDescription =>
                  setArticle({ ...article, metaDescription })
                }
              />
            ) : (
              /* Empty State with Sample Topics */
              <div className="p-8 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
                  <BookOpen className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    Sẵn sàng tạo nội dung đỉnh cao
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                    Chọn mô hình AI (Gemini, ChatGPT hoặc Claude), nạp từ khóa và nhấn nút tạo bài để nhận bài viết chuẩn SEO 2026 kèm điểm số trực tiếp.
                  </p>
                </div>

                {/* Sample Prompt Chips */}
                <div className="text-left space-y-2 pt-2 border-t border-white/5">
                  <span className="text-xs font-semibold text-slate-400 block">
                    Hoặc thử ngay một trong các chủ đề mẫu dưới đây:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleLoadSample(
                          'Chiến lược SEO 2026: Cách thống trị Google AI Overviews và Perplexity',
                          [
                            'chiến lược seo 2026',
                            'tối ưu google ai overviews',
                            'geo optimization',
                            'tiêu chuẩn eeat mới',
                          ],
                          'technical'
                        )
                      }
                      className="p-3 rounded-xl border border-white/5 bg-slate-950/60 hover:border-blue-500/40 hover:bg-slate-900 text-left transition-all cursor-pointer group"
                    >
                      <span className="text-xs font-semibold text-blue-300 group-hover:text-blue-200 block truncate">
                        Chiến lược SEO 2026 & AI Overviews
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Kỹ thuật chuyên sâu • 4 từ khóa mẫu
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleLoadSample(
                          'Kinh nghiệm thực tế: 5 bài học xương máu khi tự xây dựng thương hiệu cá nhân',
                          [
                            'xây dựng thương hiệu cá nhân',
                            'kinh nghiệm thực tế',
                            'phát triển sự nghiệp 2026',
                          ],
                          'natural'
                        )
                      }
                      className="p-3 rounded-xl border border-white/5 bg-slate-950/60 hover:border-pink-500/40 hover:bg-slate-900 text-left transition-all cursor-pointer group"
                    >
                      <span className="text-xs font-semibold text-pink-300 group-hover:text-pink-200 block truncate">
                        Kinh nghiệm xây dựng thương hiệu cá nhân
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Đời thường gần gũi • 3 từ khóa mẫu
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialKeys={apiKeys}
        onSave={handleSaveApiKeys}
      />
    </div>
  );
}
