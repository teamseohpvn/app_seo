import { ParsedKeyword, SeoScoreDetails } from './ai/types';

export function calculateSeoScore(
  title: string,
  metaTitle: string,
  metaDescription: string,
  contentMarkdown: string,
  keywords: ParsedKeyword[]
): SeoScoreDetails {
  const suggestions: string[] = [];
  let totalScore = 0;

  // 1. Title & Meta Title (15 pts)
  let titleScore = 0;
  if (title && title.length >= 30 && title.length <= 75) {
    titleScore += 7;
  } else if (title) {
    titleScore += 3;
    suggestions.push('Tiêu đề H1 nên có độ dài tối ưu từ 40 - 70 ký tự.');
  } else {
    suggestions.push('Thiếu tiêu đề bài viết (H1).');
  }

  if (metaTitle && metaTitle.length >= 40 && metaTitle.length <= 65) {
    titleScore += 8;
  } else if (metaTitle) {
    titleScore += 4;
    suggestions.push('Meta Title nên nằm trong khoảng 50 - 65 ký tự để tránh bị cắt trên Google.');
  } else {
    suggestions.push('Chưa có thẻ Meta Title.');
  }
  totalScore += titleScore;

  // 2. Meta Description (10 pts)
  if (metaDescription && metaDescription.length >= 130 && metaDescription.length <= 165) {
    totalScore += 10;
  } else if (metaDescription) {
    totalScore += 5;
    suggestions.push('Meta Description nên từ 140 - 160 ký tự để tối ưu CTR.');
  } else {
    suggestions.push('Thiếu thẻ Meta Description.');
  }

  // 3. Word Count (15 pts)
  const words = contentMarkdown ? contentMarkdown.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  if (wordCount >= 1200) {
    totalScore += 15;
  } else if (wordCount >= 700) {
    totalScore += 10;
    suggestions.push('Độ dài bài viết khá tốt, nếu nâng lên trên 1200 từ sẽ có chiều sâu và thẩm quyền cao hơn.');
  } else if (wordCount >= 400) {
    totalScore += 5;
    suggestions.push('Bài viết hơi ngắn (< 700 từ), nên bổ sung phân tích chi tiết.');
  } else {
    suggestions.push('Nội dung quá ngắn để đạt chuẩn xếp hạng SEO cạnh tranh.');
  }

  // 4. Headings Structure (15 pts)
  const h1Matches = contentMarkdown.match(/^#\s+[^\n]+/gm) || [];
  const h2Matches = contentMarkdown.match(/^##\s+[^\n]+/gm) || [];
  const h3Matches = contentMarkdown.match(/^###\s+[^\n]+/gm) || [];

  const h1Count = h1Matches.length;
  const h2Count = h2Matches.length;
  const h3Count = h3Matches.length;

  let headingScore = 0;
  if (h1Count === 1) {
    headingScore += 5;
  } else if (h1Count === 0) {
    suggestions.push('Cần 1 thẻ H1 duy nhất làm tiêu đề chính của bài viết.');
  } else {
    headingScore += 2;
    suggestions.push('Bài viết có nhiều hơn 1 thẻ H1, nên chỉ giữ lại 1 thẻ H1.');
  }

  if (h2Count >= 3) {
    headingScore += 6;
  } else if (h2Count >= 1) {
    headingScore += 3;
    suggestions.push('Nên chia bài viết thành ít nhất 3 - 5 mục H2 rõ ràng.');
  } else {
    suggestions.push('Thiếu các thẻ đề mục H2 để cấu trúc bài viết.');
  }

  if (h3Count >= 2) {
    headingScore += 4;
  } else if (h3Count >= 1) {
    headingScore += 2;
  }
  totalScore += headingScore;

  // 5. GEO 2026 - Direct Answer / Key Takeaways (15 pts)
  const hasDirectAnswer =
    /direct answer|câu trả lời trực tiếp|key takeaways|điểm cốt lõi|tóm tắt nhanh/i.test(contentMarkdown) ||
    /^(>|\*\*tóm tắt\*\*|\*\*trọng tâm\*\*)/im.test(contentMarkdown);

  if (hasDirectAnswer) {
    totalScore += 15;
  } else {
    suggestions.push('Tiêu chuẩn GEO 2026: Nên có khối "Key Takeaways" hoặc tóm tắt trọng tâm đầu bài để AI dễ trích dẫn.');
  }

  // 6. Bảng so sánh Table (10 pts)
  const hasTable = /\|(\s*[-:]+\s*\|)+/.test(contentMarkdown);
  if (hasTable) {
    totalScore += 10;
  } else {
    suggestions.push('Nên có ít nhất 1 bảng so sánh (Markdown Table) để tăng trải nghiệm trực quan cho người đọc.');
  }

  // 7. FAQ Section (10 pts)
  const hasFaq = /faq|câu hỏi thường gặp|thắc mắc thường gặp/i.test(contentMarkdown);
  if (hasFaq) {
    totalScore += 10;
  } else {
    suggestions.push('Nên bổ sung phần FAQ (Câu hỏi thường gặp) để tối ưu hiển thị Rich Results và AI Overviews.');
  }

  // 8. Keyword Matching & Density (15 pts)
  const lowerContent = contentMarkdown.toLowerCase();
  let matchedCount = 0;

  for (const kw of keywords) {
    if (lowerContent.includes(kw.keyword.toLowerCase())) {
      matchedCount++;
    }
  }

  const totalKw = keywords.length;
  let kwScore = 0;
  if (totalKw > 0) {
    const ratio = matchedCount / totalKw;
    if (ratio >= 0.8) {
      kwScore = 15;
    } else if (ratio >= 0.5) {
      kwScore = 10;
      suggestions.push(`Đã phủ ${matchedCount}/${totalKw} từ khóa. Hãy cố gắng lồng ghép thêm các từ khóa còn lại.`);
    } else {
      kwScore = 5;
      suggestions.push(`Mới chỉ xuất hiện ${matchedCount}/${totalKw} từ khóa từ file nạp vào.`);
    }
  } else {
    kwScore = 10; // Không nạp file từ khóa thì cho điểm trung bình
  }
  totalScore += kwScore;

  return {
    totalScore: Math.min(100, Math.max(0, Math.round(totalScore))),
    wordCount,
    hasDirectAnswer,
    hasTable,
    hasFaq,
    hasH2H3: h2Count >= 2,
    headingsCount: { h1: h1Count, h2: h2Count, h3: h3Count },
    keywordScore: kwScore,
    keywordMatched: matchedCount,
    totalKeywords: totalKw,
    suggestions: suggestions.slice(0, 4),
  };
}
