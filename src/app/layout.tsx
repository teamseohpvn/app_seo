import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI SEO Studio 2026 - Viết bài chuẩn GEO & E-E-A-T đa mô hình (Gemini, ChatGPT, Claude)',
  description: 'Nền tảng sáng tạo nội dung và tối ưu SEO thế hệ mới: Đa mô hình AI (Google Gemini, OpenAI ChatGPT, Anthropic Claude), nạp từ khóa Excel/CSV, đa dạng đầu vào text/ảnh/video, tối ưu AI Overviews 2026.',
  keywords: 'SEO 2026, Gemini SEO, ChatGPT SEO, Claude SEO, GEO optimization, AI Overviews, Content Generator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-blue-500/30 selection:text-blue-200">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none -z-10" />
        {children}
      </body>
    </html>
  );
}
