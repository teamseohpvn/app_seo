'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface SchemaViewerProps {
  schemaJson?: string;
}

export function SchemaViewer({ schemaJson }: SchemaViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!schemaJson) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-white/5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 font-semibold text-slate-200 hover:text-white cursor-pointer"
        >
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span>Mã Schema.org FAQ (JSON-LD) cho Google Rich Results</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" /> Đã chép
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> Sao chép Schema
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-3 bg-slate-950">
          <pre className="p-3 rounded-lg bg-slate-900 border border-white/5 text-[11px] text-emerald-300 font-mono overflow-x-auto max-h-60 leading-relaxed">
            {schemaJson}
          </pre>
        </div>
      )}
    </div>
  );
}
