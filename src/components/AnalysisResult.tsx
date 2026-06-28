import React from 'react';
import { motion } from 'motion/react';
import { AnalysisResult as AnalysisResultType, Arrow } from '../types';
import { 
  Trophy, 
  Heart, 
  Map, 
  Sun, 
  Eye, 
  Compass, 
  RefreshCcw, 
  Calendar,
  Layers,
  ChevronRight,
  Info,
  Flame,
  Droplets,
  Mountain,
  CircleDot,
  ZapOff,
  ShieldAlert,
  Sparkles as SparklesIcon
} from 'lucide-react';
import { Logo } from './Logo';

const Trees = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 10v.01"/><path d="M14 10v.01"/><path d="M10 14v.01"/><path d="M14 14v.01"/><path d="M16 8c.6 0 1.1.2 1.4.5.3.3.6.8.6 1.5 0 .2 0 .4-.1.6-.3.5-.7.8-1.5.9-.2 0-.4 0-.6-.1-.1 0-.2 0-.3-.1-.5 0-.9-.2-1.1-.4-.1-.1-.3-.3-.3-.4 0-.1-.1-.2-.1-.4-.1-.3-.1-.6-.1-1.1 0-1.1.9-2 2-2z"/><path d="M18 10c.6 0 1.1.2 1.4.5.3.3.6.8.6 1.5 0 .2 0 .4-.1.6-.3.5-.7.8-1.5.9-.2 0-.4 0-.6-.1-.1 0-.2 0-.3-.1-.5 0-.9-.2-1.1-.4-.1-.1-.3-.3-.3-.4 0-.1-.1-.2-.1-.4-.1-.3-.1-.6-.1-1.1 0-1.1.9-2 2-2z"/><path d="M14 6c.6 0 1.1.2 1.4.5.3.3.6.8.6 1.5 0 .2 0 .4-.1.6-.3.5-.7.8-1.5.9-.2 0-.4 0-.6-.1-.1 0-.2 0-.3-.1-.5 0-.9-.2-1.1-.4-.1-.1-.3-.3-.3-.4 0-.1-.1-.2-.1-.4-.1-.3-.1-.6-.1-1.1 0-1.1.9-2 2-2z"/><path d="M10 6c.6 0 1.1.2 1.4.5.3.3.6.8.6 1.5 0 .2 0 .4-.1.6-.3.5-.7.8-1.5.9-.2 0-.4 0-.6-.1-.1 0-.2 0-.3-.1-.5 0-.9-.2-1.1-.4-.1-.1-.3-.3-.3-.4 0-.1-.1-.2-.1-.4-.1-.3-.1-.6-.1-1.1 0-1.1.9-2 2-2z"/><path d="M12 22v-3"/><path d="M9 19c0-3.5 1.3-6.4 3-6.4s3 2.9 3 6.4H9z"/></svg>
);

interface Props {
  result: AnalysisResultType;
  onReset: () => void;
}

export function AnalysisResult({ result, onReset }: Props) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'inner' | 'forecast' | 'face' | 'element' | 'fengshui'>('overview');

  const getElementIcon = () => {
    switch (result.numerology.elementData.element) {
      case 'Kim': return CircleDot;
      case 'Mộc': return Trees;
      case 'Thủy': return Droplets;
      case 'Hỏa': return Flame;
      case 'Thổ': return Mountain;
      default: return Sun;
    }
  };

  const ElementIcon = getElementIcon();

  const tabs = [
    { id: 'overview', label: 'Vận Mệnh', icon: Trophy },
    { id: 'inner', label: 'Sâu Thẳm', icon: Heart },
    { id: 'element', label: 'Bản Mệnh', icon: ElementIcon },
    { id: 'forecast', label: 'Tương Lai', icon: Map },
    { id: 'face', label: 'Nhân Tướng', icon: Eye },
    { id: 'fengshui', label: 'Cải Vận', icon: Compass },
  ] as const;

  return (
    <div className="min-h-screen bg-brand-black pb-20">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4 subtle-glow">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <Logo className="scale-75 origin-center md:origin-left" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <h2 className="text-white font-display font-medium text-xs leading-tight uppercase tracking-widest">{result.input.fullName}</h2>
              <p className="text-white/40 text-[10px]">{result.input.birthDate} • {result.input.gender}</p>
            </div>
            <button 
              onClick={onReset}
              className="group flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all border border-white/10 subtle-glow active:scale-95"
            >
              <RefreshCcw className="w-4 h-4 transition-transform group-hover:rotate-180" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-display font-bold">Phân tích mới</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Số Chủ Đạo" value={result.numerology.lifePath} color="gold" />
          <StatCard label="Số Sứ Mệnh" value={result.numerology.destiny} color="blue" />
          <StatCard label="Số Linh Hồn" value={result.numerology.soulUrge} color="rose" />
          <StatCard label="Năm Cá Nhân" value={result.numerology.personalYear} color="emerald" />
          <div className="glass-panel p-4 flex flex-col items-center justify-center border-b-2 border-white/20 col-span-2 lg:col-span-1">
            <span className="text-[10px] uppercase font-display tracking-[0.2em] opacity-60 mb-1">Bản Mệnh</span>
            <span className="text-xl font-display font-bold text-white whitespace-nowrap">{result.numerology.elementData.element}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto gap-2 p-1 bg-white/5 rounded-2xl no-scrollbar scroll-smooth">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-display font-medium text-sm tracking-wide uppercase">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic content based on tab */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-8 min-h-[500px]"
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <SectionTitle title="Luận Giải Tổng Quan Vận Mệnh" />
                  <div className="prose prose-invert max-w-none text-white leading-relaxed whitespace-pre-wrap">
                    {result.aiInterpretation.overview}
                  </div>

                </div>
              )}

              {activeTab === 'inner' && (
                <div className="space-y-6">
                  <SectionTitle title="Năng Lượng Nội Tại & Tử Huyệt" />
                  <div className="prose prose-invert max-w-none text-white leading-relaxed whitespace-pre-wrap">
                    {result.aiInterpretation.innerEnergy}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-brand-orange text-xs uppercase tracking-widest mb-2 font-display">Tâm hồn khao khát</h4>
                      <p className="text-2xl font-display font-bold">Số {result.numerology.soulUrge}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-brand-orange text-xs uppercase tracking-widest mb-2 font-display">Tính cách ẩn giấu</h4>
                      <p className="text-2xl font-display font-bold">Số {result.numerology.innerSelf}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'element' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-6 p-6 bg-brand-gold/5 rounded-2xl border border-brand-gold/10">
                    <div className="w-20 h-20 rounded-full bg-brand-gold/20 flex items-center justify-center">
                       <ElementIcon className="w-10 h-10 text-brand-gold animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-brand-gold">{result.numerology.elementData.napAm}</h3>
                      <p className="text-white/40 uppercase tracking-widest text-xs">Ngũ Hành Nạp Âm</p>
                    </div>
                  </div>
                  
                  <SectionTitle title="Tương Tác Bản Mệnh & Thần Số" />
                  <div className="prose prose-invert max-w-none text-white leading-relaxed whitespace-pre-wrap">
                    {result.aiInterpretation.elementAnalysis || result.numerology.elementData.description}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 glass-panel">
                       <h4 className="text-[10px] uppercase text-white/40 mb-2">Hướng Đại Cát</h4>
                       <div className="flex flex-wrap gap-1">
                        {result.numerology.elementData.luckyDirections.map(d => (
                          <span key={d} className="text-white font-medium">{d}</span>
                        ))}
                       </div>
                    </div>
                    <div className="p-4 glass-panel">
                       <h4 className="text-[10px] uppercase text-white/40 mb-2">Số May Mắn</h4>
                       <div className="flex gap-2">
                        {result.numerology.elementData.luckyNumbers.map(n => (
                          <span key={n} className="text-brand-gold font-bold">{n}</span>
                        ))}
                       </div>
                    </div>
                    <div className="p-4 glass-panel">
                       <h4 className="text-[10px] uppercase text-white/40 mb-2">Màu Tương Hợp</h4>
                       <div className="flex gap-2">
                        {result.numerology.elementData.luckyColors.map(c => (
                          <span key={c} className="text-emerald-400">{c}</span>
                        ))}
                       </div>
                    </div>
                  </div>
                  
                  <div id="seo-element" className="mt-8 opacity-[0.02] text-[10px]">
                    Xem nhân tướng học online và bản mệnh ngũ hành chính xác. Mệnh {result.numerology.elementData.element} của tuổi sinh năm {result.input.birthDate.split('-')[0]}.
                  </div>
                </div>
              )}

              {activeTab === 'forecast' && (
                <div className="space-y-8">
                  <SectionTitle title="Vận Trình Tương Lai" />
                  <div className="prose prose-invert max-w-none text-white leading-relaxed whitespace-pre-wrap whitespace-pre-wrap">
                    {result.aiInterpretation.futureForecast}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div className="space-y-4">
                      <h3 className="text-white font-display uppercase tracking-widest text-sm border-l-2 border-brand-gold pl-3">4 Đỉnh Cao Kim Tự Tháp</h3>
                      <div className="space-y-2">
                        {result.numerology.pyramids.map((val, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                            <span className="text-white/40 text-xs">Giai đoạn {idx + 1}</span>
                            <span className="text-brand-gold font-display font-bold">SỐ {val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-6 glass-panel flex flex-col items-center justify-center text-center bg-brand-gold/10 border-brand-gold/20">
                      <Calendar className="w-12 h-12 text-brand-gold mb-4" />
                      <h3 className="text-white/60 text-xs uppercase tracking-[0.2em] mb-1">Năm Cá Nhân Hiện Tại</h3>
                      <p className="text-5xl font-display font-bold text-brand-gold">{result.numerology.personalYear}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'face' && (
                <div className="space-y-6">
                  <SectionTitle title="Nhân Tướng Học AI" />
                  <div className="prose prose-invert max-w-none text-white leading-relaxed whitespace-pre-wrap">
                    {result.aiInterpretation.faceAnalysis}
                  </div>
                </div>
              )}

              {activeTab === 'fengshui' && (
                <div className="space-y-8">
                  <SectionTitle title="Phong Thủy Cải Vận" />
                  <div className="p-6 bg-white/5 rounded-2xl border border-brand-gold/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Compass className="w-20 h-20 text-brand-gold" />
                    </div>
                    <h3 className="text-sm font-display uppercase tracking-widest text-brand-orange mb-4 flex items-center gap-2">
                       <SparklesIcon className="w-4 h-4" /> Lời khuyên phong thủy
                    </h3>
                    <p className="text-white italic leading-relaxed relative z-10">
                      "{result.aiInterpretation.fengShui.advice}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 border-emerald-500/10 bg-emerald-500/[0.02]">
                      <h4 className="text-emerald-400 text-xs uppercase tracking-widest mb-4 font-display flex items-center gap-2">
                         Màu Sắc May Mắn
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.aiInterpretation.fengShui.luckyColors.map(c => (
                          <span key={c} className="px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-lg text-sm border border-emerald-500/20">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="glass-panel p-6 border-brand-orange/10 bg-brand-orange/[0.02]">
                      <h4 className="text-brand-orange text-xs uppercase tracking-widest mb-4 font-display flex items-center gap-2">
                          Con Số Kích Tài
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {result.aiInterpretation.fengShui.luckyNumbers.map(n => (
                          <div key={n} className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-orange/20 text-brand-orange font-bold">{n}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* New Section: Hóa giải Xung Khắc */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="p-8 border border-rose-500/10 bg-rose-500/[0.02] rounded-2xl space-y-6"
                  >
                    <div className="flex items-center gap-4 border-b border-rose-500/10 pb-4">
                      <div className="p-3 bg-rose-500/10 rounded-xl">
                        <ZapOff className="w-6 h-6 text-rose-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-white uppercase">Giải pháp Hóa giải Xung Khắc</h3>
                        <p className="text-rose-500/60 text-xs uppercase tracking-widest font-medium">Chuyển hóa năng lượng tiêu cực</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h4 className="text-sm font-bold text-white/90 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-rose-500" /> Vật phẩm Phong thủy
                          </h4>
                          <p className="text-white text-sm leading-relaxed">
                             Sử dụng các vật phẩm có tính cân bằng như Hồ lô, Đá Thạch anh tím hoặc chuỗi hạt 108 hạt để hấp thụ trược khí và tăng cường chính khí cho bản thân.
                          </p>
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sun className="w-4 h-4 text-brand-orange" /> Thiền định & Mantra
                          </h4>
                          <p className="text-white text-sm leading-relaxed">
                             Năng lượng số {result.numerology.lifePath} của bạn cần được tịnh hóa bằng bài tập thiền "Quán tưởng ánh sáng" 15 phút mỗi ngày kèm theo Mantra "Om Mani Padme Hum" để đạt được sự an lạc.
                          </p>
                       </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Birth Chart */}
          <div className="w-full lg:w-96 space-y-8">
            <div className="glass-panel p-6 flex flex-col items-center">
              <h3 className="text-sm font-display font-medium text-white/40 uppercase tracking-widest mb-6">Biểu Đồ Ngày Sinh</h3>
              <div className="grid grid-cols-3 gap-2 w-full aspect-square">
                {result.numerology.birthChart.flat().map((count, idx) => {
                  const numbers = [3, 6, 9, 2, 5, 8, 1, 4, 7];
                  const num = numbers[idx];
                  return (
                    <div 
                      key={idx}
                      className={`relative flex items-center justify-center rounded-lg border transition-all duration-500 ${
                        count > 0 
                          ? 'bg-brand-gold/10 border-brand-gold/30 text-brand-gold shadow-[0_0_15px_rgba(197,160,89,0.1)]' 
                          : 'bg-white/[0.02] border-white/5 text-white/10'
                      }`}
                    >
                      <span className="text-2xl font-display font-bold">{num}</span>
                      {count > 1 && (
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-brand-gold text-black text-[10px] font-bold rounded-full">
                          x{count}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="w-full mt-8 space-y-3">
                <h4 className="text-xs font-display uppercase tracking-widest text-white/40">Các mũi tên phân tích</h4>
                {result.numerology.arrows.map(arrow => (
                  <ArrowItem key={arrow.name} arrow={arrow} />
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-xs font-display font-medium text-white/40 uppercase tracking-widest">Hành động đề xuất</h3>
              <div className="space-y-4">
                 <div className="p-4 bg-brand-orange/10 border border-brand-orange/20 rounded-xl">
                   <p className="text-brand-orange text-sm font-medium italic">"Hãy tập thói quen ghi chép lại các ý tưởng vào sáng sớm để kích hoạt năng lượng số {result.numerology.lifePath}."</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: number, color: 'gold' | 'blue' | 'rose' | 'emerald' }) {
  const colors = {
    gold: 'text-brand-orange bg-brand-orange/5 border-brand-orange/20',
    blue: 'text-blue-400 bg-blue-500/5 border-blue-500/20',
    rose: 'text-rose-400 bg-rose-500/5 border-rose-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20'
  };

  return (
    <div className={`glass-panel p-4 flex flex-col items-center justify-center border-b-2 ${colors[color]}`}>
      <span className="text-[10px] uppercase font-display tracking-[0.2em] opacity-60 mb-1">{label}</span>
      <span className="text-3xl font-display font-bold">{value}</span>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-6 w-1 bg-brand-gold rounded-full" />
      <h2 className="text-2xl font-display font-light text-white tracking-wide uppercase italic">{title}</h2>
    </div>
  );
}

function ArrowItem({ arrow }: { arrow: Arrow, key?: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${arrow.type === 'strength' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
        <span className="text-xs text-white/80 font-medium">{arrow.name} ({arrow.path})</span>
      </div>
    </div>
  );
}
