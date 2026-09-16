import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { ParsedKeyword } from './ai/types';

export function parseTextKeywords(rawText: string): ParsedKeyword[] {
  const lines = rawText
    .split(/[\r\n,;]+/)
    .map(k => k.trim())
    .filter(k => k.length > 0 && !k.startsWith('#'));

  // Deduplicate case-insensitively
  const uniqueKeywords: string[] = [];
  const seen = new Set<string>();

  for (const k of lines) {
    const lower = k.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      uniqueKeywords.push(k);
    }
  }

  return uniqueKeywords.map((keyword, index) => {
    let type: 'primary' | 'secondary' | 'lsi' = 'lsi';
    if (index === 0) {
      type = 'primary';
    } else if (index >= 1 && index <= 4) {
      type = 'secondary';
    }
    return {
      keyword,
      type,
      count: 0,
    };
  });
}

export async function parseFileKeywords(file: File): Promise<ParsedKeyword[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'xlsx' || extension === 'xls') {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

    const extracted: string[] = [];
    for (const row of rows) {
      if (Array.isArray(row)) {
        for (const cell of row) {
          if (cell && typeof cell === 'string' && cell.trim().length > 0) {
            extracted.push(cell.trim());
          } else if (typeof cell === 'number') {
            extracted.push(cell.toString());
          }
        }
      }
    }
    return parseTextKeywords(extracted.join('\n'));
  }

  if (extension === 'csv') {
    const text = await file.text();
    const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
    const flat = (parsed.data as string[][]).flat().filter(Boolean);
    return parseTextKeywords(flat.join('\n'));
  }

  // Fallback to text
  const text = await file.text();
  return parseTextKeywords(text);
}

export function trackKeywordDensity(content: string, keywords: ParsedKeyword[]): ParsedKeyword[] {
  if (!content) {
    return keywords.map(k => ({ ...k, count: 0 }));
  }

  const lowerContent = content.toLowerCase();

  return keywords.map(kw => {
    const escaped = kw.keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    return {
      ...kw,
      count: matches ? matches.length : 0,
    };
  });
}
