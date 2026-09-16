'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Sparkles, Key, ExternalLink, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  apiKeysConfigured: {
    gemini: boolean;
    openai: boolean;
    claude: boolean;
  };
}

export function Header({ onOpenSettings, apiKeysConfigured }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                AppSEO <span className="text-gradient">AI Studio</span>
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                SEO 2026 • GEO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Tối ưu bài viết cho Google Search, AI Overviews, Perplexity & SearchGPT
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Key status indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-white/5 text-xs text-slate-400">
            <Key className="w-3.5 h-3.5 text-slate-500" />
            <span>AI:</span>
            <span
              className={`font-medium ${
                apiKeysConfigured.gemini ? 'text-emerald-400' : 'text-slate-500'
              }`}
              title="Google Gemini"
            >
              Gemini {apiKeysConfigured.gemini ? '✓' : '○'}
            </span>
            <span className="text-slate-600">•</span>
            <span
              className={`font-medium ${
                apiKeysConfigured.openai ? 'text-emerald-400' : 'text-slate-500'
              }`}
              title="OpenAI ChatGPT"
            >
              ChatGPT {apiKeysConfigured.openai ? '✓' : '○'}
            </span>
            <span className="text-slate-600">•</span>
            <span
              className={`font-medium ${
                apiKeysConfigured.claude ? 'text-emerald-400' : 'text-slate-500'
              }`}
              title="Anthropic Claude"
            >
              Claude {apiKeysConfigured.claude ? '✓' : '○'}
            </span>
          </div>

          <button
            onClick={onOpenSettings}
            id="btn-settings-modal"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-sm font-medium border border-white/10 transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Cài đặt API</span>
          </button>
        </div>
      </div>
    </header>
  );
}
