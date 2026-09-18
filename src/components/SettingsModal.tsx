'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, ShieldCheck, Check, Info } from 'lucide-react';

interface ApiKeysConfig {
  gemini: string;
  openai: string;
  claude: string;
  openaiBaseUrl?: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: ApiKeysConfig) => void;
  initialKeys: ApiKeysConfig;
}

export function SettingsModal({
  isOpen,
  onClose,
  onSave,
  initialKeys,
}: SettingsModalProps) {
  const [keys, setKeys] = useState<ApiKeysConfig>({
    gemini: initialKeys.gemini || '',
    openai: initialKeys.openai || '',
    claude: initialKeys.claude || '',
    openaiBaseUrl: initialKeys.openaiBaseUrl || '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKeys({
      gemini: initialKeys.gemini || '',
      openai: initialKeys.openai || '',
      claude: initialKeys.claude || '',
      openaiBaseUrl: initialKeys.openaiBaseUrl || '',
    });
  }, [initialKeys]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(keys);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Cài đặt API Keys cá nhân (BYOK)
              </h3>
              <p className="text-xs text-slate-400">
                Khóa được lưu an toàn trực tiếp trên trình duyệt của bạn (Local Storage)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Notice */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              Nếu bạn đã cấu hình biến môi trường trên máy chủ hoặc Cloudflare Pages, bạn có thể để trống các ô bên dưới. Nếu điền vào đây, hệ thống sẽ ưu tiên sử dụng Key cá nhân của bạn.
            </div>
          </div>

          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
              >
                Lấy key miễn phí <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={keys.gemini}
              onChange={e => setKeys({ ...keys, gemini: e.target.value })}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Dùng cho Gemini 2.0 Flash, 1.5 Pro. Google tặng gói miễn phí rất rộng rãi.
            </p>
          </div>

          {/* OpenAI API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                OpenAI ChatGPT API Key
              </label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
              >
                Lấy key OpenAI <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={keys.openai}
              onChange={e => setKeys({ ...keys, openai: e.target.value })}
              placeholder="sk-proj-... hoặc mã kích hoạt Proxy"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Dùng cho GPT-4o, GPT-4o Mini hoặc Codex Proxy.
            </p>

            {/* OpenAI Custom Base URL / Proxy Endpoint */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="text-slate-400 flex items-center gap-1">
                  <span>OpenAI Base URL / Proxy Endpoint (Tùy chọn)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setKeys({ ...keys, openaiBaseUrl: 'https://sapi.cloudpp.win/v1' })}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 underline"
                >
                  Dùng Codex Proxy (TapHoaAI)
                </button>
              </div>
              <input
                type="text"
                value={keys.openaiBaseUrl || ''}
                onChange={e => setKeys({ ...keys, openaiBaseUrl: e.target.value })}
                placeholder="Mặc định: https://api.openai.com/v1 (hoặc https://sapi.cloudpp.win/v1)"
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Để trống nếu dùng OpenAI chính thức. Nhập URL nếu mua qua đại lý proxy (như taphoai, one-api...).
              </p>
            </div>
          </div>

          {/* Anthropic Claude API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                Anthropic Claude API Key
              </label>
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
              >
                Lấy key Claude <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={keys.claude}
              onChange={e => setKeys({ ...keys, claude: e.target.value })}
              placeholder="sk-ant-..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Dùng cho Claude 3.5 Sonnet, Claude 3.5 Haiku.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Key được mã hóa và không gửi ra ngoài</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              id="btn-save-settings"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Đã lưu
                </>
              ) : (
                'Lưu cài đặt'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
