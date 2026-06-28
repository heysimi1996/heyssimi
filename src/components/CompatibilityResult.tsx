import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, AlertTriangle, Lightbulb, RefreshCcw, Share2, Star } from 'lucide-react';
import { CompatibilityResult as CompatibilityResultType } from '../types';
import Markdown from 'react-markdown';
import { Logo } from './Logo';

interface Props {
  result: CompatibilityResultType;
  onReset: () => void;
}

export function CompatibilityResult({ result, onReset }: Props) {
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
          className="glass-panel p-8"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
             <Star className="w-5 h-5 text-brand-orange" />
             <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Thông Số Đối Chiếu</h2>
          </div>
          <div className="prose prose-invert max-w-none prose-sm lg:prose-base text-white">
            <Markdown>{result.aiInterpretation.comparisonTable}</Markdown>
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
            className="glass-panel p-8 border-emerald-500/10 bg-emerald-500/[0.01]"
          >
            <div className="flex items-center gap-3 mb-6">
               <ShieldCheck className="w-6 h-6 text-emerald-500" />
               <h2 className="text-xl font-display font-bold text-white uppercase">Sự Tương Hợp</h2>
            </div>
            <div className="prose prose-invert max-w-none text-white">
              <Markdown>{result.aiInterpretation.compatibilityAnalysis}</Markdown>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="glass-panel p-8 border-rose-500/10 bg-rose-500/[0.01]"
          >
            <div className="flex items-center gap-3 mb-6">
               <AlertTriangle className="w-6 h-6 text-rose-500" />
               <h2 className="text-xl font-display font-bold text-white uppercase">Xung Khắc Cần Lưu Ý</h2>
            </div>
            <div className="prose prose-invert max-w-none text-white">
              <Markdown>{result.aiInterpretation.conflicts}</Markdown>
            </div>
          </motion.div>
        </div>

        {/* Solution section */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="glass-panel p-8 border-brand-gold/10 bg-brand-gold/[0.02]"
        >
          <div className="flex items-center gap-3 mb-6">
             <Lightbulb className="w-6 h-6 text-brand-orange" />
             <h2 className="text-xl font-display font-bold text-white uppercase">Giải Pháp & Hóa Giải</h2>
          </div>
          <div className="prose prose-invert max-w-none text-white">
            <Markdown>{result.aiInterpretation.solutions}</Markdown>
          </div>
        </motion.div>

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"
          >
            <RefreshCcw className="w-5 h-5" /> Trở Lại
          </button>
          <button className="flex items-center gap-2 px-8 py-4 bg-brand-orange text-black font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-orange/20">
            <Share2 className="w-5 h-5" /> Lưu & Chia Sẻ
          </button>
        </div>

        {/* SEO Block */}
        <div className="mt-20 pt-20 border-t border-white/5 opacity-[0.03] text-[10px] space-y-4">
           <h3>Xem ngày lành tháng tốt cho hôn nhân</h3>
           <p>Kết quả đối chiếu tuổi vợ chồng dựa trên các phép tính mệnh hỏa mệnh thủy. Xem chi tiết lục xung, lục hại và cách hóa giải để cuộc sống gia đình ấm êm, hạnh phúc.</p>
           {Array(30).fill("Cách chọn hướng nhà hợp tuổi vợ chồng để kích hoạt tài lộc và bình an.").join(" ")}
        </div>
      </div>
    </div>
  );
}
