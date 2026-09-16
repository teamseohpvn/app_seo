'use client';

import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Upload, Plus, Trash2, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { ParsedKeyword } from '@/lib/ai/types';
import { parseFileKeywords, parseTextKeywords } from '@/lib/keywordParser';

interface KeywordUploaderProps {
  keywords: ParsedKeyword[];
  onChangeKeywords: (keywords: ParsedKeyword[]) => void;
}

export function KeywordUploader({ keywords, onChangeKeywords }: KeywordUploaderProps) {
  const [manualText, setManualText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const parsed = await parseFileKeywords(file);
      // Merge with existing keywords
      const existingMap = new Map(keywords.map(k => [k.keyword.toLowerCase(), k]));
      for (const p of parsed) {
        if (!existingMap.has(p.keyword.toLowerCase())) {
          existingMap.set(p.keyword.toLowerCase(), p);
        }
      }
      onChangeKeywords(Array.from(existingMap.values()));
    } catch (err) {
      console.error('Error parsing file:', err);
      alert('Không thể đọc file từ khóa. Vui lòng kiểm tra file Excel/CSV/TXT của bạn.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAddManual = () => {
    if (!manualText.trim()) return;
    const parsed = parseTextKeywords(manualText);
    const existingMap = new Map(keywords.map(k => [k.keyword.toLowerCase(), k]));
    for (const p of parsed) {
      if (!existingMap.has(p.keyword.toLowerCase())) {
        existingMap.set(p.keyword.toLowerCase(), p);
      }
    }
    onChangeKeywords(Array.from(existingMap.values()));
    setManualText('');
  };

  const removeKeyword = (kwToRemove: string) => {
    onChangeKeywords(keywords.filter(k => k.keyword !== kwToRemove));
  };

  const clearAll = () => {
    onChangeKeywords([]);
  };

  const primaryCount = keywords.filter(k => k.type === 'primary').length;
  const secondaryCount = keywords.filter(k => k.type === 'secondary').length;
  const lsiCount = keywords.filter(k => k.type === 'lsi').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-blue-400" />
          Nạp danh sách từ khóa (Excel / CSV / TXT)
        </label>
        {keywords.length > 0 && (
          <button
            onClick={clearAll}
            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" /> Xóa tất cả ({keywords.length})
          </button>
        )}
      </div>

      {/* Upload Zone & Manual Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Drop Zone */}
        <div
          onDragOver={e => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-4 rounded-xl border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-white/15 bg-slate-900/40 hover:border-blue-500/40 hover:bg-slate-900/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.txt"
            className="hidden"
            onChange={e => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-200">
            {isLoading ? 'Đang đọc dữ liệu...' : 'Kéo thả file Excel (.xlsx), CSV, TXT vào đây'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">hoặc bấm vào để chọn file từ máy</p>
        </div>

        {/* Manual Quick Add */}
        <div className="p-3 rounded-xl border border-white/10 bg-slate-900/40 flex flex-col justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
              Hoặc dán nhanh danh sách từ khóa (mỗi dòng hoặc dấu phẩy một từ):
            </span>
            <textarea
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              placeholder="ví dụ:&#10;thiết kế web chuẩn seo&#10;dịch vụ seo từ khóa&#10;seo 2026 xu hướng"
              rows={2}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono resize-none"
            />
          </div>
          <button
            onClick={handleAddManual}
            disabled={!manualText.trim()}
            className="mt-2 w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm vào danh sách
          </button>
        </div>
      </div>

      {/* Keyword Chips & Density Preview */}
      {keywords.length > 0 ? (
        <div className="p-3 rounded-xl border border-white/10 bg-slate-900/50 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Tổng: {keywords.length} từ khóa</span>
              <span className="text-blue-400 font-medium text-[11px]">• {primaryCount} Chính</span>
              <span className="text-purple-400 font-medium text-[11px]">• {secondaryCount} Phụ</span>
              <span className="text-slate-400 font-medium text-[11px]">• {lsiCount} LSI</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Số nhỏ bên cạnh là số lần xuất hiện trong bài viết
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {keywords.map(kw => {
              let badgeColor = 'bg-slate-800 text-slate-300 border-white/10';
              let countColor = kw.count > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400';

              if (kw.type === 'primary') {
                badgeColor = 'bg-blue-950/60 text-blue-200 border-blue-500/30';
              } else if (kw.type === 'secondary') {
                badgeColor = 'bg-purple-950/60 text-purple-200 border-purple-500/30';
              }

              return (
                <span
                  key={kw.keyword}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${badgeColor}`}
                >
                  <span>{kw.keyword}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${countColor}`}>
                    {kw.count}
                  </span>
                  <button
                    onClick={() => removeKeyword(kw.keyword)}
                    className="text-slate-400 hover:text-red-400 ml-0.5"
                    title="Xóa từ khóa này"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl border border-white/5 bg-slate-900/20 text-xs text-slate-500 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-500" />
          <span>
            Chưa có từ khóa nào. Bạn có thể tải file Excel/CSV hoặc gõ từ khóa để AI tự động tối ưu mật độ bài viết.
          </span>
        </div>
      )}
    </div>
  );
}
