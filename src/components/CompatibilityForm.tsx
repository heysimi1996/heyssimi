import React from 'react';
import { motion } from 'motion/react';
import { User, Heart, Sparkles, Calendar, Clock } from 'lucide-react';
import { UserInput, Gender } from '../types';

interface Props {
  onAnalyze: (p1: UserInput, p2: UserInput) => void;
}

export function CompatibilityForm({ onAnalyze }: Props) {
  const [person1, setPerson1] = React.useState<UserInput>({
    fullName: '',
    birthDate: '',
    birthHour: '',
    gender: 'Nam',
    facialFeatures: { forehead: 'Dày', eyes: 'Sáng', mouth: 'Rộng' }
  });

  const [person2, setPerson2] = React.useState<UserInput>({
    fullName: '',
    birthDate: '',
    birthHour: '',
    gender: 'Nữ',
    facialFeatures: { forehead: 'Dày', eyes: 'Sáng', mouth: 'Rộng' }
  });

  const renderGenderSelect = (person: UserInput, setPerson: React.Dispatch<React.SetStateAction<UserInput>>) => (
    <div className="flex gap-2">
      {(['Nam', 'Nữ', 'LGBT+'] as Gender[]).map(g => (
        <button
          key={g}
          type="button"
          onClick={() => setPerson({ ...person, gender: g })}
          className={`flex-1 py-2 text-xs rounded-lg border transition-all relative overflow-hidden ${
            person.gender === g 
              ? g === 'LGBT+' 
                ? 'lgbt-gradient-border text-white' 
                : 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
          }`}
        >
           {g === 'LGBT+' && person.gender === g && (
            <div className="absolute inset-0 animate-rainbow opacity-10 bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
          )}
          <span className="relative z-10">{g}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="glass-panel subtle-glow p-8 space-y-6 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }}
          className="inline-block p-4 bg-rose-500/10 rounded-full mb-4 subtle-glow"
        >
          <Heart className="w-12 h-12 text-rose-500 animate-pulse" />
        </motion.div>
        <h2 className="text-4xl font-display font-bold text-white mb-2">Đối Chiếu & Hợp Tuổi</h2>
        <p className="text-white/40 max-w-lg mx-auto">Phân tích mức độ tương hợp giữa hai người dựa trên Thần số học, Ngũ hành và Cung phi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-8 items-center">
        {/* Person 1 - Nam */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="glass-panel subtle-glow p-8 space-y-6 border-blue-500/10"
        >
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <User className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Đối tượng 1</h3>
              <p className="text-xs text-white/30 uppercase tracking-widest">Thông tin bản mệnh</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40 block">Giới tính</label>
              {renderGenderSelect(person1, setPerson1)}
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40 block">Họ và tên</label>
              <input 
                value={person1.fullName}
                onChange={e => setPerson1({ ...person1, fullName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                placeholder="Nhập họ tên..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40 block">Ngày sinh</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="date"
                    value={person1.birthDate}
                    onChange={e => setPerson1({ ...person1, birthDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40 block">Giờ sinh</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="time"
                    value={person1.birthHour}
                    onChange={e => setPerson1({ ...person1, birthHour: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Connector */}
        <div className="flex lg:flex-col items-center justify-center gap-4">
          <div className="h-px w-12 lg:w-px lg:h-12 bg-gradient-to-r lg:bg-gradient-to-b from-blue-500/50 to-rose-500/50" />
          <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-rose-500/20 group-hover:scale-150 transition-transform duration-700" />
             <Sparkles className="w-8 h-8 text-white relative z-10" />
          </div>
          <div className="h-px w-12 lg:w-px lg:h-12 bg-gradient-to-r lg:bg-gradient-to-b from-blue-500/50 to-rose-500/50" />
        </div>

        {/* Person 2 - Nữ */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="glass-panel subtle-glow p-8 space-y-6 border-rose-500/10"
        >
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="p-3 bg-rose-500/10 rounded-xl">
              <User className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Người Nữ</h3>
              <p className="text-xs text-white/30 uppercase tracking-widest">Thông tin bản mệnh</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40 block">Họ và tên</label>
              <input 
                value={person2.fullName}
                onChange={e => setPerson2({ ...person2, fullName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500/50 outline-none transition-all"
                placeholder="Nhập họ tên..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40 block">Ngày sinh</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="date"
                    value={person2.birthDate}
                    onChange={e => setPerson2({ ...person2, birthDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-rose-500/50 outline-none transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40 block">Giờ sinh</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="time"
                    value={person2.birthHour}
                    onChange={e => setPerson2({ ...person2, birthHour: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-rose-500/50 outline-none transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => onAnalyze(person1, person2)}
          disabled={!person1.fullName || !person2.fullName || !person1.birthDate || !person2.birthDate}
          className="px-12 py-5 bg-gradient-to-r from-blue-600 to-rose-600 text-white rounded-2xl font-display font-bold text-lg shadow-2xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all subtle-glow disabled:opacity-50 disabled:pointer-events-none"
        >
          Phân Tích Sự Xung Khắc & Tương Hợp
        </button>
      </div>

      <div className="mt-20 opacity-[0.03] text-xs max-w-4xl mx-auto space-y-4 pointer-events-none">
        <h2>Xem tuổi vợ chồng hợp khắc năm 2024</h2>
        <p>Phân tích chi tiết mức độ hòa hợp giữa hai người dựa trên các yếu tố phong thủy cổ truyền kết hợp thuật toán AI hiện đại. Chúng tôi xem xét Ngũ hành, Thiên can, Địa chi và Thần số học Pythagoras để đưa ra lời khuyên chính xác nhất về tình duyên và sự nghiệp khi hai người kết hợp.</p>
        {Array(10).fill("Cách hóa giải tuyệt mệnh trong hôn nhân bằng hướng nhà và màu sắc phong thủy.").join(" ")}
      </div>
    </div>
  );
}
