# AppSEO AI Studio 2026 🚀

**Nền tảng sáng tạo nội dung & tối ưu SEO & GEO thế hệ mới (2026 Standard)** tích hợp đa mô hình AI hàng đầu thế giới: **Google Gemini, OpenAI ChatGPT và Anthropic Claude**.

---

## ✨ Tính năng nổi bật

1. **Đa mô hình AI (Multi-Provider Unified Layer)**:
   - **Google Gemini**: Hỗ trợ `gemini-2.0-flash`, `gemini-1.5-pro` (siêu nhanh, xử lý multimodal ảnh/video cực mạnh, tối ưu tiếng Việt).
   - **OpenAI ChatGPT**: Hỗ trợ `gpt-4o`, `gpt-4o-mini` (lập luận chặt chẽ, tư duy cấu trúc).
   - **Anthropic Claude**: Hỗ trợ `claude-3-5-sonnet`, `claude-3-5-haiku` (văn phong tự nhiên như người viết, giàu cảm xúc).

2. **Tiêu chuẩn SEO & GEO 2026**:
   - **GEO (Generative Engine Optimization)**: Tự động tạo khối **Direct Answer** (40-60 từ cô đọng dưới mỗi H2) giúp Google AI Overviews, Perplexity & SearchGPT dễ dàng trích dẫn.
   - **E-E-A-T thế hệ mới**: Đặt trọng tâm vào **Experience (Trải nghiệm thực tế)** với case study, ví dụ thực tế và bảng so sánh (Markdown Table).
   - **FAQ Schema JSON-LD**: Tự động sinh mã Schema chuẩn Schema.org cho Google Rich Snippets.
   - **Tự động sinh Metadata**: Meta Title (50-60 ký tự), Meta Description (140-160 ký tự) và URL Slug chuẩn SEO.

3. **Nạp từ khóa linh hoạt từ file**:
   - Kéo thả file Excel (`.xlsx`), `.csv`, hoặc `.txt`.
   - Tự động phân loại: Từ khóa chính (Primary), Từ khóa phụ (Secondary), Từ khóa ngữ nghĩa (LSI).
   - **Keyword Density Tracker**: Tự động đếm và theo dõi số lần xuất hiện của từng từ khóa trong bài viết theo thời gian thực.

4. **Đầu vào đa phương thức (Multimodal Input Hub)**:
   - Nhập chủ đề văn bản thông thường.
   - **Cào bài viết đối thủ (URL Scraper)**: Tự động đọc và phân tích cấu trúc bài gốc để viết bài nâng cấp (Skyscraper).
   - **Viết bài từ Hình ảnh**: Tải ảnh sản phẩm, infographic hoặc ảnh chụp tài liệu (OCR).
   - **Viết bài từ Video**: Dán link YouTube hoặc transcript video.

5. **Bộ điều khiển văn phong (Tone of Voice)**:
   - *Đời thường, gần gũi*: Trò chuyện mộc mạc, chia sẻ trải nghiệm thực tế.
   - *Mượt mà, cảm xúc*: Storytelling lôi cuốn, truyền cảm hứng.
   - *Kỹ thuật, chuyên sâu*: Chuẩn xác thuật ngữ, logic, B2B/IT.
   - *Hành chính, trang trọng*: Quy chuẩn báo cáo doanh nghiệp, tài liệu chính thức.
   - *Hài hước, dí dỏm*: Năng động, bắt trend Gen Z.
   - *Thuyết phục, bán hàng*: Copywriting, kích thích mua hàng với CTA sắc bén.
   - *Tùy chỉnh riêng (Custom)*: Dán đoạn văn mẫu để AI học văn phong.

6. **Bảng chấm điểm SEO & GEO thời gian thực (0 - 100 điểm)**:
   - Đo lường độ dài, số lượng thẻ H1/H2/H3, mật độ từ khóa, sự hiện diện của Direct Answer, Table và FAQ.
   - Đưa ra các gợi ý chỉnh sửa cụ thể để bài viết đạt điểm tuyệt đối.

---

## 🛠️ Hướng dẫn cài đặt & Chạy tại máy (Local)

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Cấu hình API Key (Tùy chọn)
Tạo file `.env.local` từ `.env.example`:
```env
GEMINI_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
```
> **Mẹo**: Bạn cũng có thể bỏ qua bước này và nhập trực tiếp API Key vào nút **"Cài đặt API"** trên giao diện web (Key sẽ được lưu an toàn trên trình duyệt của bạn).

### 3. Chạy môi trường phát triển
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

---

## 🚀 Hướng dẫn Triển khai lên Cloudflare Pages (Miễn phí 100%)

Ứng dụng được thiết kế hoàn toàn tương thích với kiến trúc Serverless của Cloudflare Pages:

1. **Đẩy mã nguồn lên GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit AppSEO AI Studio"
   git branch -M main
   git remote add origin <URL_GITHUB_REPO_CUA_BAN>
   git push -u origin main
   ```

2. **Kết nối với Cloudflare Pages**:
   - Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com) > Chọn **Compute (Workers & Pages)** > **Create application** > **Pages** > **Connect to Git**.
   - Chọn kho lưu trữ GitHub của dự án.
   - **Framework preset**: Chọn `Next.js`.
   - **Build command**: `npx @cloudflare/next-on-pages@1` (hoặc `npm run build`).
   - **Output directory**: `.vercel/output/static`.

3. **Thêm biến môi trường bí mật trên Cloudflare**:
   - Trong trang cài đặt dự án trên Cloudflare Pages > Chọn tab **Settings** > **Environment variables**.
   - Thêm các biến:
     - `GEMINI_API_KEY`
     - `OPENAI_API_KEY`
     - `ANTHROPIC_API_KEY`
   - Bấm **Save and Deploy**. Website của bạn sẽ hoạt động toàn cầu với độ trễ cực thấp và bảo mật hoàn toàn API Key!
