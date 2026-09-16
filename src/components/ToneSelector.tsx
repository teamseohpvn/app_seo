'use client';

import React from 'react';
import { ToneType } from '@/lib/ai/types';
import { Smile, Feather, Code, Landmark, Laugh, Megaphone, Sliders } from 'lucide-react';

interface ToneSelectorProps {
  selectedTone: ToneType;
  onChangeTone: (tone: ToneType) => void;
  customPrompt: string;
  onChangeCustomPrompt: (prompt: string) => void;
}

interface ToneOption {
  id: ToneType;
  title: string;
  desc: string;
  icon: React.ElementType;
  badge: string;
  example: string;
}

const TONES: ToneOption[] = [
  {
    id: 'natural',
    title: 'Đời thường, Gần gũi',
    desc: 'Trò chuyện mộc mạc, chia sẻ trải nghiệm thực tế như bạn bè',
    icon: Smile,
    badge: 'Phổ biến nhất',
    example: '"Sau hơn 6 tháng tự tay tối ưu web, mình nhận ra điều này..."',
  },
  {
    id: 'smooth',
    title: 'Mượt mà, Cảm xúc',
    desc: 'Văn phong bay bổng, storytelling giàu hình ảnh, truyền cảm hứng',
    icon: Feather,
    badge: 'Storytelling',
    example: '"Một thương hiệu chạm đến trái tim người dùng không bắt đầu từ số liệu..."',
  },
  {
    id: 'technical',
    title: 'Kỹ thuật, Chuyên sâu',
    desc: 'Chuẩn xác thuật ngữ, lập luận logic, có số liệu và phân tích đa chiều',
    icon: Code,
    badge: 'B2B & IT',
    example: '"Kiến trúc Serverless giảm 40% độ trễ TTFB so với hạ tầng truyền thống..."',
  },
  {
    id: 'formal',
    title: 'Hành chính, Trang trọng',
    desc: 'Trung lập, khách quan, câu cú chuẩn mực văn bản doanh nghiệp',
    icon: Landmark,
    badge: 'Chuyên nghiệp',
    example: '"Căn cứ theo quy chuẩn phát triển nội dung số và hướng dẫn của cơ quan chức năng..."',
  },
  {
    id: 'humorous',
    title: 'Hài hước, Dí dỏm',
    desc: 'Bắt trend Gen Z, pha trò tinh tế, tạo tiếng cười sảng khoái dễ nhớ',
    icon: Laugh,
    badge: 'Viral Social',
    example: '"Nếu bạn vẫn SEO theo kiểu 2018 thì chúc mừng, web của bạn vừa hóa thạch rồi đấy..."',
  },
  {
    id: 'persuasive',
    title: 'Thuyết phục, Bán hàng',
    desc: 'Đánh trúng nỗi đau (Pain points), thôi thúc hành động, CTA sắc bén',
    icon: Megaphone,
    badge: 'Copywriting',
    example: '"Đừng để đối thủ cướp mất 80% khách hàng tiềm năng chỉ vì website vắng vẻ..."',
  },
  {
    id: 'custom',
    title: 'Tùy chỉnh riêng',
    desc: 'Tự định nghĩa giọng văn hoặc dán bài mẫu để AI học phong cách',
    icon: Sliders,
    badge: 'Nâng cao',
    example: 'Dán đoạn văn mẫu của bạn vào bên dưới',
  },
];

export function ToneSelector({
  selectedTone,
  onChangeTone,
  customPrompt,
  onChangeCustomPrompt,
}: ToneSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Smile className="w-3.5 h-3.5 text-pink-400" />
          Tùy chọn phong cách văn phong (Tone of Voice)
        </label>
        <span className="text-[11px] text-slate-500">
          Quyết định cảm xúc và cách AI xưng hô
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {TONES.map(item => {
          const isSelected = selectedTone === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTone(item.id)}
              className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-pink-500 bg-pink-950/20 ring-1 ring-pink-500/40'
                  : 'border-white/10 bg-slate-900/40 hover:border-white/20 hover:bg-slate-900/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected
                          ? 'bg-pink-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {item.desc}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5">
                <span className="text-[10px] text-slate-500 italic line-clamp-1">
                  {item.example}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedTone === 'custom' && (
        <div className="p-3 rounded-xl bg-slate-950 border border-pink-500/30 space-y-2 animate-fadeIn">
          <span className="text-xs font-semibold text-pink-300 block">
            Mô tả phong cách mong muốn hoặc dán 1 đoạn văn mẫu của bạn:
          </span>
          <textarea
            value={customPrompt}
            onChange={e => onChangeCustomPrompt(e.target.value)}
            rows={3}
            placeholder="Ví dụ: Giọng văn dí dỏm của một chuyên gia IT 10 năm kinh nghiệm, thường xưng hô 'mình - các bạn', hay dùng ẩn dụ về cà phê và bóng đá..."
            className="w-full p-2.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-pink-500 font-mono resize-none"
          />
        </div>
      )}
    </div>
  );
}
