'use client';

import React from 'react';
import { AVAILABLE_MODELS } from '@/lib/ai';
import { AIProvider, ModelOption } from '@/lib/ai/types';
import { Cpu, Zap, Sparkles, Brain } from 'lucide-react';

interface ModelSelectorProps {
  selectedModelId: string;
  onSelectModel: (model: ModelOption) => void;
  hasKeyForProvider: (provider: AIProvider) => boolean;
}

export function ModelSelector({
  selectedModelId,
  onSelectModel,
  hasKeyForProvider,
}: ModelSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          Mô hình AI viết bài
        </label>
        <span className="text-[11px] text-slate-500">
          Chuyển đổi tức thì giữa Google, OpenAI & Anthropic
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {AVAILABLE_MODELS.map(model => {
          const isSelected = model.id === selectedModelId;
          const hasKey = hasKeyForProvider(model.provider);

          let providerBorder = 'border-white/10 hover:border-indigo-500/40';
          let providerGradient = 'from-indigo-500/10 to-transparent';
          let providerDot = 'bg-indigo-400';

          if (model.provider === 'gemini') {
            providerBorder = isSelected
              ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500/50'
              : 'border-white/10 hover:border-blue-500/40 hover:bg-slate-900/60';
            providerDot = 'bg-blue-400';
          } else if (model.provider === 'openai') {
            providerBorder = isSelected
              ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/50'
              : 'border-white/10 hover:border-emerald-500/40 hover:bg-slate-900/60';
            providerDot = 'bg-emerald-400';
          } else if (model.provider === 'claude') {
            providerBorder = isSelected
              ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500/50'
              : 'border-white/10 hover:border-purple-500/40 hover:bg-slate-900/60';
            providerDot = 'bg-purple-400';
          }

          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onSelectModel(model)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${providerBorder}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${providerDot}`} />
                    <span className="font-semibold text-sm text-white truncate">
                      {model.name}
                    </span>
                  </div>
                  {model.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10 shrink-0">
                      {model.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                  {model.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5 text-slate-400">
                <span className="capitalize font-mono text-[10px] text-slate-400">
                  Provider: {model.provider}
                </span>
                {model.supportsVision && (
                  <span className="text-blue-300/80 font-medium">📷 Hỗ trợ ảnh/video</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
