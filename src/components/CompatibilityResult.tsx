import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, AlertTriangle, Lightbulb, RefreshCcw, Share2, Star, ChevronRight, Layers } from 'lucide-react';
import { CompatibilityResult as CompatibilityResultType } from '../types';
import Markdown from 'react-markdown';
import { Logo } from './Logo';
import { triggerVibration } from '../lib/vibration';
import { AudioNarrator } from './AudioNarrator';

// Parse markdown table to structured layout
function parseMarkdownTable(markdown: string) {
  if (!markdown) return null;
  const lines = markdown.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Find lines that have pipes
  const tableLines = lines.filter(line => line.includes('|'));
  if (tableLines.length < 3) return null;

  const parseRow = (line: string) => {
    let parts = line.split('|');
    if (line.startsWith('|')) parts.shift();
    if (line.endsWith('|')) parts.pop();
    return parts.map(p => p.trim());
  };

  const headers = parseRow(tableLines[0]).map(h => h.replace(/\*\*|__/g, ''));
  if (headers.length < 2) return null;

  // Verify that the second line is indeed a separator line (contains dashes)
  if (!tableLines[1].includes('-')) return null;

  const rows: string[][] = [];
  for (let i = 2; i < tableLines.length; i++) {
    const line = tableLines[i];
    if (!line.includes('|')) break; // End of table
    const cells = parseRow(line);
    if (cells.length >= headers.length) {
      rows.push(cells.slice(0, headers.length));
    } else {
      const padded = [...cells];
      while (padded.length < headers.length) padded.push('');
      rows.push(padded);
    }
  }

  if (headers.length > 0 && rows.length > 0) {
    return { headers, rows };
  }
  return null;
}

const getFallbackTable = (result: CompatibilityResultType) => {
  const m1 = result.person1Data.elementData.element;
  const m2 = result.person2Data.elementData.element;
  
  const lp1 = result.person1Data.lifePath;
  const lp2 = result.person2Data.lifePath;
  const lpEval = lp1 === lp2 ? 'Đồng điệu tuyệt vời (Cùng tần số số chủ đạo)' : 'Bổ trợ hoàn hảo (Cân bằng năng lượng cuộc sống)';

  let elementEval = 'Năng lượng ngũ hành bình hòa';
  if ((m1 === 'Hỏa' && m2 === 'Thủy') || (m1 === 'Thủy' && m2 === 'Hỏa')) elementEval = 'Tương khắc (Thủy khắc Hỏa) - Cần thấu cảm hóa giải';
  if ((m1 === 'Hỏa' && m2 === 'Thổ') || (m1 === 'Thổ' && m2 === 'Hỏa')) elementEval = 'Tương sinh (Hỏa sinh Thổ) - Vun đắp cát tường';
  if ((m1 === 'Thủy' && m2 === 'Mộc') || (m1 === 'Mộc' && m2 === 'Thủy')) elementEval = 'Tương sinh (Thủy sinh Mộc) - Cực kỳ thuận lợi';
  if ((m1 === 'Kim' && m2 === 'Thủy') || (m1 === 'Thủy' && m2 === 'Kim')) elementEval = 'Tương sinh (Kim sinh Thủy) - Tương hợp bền vững';
  if ((m1 === 'Mộc' && m2 === 'Hỏa') || (m1 === 'Hỏa' && m2 === 'Mộc')) elementEval = 'Tương sinh (Mộc sinh Hỏa) - May mắn hưng vượng';
  if ((m1 === 'Thổ' && m2 === 'Kim') || (m1 === 'Kim' && m2 === 'Thổ')) elementEval = 'Tương sinh (Thổ sinh Kim) - Sung túc hòa hợp';
  if ((m1 === 'Kim' && m2 === 'Mộc') || (m1 === 'Mộc' && m2 === 'Kim')) elementEval = 'Tương khắc (Kim khắc Mộc) - Tiết chế để thấu hiểu';
  if ((m1 === 'Mộc' && m2 === 'Thổ') || (m1 === 'Thổ' && m2 === 'Mộc')) elementEval = 'Tương khắc (Mộc khắc Thổ) - Cần lắng nghe sẻ chia';
  if ((m1 === 'Thổ' && m2 === 'Thủy') || (m1 === 'Thủy' && m2 === 'Thổ')) elementEval = 'Tương khắc (Thổ khắc Thủy) - Kiên nhẫn vượt rào cản';

  return {
    headers: ['Tiêu chí', result.person1.fullName, result.person2.fullName, 'Đánh giá chi tiết'],
    rows: [
      ['Số chủ đạo', String(lp1), String(lp2), lpEval],
      ['Bản mệnh Ngũ hành', m1, m2, elementEval],
      ['Năm Cá Nhân', String(result.person1Data.personalYear), String(result.person2Data.personalYear), 'Chu kỳ vận hành năng lượng'],
      ['Chỉ số Sứ mệnh', String(result.person1Data.destiny), String(result.person2Data.destiny), 'Sự hòa quyện chí hướng tương lai']
    ]
  };
};

export function CompatibilityResult({ result, onReset }: { result: CompatibilityResultType; onReset: () => void }) {
  const tableData = parseMarkdownTable(result.aiInterpretation.comparisonTable) || getFallbackTable(result);

  return (
    <div className="min-h-screen bg-brand-black pb-20">
      {/* Hero Header */}
      <div className="relative h-96 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/20 to-brand-black" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 text-center flex flex-col items-center"
        >
          <Logo className="mb-8 scale-75 md:scale-90 subtle-glow" />
          <div className="flex items-center justify-center gap-12 mb-8 bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-md subtle-glow">
            <div className="text-center group">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                <span className="text-2xl font-bold text-blue-500">{result.person1Data.lifePath}</span>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-display">{result.person1Data.elementData.element}</p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full" />
              <Heart className="w-16 h-16 text-rose-500 fill-rose-500/20 animate-pulse relative z-10" />
              <div className="absolute -top-2 -right-2 bg-white text-brand-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-20">
                {result.score}%
              </div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                <span className="text-2xl font-bold text-rose-500">{result.person2Data.lifePath}</span>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-display">{result.person2Data.elementData.element}</p>
            </div>
          </div>

          <h1 className="text-4xl font-display font-bold text-white mb-3">Kết Quả Hòa Hợp</h1>
          <p className="text-white/60 max-w-sm">{result.score > 80 ? 'Một mối nhân duyên tiền định' : result.score > 50 ? 'Sự kết hợp đầy tiềm năng' : 'Cần nhiều sự thấu cảm và hóa giải'}</p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-20 space-y-8">
        {/* Comparison Table Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel p-6 md:p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-4">
             <Star className="w-5 h-5 text-brand-orange animate-pulse" />
             <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Thông Số Đối Chiếu</h2>
          </div>
          
          <div className="space-y-4">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 text-xs font-display uppercase tracking-widest text-white/50 font-bold">
              <div className="col-span-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-brand-gold" />
                <span>{tableData.headers[0] || 'Tiêu chí'}</span>
              </div>
              <div className="col-span-3 text-center">{tableData.headers[1] || 'Người 1'}</div>
              <div className="col-span-3 text-center">{tableData.headers[2] || 'Người 2'}</div>
              <div className="col-span-3 text-right">Luận giải chi tiết</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-4">
              {tableData.rows.map((row, idx) => {
                const criteria = row[0] || '';
                const p1Val = row[1] || '';
                const p2Val = row[2] || '';
                const evalText = row[3] || '';

                const isGood = evalText.toLowerCase().includes('tốt') || 
                               evalText.toLowerCase().includes('hợp') || 
                               evalText.toLowerCase().includes('sinh') ||
                               evalText.toLowerCase().includes('cát') ||
                               evalText.toLowerCase().includes('vững');
                const isWarning = evalText.toLowerCase().includes('khắc') || 
                                  evalText.toLowerCase().includes('xung') || 
                                  evalText.toLowerCase().includes('hại') || 
                                  evalText.toLowerCase().includes('tử') || 
                                  evalText.toLowerCase().includes('tuyệt');

                const evalBadgeClass = isGood 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : isWarning 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                    : 'bg-brand-orange/10 border-brand-orange/20 text-brand-orange';

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-brand-gold/30 transition-all duration-300 p-5 md:p-6 shadow-md hover:shadow-xl"
                  >
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/[0.01] to-brand-gold/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center relative z-10">
                      {/* Criteria */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-brand-gold/40 rounded-full group-hover:bg-brand-gold group-hover:scale-y-110 transition-all duration-300" />
                        <span className="font-display font-bold text-sm text-white/90 group-hover:text-white transition-colors">
                          {criteria}
                        </span>
                      </div>

                      {/* Person 1 Value */}
                      <div className="col-span-3 text-center">
                        <span className="inline-block px-4 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-400 font-medium text-xs font-display">
                          {p1Val}
                        </span>
                      </div>

                      {/* Person 2 Value */}
                      <div className="col-span-3 text-center">
                        <span className="inline-block px-4 py-2 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-400 font-medium text-xs font-display">
                          {p2Val}
                        </span>
                      </div>

                      {/* Evaluation Text */}
                      <div className="col-span-3 text-right">
                        <span className={`inline-block px-4 py-2 rounded-xl border text-xs font-semibold leading-relaxed text-left ${evalBadgeClass}`}>
                          {evalText}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="md:hidden space-y-4 relative z-10">
                      {/* Header: Criteria */}
                      <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                        <div className="w-1.5 h-5 bg-brand-gold rounded-full" />
                        <span className="font-display font-bold text-sm text-brand-gold uppercase tracking-wider">
                          {criteria}
                        </span>
                      </div>

                      {/* Side by side inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-blue-500/[0.03] border border-blue-500/10 flex flex-col items-center justify-center">
                          <span className="text-[9px] uppercase tracking-widest text-blue-500/60 font-display font-medium mb-1">
                            {tableData.headers[1] || 'Người 1'}
                          </span>
                          <span className="text-xs font-bold text-blue-400 text-center font-display">
                            {p1Val}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-rose-500/[0.03] border border-rose-500/10 flex flex-col items-center justify-center">
                          <span className="text-[9px] uppercase tracking-widest text-rose-500/60 font-display font-medium mb-1">
                            {tableData.headers[2] || 'Người 2'}
                          </span>
                          <span className="text-xs font-bold text-rose-400 text-center font-display">
                            {p2Val}
                          </span>
                        </div>
                      </div>

                      {/* Evaluation segment */}
                      <div className={`p-4 rounded-xl border ${evalBadgeClass} flex flex-col gap-1.5`}>
                        <span className="text-[9px] uppercase tracking-widest opacity-60 font-display font-bold flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" /> Luận Giải Chi Tiết
                        </span>
                        <p className="text-xs font-medium leading-relaxed">
                          {evalText}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Compatibility Score Bar */}
        <div className="glass-panel p-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-sm uppercase tracking-widest text-white/40">Chỉ số hòa hợp</h3>
              <p className="text-3xl font-display font-bold text-white">{result.score}%</p>
            </div>
            <p className="text-xs text-white/30 italic">Dựa trên 12 yếu tố bản mệnh</p>
          </div>
          <div className="h-4 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${result.score}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-rose-500 to-brand-gold"
            />
          </div>
        </div>

        {/* Detailed Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="glass-panel p-8 border-emerald-500/10 bg-emerald-500/[0.01] flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-6 h-6 text-emerald-500" />
                   <h2 className="text-xl font-display font-bold text-white uppercase">Sự Tương Hợp</h2>
                </div>
                <AudioNarrator text={result.aiInterpretation.compatibilityAnalysis} title="Nghe luận tương hợp" />
              </div>
              <div className="prose prose-invert max-w-none text-white">
                <Markdown>{result.aiInterpretation.compatibilityAnalysis}</Markdown>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="glass-panel p-8 border-rose-500/10 bg-rose-500/[0.01] flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                   <AlertTriangle className="w-6 h-6 text-rose-500" />
                   <h2 className="text-xl font-display font-bold text-white uppercase">Xung Khắc Cần Lưu Ý</h2>
                </div>
                <AudioNarrator text={result.aiInterpretation.conflicts} title="Nghe luận xung khắc" />
              </div>
              <div className="prose prose-invert max-w-none text-white">
                <Markdown>{result.aiInterpretation.conflicts}</Markdown>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Solution section */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="glass-panel p-8 border-brand-gold/10 bg-brand-gold/[0.02]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
               <Lightbulb className="w-6 h-6 text-brand-orange" />
               <h2 className="text-xl font-display font-bold text-white uppercase">Giải Pháp & Hóa Giải</h2>
            </div>
            <AudioNarrator text={result.aiInterpretation.solutions} title="Nghe giải pháp hóa giải" />
          </div>
          <div className="prose prose-invert max-w-none text-white">
            <Markdown>{result.aiInterpretation.solutions}</Markdown>
          </div>
        </motion.div>

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerVibration(40);
              onReset();
            }}
            className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all cursor-pointer"
          >
            <RefreshCcw className="w-5 h-5" /> Trở Lại
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => triggerVibration(30)}
            className="flex items-center gap-2 px-8 py-4 bg-brand-orange text-black font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-orange/20 cursor-pointer"
          >
            <Share2 className="w-5 h-5" /> Lưu & Chia Sẻ
          </motion.button>
        </div>

        {/* SEO Block */}
        <div className="mt-20 pt-10 border-t border-white/5 text-[10px] space-y-4 text-white/80">
           <h3 className="text-xs font-display font-bold text-brand-orange uppercase tracking-wider">Xem ngày lành tháng tốt cho hôn nhân</h3>
           <p className="leading-relaxed font-light">Kết quả đối chiếu tuổi vợ chồng dựa trên các phép tính mệnh hỏa mệnh thủy. Xem chi tiết lục xung, lục hại và cách hóa giải để cuộc sống gia đình ấm êm, hạnh phúc.</p>
           <p className="text-white/50 leading-relaxed font-light">
             {Array(30).fill("Cách chọn hướng nhà hợp tuổi vợ chồng để kích hoạt tài lộc và bình an.").join(" ")}
           </p>
        </div>
      </div>
    </div>
  );
}
