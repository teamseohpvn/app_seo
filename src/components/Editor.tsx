'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Eye,
  Edit3,
  Globe2,
  FileCode,
  Sparkles,
  Share2,
} from 'lucide-react';
import { ArticleResult } from '@/lib/ai/types';
import { SchemaViewer } from './SchemaViewer';

interface EditorProps {
  article: ArticleResult;
  onChangeContent: (content: string) => void;
  onChangeTitle: (title: string) => void;
  onChangeMetaTitle: (metaTitle: string) => void;
  onChangeMetaDesc: (metaDesc: string) => void;
}

export function Editor({
  article,
  onChangeContent,
  onChangeTitle,
  onChangeMetaTitle,
  onChangeMetaDesc,
}: EditorProps) {
  const [viewTab, setViewTab] = useState<'preview' | 'edit'>('preview');
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Simple Markdown to HTML converter for preview
  const renderSimpleMarkdown = (md: string) => {
    if (!md) return '';
    let html = md
      // Escape HTML entities
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold & Italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Blockquote
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Tables (simple regex)
      .replace(
        /\|(.+)\|\r?\n\|[-:| ]+\|\r?\n((?:\|.*\|\r?\n?)*)/g,
        (match, header, body) => {
          const ths = header
            .split('|')
            .filter((c: string) => c.trim())
            .map((c: string) => `<th>${c.trim()}</th>`)
            .join('');
          const trs = body
            .trim()
            .split('\n')
            .map((row: string) => {
              const tds = row
                .split('|')
                .filter((c: string) => c.trim())
                .map((c: string) => `<td>${c.trim()}</td>`)
                .join('');
              return `<tr>${tds}</tr>`;
            })
            .join('');
          return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
        }
      )
      // Unordered lists
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      // Paragraphs
      .replace(/\n\n+/g, '</p><p>');

    return `<p>${html}</p>`;
  };

  const handleCopyMarkdown = () => {
    const fullMd = `# ${article.title}\n\n**Meta Title:** ${article.metaTitle}\n**Meta Description:** ${article.metaDescription}\n**Slug:** ${article.slug}\n\n${article.contentMarkdown}`;
    navigator.clipboard.writeText(fullMd);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 1500);
  };

  const handleCopyHtml = () => {
    const html = renderSimpleMarkdown(article.contentMarkdown);
    navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 1500);
  };

  const handleDownloadMarkdown = () => {
    const fullMd = `# ${article.title}\n\n**Meta Title:** ${article.metaTitle}\n**Meta Description:** ${article.metaDescription}\n**Slug:** ${article.slug}\n\n${article.contentMarkdown}`;
    const blob = new Blob([fullMd], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.slug || 'bai-viet-seo-2026'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-white/10">
        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-white/5">
          <button
            onClick={() => setViewTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewTab === 'preview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Trực quan</span>
          </button>
          <button
            onClick={() => setViewTab('edit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewTab === 'edit'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Sửa Markdown</span>
          </button>
        </div>

        {/* Export & Copy buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition-all active:scale-95 cursor-pointer"
          >
            {copiedMd ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Đã chép MD
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Chép Markdown
              </>
            )}
          </button>

          <button
            onClick={handleCopyHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition-all active:scale-95 cursor-pointer"
          >
            {copiedHtml ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Đã chép HTML
              </>
            ) : (
              <>
                <FileCode className="w-3.5 h-3.5" /> Chép HTML
              </>
            )}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-md shadow-indigo-600/30"
          >
            <Download className="w-3.5 h-3.5" /> Tải về .md
          </button>
        </div>
      </div>

      {/* SEO Metadata Box (Google SERP Snippet Preview) */}
      <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            Mô phỏng hiển thị trên Google (SERP Preview)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            /slug: {article.slug || 'url-chuan-seo'}
          </span>
        </div>

        {/* Google snippet card */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 space-y-1.5">
          <div className="text-[11px] text-emerald-400 font-mono truncate">
            https://yourwebsite.com › {article.slug || 'bai-viet-seo'}
          </div>
          <input
            type="text"
            value={article.metaTitle}
            onChange={e => onChangeMetaTitle(e.target.value)}
            className="w-full text-base font-semibold text-blue-400 hover:underline bg-transparent border-b border-transparent hover:border-blue-500/30 focus:border-blue-500 focus:outline-none"
            placeholder="Nhập Meta Title..."
          />
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Độ dài Meta Title: {article.metaTitle.length}/60 ký tự</span>
            {article.metaTitle.length >= 45 && article.metaTitle.length <= 65 ? (
              <span className="text-emerald-400 font-medium">✓ Tối ưu</span>
            ) : (
              <span className="text-amber-400 font-medium">! Nên từ 45-65 ký tự</span>
            )}
          </div>

          <textarea
            value={article.metaDescription}
            onChange={e => onChangeMetaDesc(e.target.value)}
            rows={2}
            className="w-full text-xs text-slate-300 bg-transparent border-b border-transparent hover:border-blue-500/30 focus:border-blue-500 focus:outline-none resize-none mt-1"
            placeholder="Nhập Meta Description..."
          />
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Độ dài Meta Description: {article.metaDescription.length}/160 ký tự</span>
            {article.metaDescription.length >= 135 && article.metaDescription.length <= 165 ? (
              <span className="text-emerald-400 font-medium">✓ Tối ưu</span>
            ) : (
              <span className="text-amber-400 font-medium">! Nên từ 135-165 ký tự</span>
            )}
          </div>
        </div>
      </div>

      {/* Key Takeaways Card */}
      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Key Takeaways (Trọng tâm bài viết cho AI Overviews / SGE)
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-200">
            {article.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-white/5">
                <span className="text-blue-400 font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content Area */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden">
        {viewTab === 'preview' ? (
          <div className="p-6 md:p-8 max-w-none">
            <input
              type="text"
              value={article.title}
              onChange={e => onChangeTitle(e.target.value)}
              className="w-full text-2xl md:text-3xl font-extrabold text-white bg-transparent border-b border-white/10 pb-3 mb-6 focus:outline-none focus:border-blue-500"
              placeholder="Tiêu đề chính H1..."
            />
            <div
              className="markdown-body text-slate-300"
              dangerouslySetInnerHTML={{
                __html: renderSimpleMarkdown(article.contentMarkdown),
              }}
            />
          </div>
        ) : (
          <div className="p-4">
            <textarea
              value={article.contentMarkdown}
              onChange={e => onChangeContent(e.target.value)}
              rows={25}
              className="w-full p-4 rounded-xl bg-slate-950 border border-white/10 text-xs md:text-sm text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-blue-500 resize-y"
              placeholder="Nội dung bài viết định dạng Markdown..."
            />
          </div>
        )}
      </div>

      {/* FAQ Schema Viewer */}
      <SchemaViewer schemaJson={article.faqSchemaJson} />
    </div>
  );
}
