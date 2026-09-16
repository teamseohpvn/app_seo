'use client';

import React from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileSearch,
  Sparkles,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { SeoScoreDetails } from '@/lib/ai/types';

interface SeoScorecardProps {
  scoreDetails: SeoScoreDetails;
}

export function SeoScorecard({ scoreDetails }: SeoScorecardProps) {
  const {
    totalScore,
    wordCount,
    hasDirectAnswer,
    hasTable,
    hasFaq,
    headingsCount,
    keywordMatched,
    totalKeywords,
    suggestions,
  } = scoreDetails;

  let scoreColor = 'text-rose-400 border-rose-500/30 bg-rose-950/20';
  let badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  let statusText = 'Cần cải thiện';

  if (totalScore >= 80) {
    scoreColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    statusText = 'Chuẩn SEO & GEO 2026 xuất sắc!';
  } else if (totalScore >= 60) {
    scoreColor = 'text-amber-400 border-amber-500/30 bg-amber-950/20';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    statusText = 'Khá tốt, có thể tối ưu thêm';
  }

  return (
    <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm space-y-4">
      {/* Header & Score Circle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Bảng điểm SEO & GEO 2026
            </h4>
            <p className="text-[11px] text-slate-400">{statusText}</p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${scoreColor}`}>
          <span className="text-xl font-extrabold font-mono">{totalScore}</span>
          <span className="text-xs text-slate-400 font-semibold">/100</span>
        </div>
      </div>

      {/* Metric Checklist Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {/* Word Count */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Độ dài</span>
          <div className="flex items-center justify-between mt-1">
            <span className="font-bold text-white font-mono">{wordCount} từ</span>
            {wordCount >= 700 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>
        </div>

        {/* Headings */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Cấu trúc đề mục</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-slate-200 font-mono">
              H1:{headingsCount.h1} • H2:{headingsCount.h2} • H3:{headingsCount.h3}
            </span>
            {headingsCount.h1 === 1 && headingsCount.h2 >= 2 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
            )}
          </div>
        </div>

        {/* Keywords Matched */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Từ khóa nạp vào</span>
          <div className="flex items-center justify-between mt-1">
            <span className="font-bold text-white font-mono">
              {totalKeywords > 0 ? `${keywordMatched}/${totalKeywords}` : 'N/A'}
            </span>
            {totalKeywords === 0 || keywordMatched >= totalKeywords * 0.7 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>
        </div>

        {/* Direct Answer (GEO) */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">GEO Direct Answer</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-slate-200">
              {hasDirectAnswer ? 'Đã có' : 'Chưa có'}
            </span>
            {hasDirectAnswer ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
            )}
          </div>
        </div>

        {/* Table */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Bảng so sánh</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-slate-200">{hasTable ? 'Đã có' : 'Chưa có'}</span>
            {hasTable ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Khối FAQ Schema</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-slate-200">{hasFaq ? 'Đã có' : 'Chưa có'}</span>
            {hasFaq ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/20 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Lightbulb className="w-3.5 h-3.5" />
            Gợi ý tối ưu thêm cho bài viết:
          </div>
          <ul className="space-y-1 text-[11px] text-slate-300">
            {suggestions.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400 shrink-0">•</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
