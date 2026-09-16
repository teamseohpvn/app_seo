'use client';

import React, { useState } from 'react';
import {
  FileText,
  Globe,
  Image as ImageIcon,
  Video,
  Sparkles,
  Link2,
  Upload,
  X,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { InputMode } from '@/lib/ai/types';

interface InputHubProps {
  inputMode: InputMode;
  onChangeInputMode: (mode: InputMode) => void;
  topic: string;
  onChangeTopic: (topic: string) => void;
  referenceUrl: string;
  onChangeReferenceUrl: (url: string) => void;
  referenceContent: string;
  onChangeReferenceContent: (content: string) => void;
  mediaBase64?: string;
  mediaMimeType?: string;
  onSetMedia: (base64?: string, mimeType?: string) => void;
  targetWordCount: number;
  onChangeTargetWordCount: (count: number) => void;
}

export function InputHub({
  inputMode,
  onChangeInputMode,
  topic,
  onChangeTopic,
  referenceUrl,
  onChangeReferenceUrl,
  referenceContent,
  onChangeReferenceContent,
  mediaBase64,
  mediaMimeType,
  onSetMedia,
  targetWordCount,
  onChangeTargetWordCount,
}: InputHubProps) {
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeSuccess, setScrapeSuccess] = useState(false);

  const handleExtractUrl = async () => {
    if (!referenceUrl.trim()) return;
    try {
      setIsScraping(true);
      setScrapeSuccess(false);
      const res = await fetch('/api/extract-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: referenceUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi bóc tách URL');
      }

      onChangeReferenceContent(data.content);
      if (!topic.trim() && data.title) {
        onChangeTopic(data.title);
      }
      setScrapeSuccess(true);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Không thể bóc tách URL');
    } finally {
      setIsScraping(false);
    }
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh (JPEG, PNG, WEBP, GIF)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onSetMedia(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm space-y-4">
      {/* Mode Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-white/10 overflow-x-auto">
        <button
          type="button"
          onClick={() => onChangeInputMode('topic')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            inputMode === 'topic'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. Chủ đề / Yêu cầu văn bản</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeInputMode('url')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            inputMode === 'url'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>2. Cào bài viết tham khảo (URL)</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeInputMode('image')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            inputMode === 'image'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>3. Viết từ Hình ảnh / Đồ họa</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeInputMode('video')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            inputMode === 'video'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>4. Viết từ Video / Transcript</span>
        </button>
      </div>

      {/* Main Topic Input (Always visible & prominent) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Chủ đề bài viết chính (Main Topic / Title)
          </label>
          <span className="text-slate-500 text-[11px]">Bắt buộc</span>
        </div>
        <input
          type="text"
          value={topic}
          onChange={e => onChangeTopic(e.target.value)}
          placeholder="Ví dụ: Top 10 xu hướng SEO năm 2026 và cách tối ưu AI Overviews cho website"
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
        />
      </div>

      {/* Mode-specific panels */}
      {inputMode === 'url' && (
        <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-blue-400" />
              Đường dẫn bài viết đối thủ hoặc bài tham khảo:
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={referenceUrl}
              onChange={e => onChangeReferenceUrl(e.target.value)}
              placeholder="https://example.com/bai-viet-can-tham-khao"
              className="flex-1 px-3.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={handleExtractUrl}
              disabled={isScraping || !referenceUrl.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              {isScraping ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang bóc tách...
                </>
              ) : scrapeSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Đã bóc tách
                </>
              ) : (
                'Bóc tách nội dung'
              )}
            </button>
          </div>

          {referenceContent && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Nội dung đã trích xuất ({referenceContent.length} ký tự):</span>
                <button
                  onClick={() => onChangeReferenceContent('')}
                  className="text-red-400 hover:underline"
                >
                  Xóa
                </button>
              </div>
              <textarea
                value={referenceContent}
                onChange={e => onChangeReferenceContent(e.target.value)}
                rows={4}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-white/5 text-xs text-slate-300 font-mono resize-none focus:outline-none"
              />
            </div>
          )}
        </div>
      )}

      {inputMode === 'image' && (
        <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            Tải lên hình ảnh minh họa / Sản phẩm / Infographic (Multimodal):
          </label>

          {mediaBase64 ? (
            <div className="relative inline-block border border-white/20 rounded-xl overflow-hidden group">
              <img
                src={`data:${mediaMimeType || 'image/jpeg'};base64,${mediaBase64}`}
                alt="Upload preview"
                className="max-h-48 rounded-lg object-contain bg-slate-900"
              />
              <button
                onClick={() => onSetMedia(undefined, undefined)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow-lg"
                title="Xóa ảnh"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-white/15 bg-slate-900/40 hover:border-purple-500/50 hover:bg-slate-900/70 transition-all cursor-pointer">
              <Upload className="w-8 h-8 text-purple-400 mb-2" />
              <span className="text-xs font-semibold text-slate-200">
                Chọn file ảnh từ máy (PNG, JPG, WEBP)
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                AI sẽ đọc bối cảnh, chữ trong ảnh (OCR) và đặc điểm sản phẩm để viết bài
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  if (e.target.files?.[0]) handleImageFile(e.target.files[0]);
                }}
              />
            </label>
          )}
        </div>
      )}

      {inputMode === 'video' && (
        <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-red-400" />
            Dán nội dung transcript hoặc link Video:
          </label>
          <textarea
            value={referenceContent}
            onChange={e => onChangeReferenceContent(e.target.value)}
            rows={4}
            placeholder="Dán toàn bộ phụ đề / transcript của video YouTube hoặc mô tả các phân cảnh video tại đây..."
            className="w-full p-2.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500 font-mono resize-none"
          />
        </div>
      )}

      {/* Target Word Count Slider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Độ dài bài viết mục tiêu:</span>
          <span className="text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 font-mono">
            {targetWordCount} từ
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-64">
          <span className="text-[11px] text-slate-500 font-mono">800</span>
          <input
            type="range"
            min={800}
            max={3000}
            step={100}
            value={targetWordCount}
            onChange={e => onChangeTargetWordCount(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <span className="text-[11px] text-slate-500 font-mono">3000</span>
        </div>
      </div>
    </div>
  );
}
