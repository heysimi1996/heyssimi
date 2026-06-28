import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserInput, Gender } from '../types';
import { Calendar, User, Clock, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface Props {
  onStart: (data: UserInput) => void;
}

export function InputForm({ onStart }: Props) {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<UserInput>({
    fullName: '',
    birthDate: '',
    birthHour: '',
    gender: 'Nam',
    facialFeatures: {
      forehead: 'Cao, rộng',
      eyes: 'Sáng, to',
      mouth: 'Cân đối'
    }
  });

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="flex justify-center mb-12">
        <div className="flex gap-4">
          <div className={`w-3 h-3 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-brand-orange shadow-[0_0_15px_rgba(251,146,60,0.5)]' : 'bg-white/10'}`} />
          <div className={`w-3 h-3 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-brand-orange shadow-[0_0_15px_rgba(251,146,60,0.5)]' : 'bg-white/10'}`} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="glass-panel subtle-glow p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40 ml-1">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange/60" />
                  <input
                    required
                    type="text"
                    placeholder="NGUYỄN VĂN A"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-orange/50 transition-colors"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 ml-1">Ngày sinh</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange/60" />
                    <input
                      required
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-orange/50 transition-colors [color-scheme:dark]"
                      value={formData.birthDate}
                      onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 ml-1">Giờ sinh (Không bắt buộc)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange/60" />
                    <input
                      type="time"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-orange/50 transition-colors [color-scheme:dark]"
                      value={formData.birthHour}
                      onChange={e => setFormData({ ...formData, birthHour: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-white/40 ml-1">Giới tính</label>
                <div className="flex gap-3 flex-wrap">
                  {(['Nam', 'Nữ', 'LGBT+'] as Gender[]).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`flex-1 min-w-[80px] py-3 rounded-xl border transition-all relative overflow-hidden ${
                        formData.gender === g 
                          ? g === 'LGBT+' 
                            ? 'lgbt-gradient-border text-white' 
                            : 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                          : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {g === 'LGBT+' && formData.gender === g && (
                        <div className="absolute inset-0 animate-rainbow opacity-20 bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
                      )}
                      <span className="relative z-10">{g}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-brand-orange py-5 rounded-2xl text-black font-display font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl gold-glow"
            >
              Tiếp tục <ChevronRight className="w-5 h-5" />
            </button>
          </motion.form>
        ) : (
          <motion.form 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div className="glass-panel subtle-glow p-8 space-y-8">
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <Sparkles className="w-6 h-6 text-brand-orange" />
                <div>
                  <h2 className="text-xl font-display font-medium">Nhân tướng học AI</h2>
                  <p className="text-white/40 text-sm">Cung cấp đặc điểm diện mạo để AI phân tích sâu hơn</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-white/40">Vùng Trán</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-brand-orange/50"
                    value={formData.facialFeatures?.forehead}
                    onChange={e => setFormData({ ...formData, facialFeatures: { ...formData.facialFeatures!, forehead: e.target.value } })}
                  >
                    <option value="Cao, rộng">Cao, rộng (Thông minh, sáng tạo)</option>
                    <option value="Thấp, hẹp">Thấp, hẹp (Thực tế, kiên trì)</option>
                    <option value="Đầy đặn">Đầy đặn (Phúc hậu, may mắn)</option>
                    <option value="Phẳng">Phẳng (Ngay thẳng, bộc trực)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-white/40">Đôi Mắt</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-brand-gold/50"
                    value={formData.facialFeatures?.eyes}
                    onChange={e => setFormData({ ...formData, facialFeatures: { ...formData.facialFeatures!, eyes: e.target.value } })}
                  >
                    <option value="To, sáng">To, sáng (Năng động, nhạy bén)</option>
                    <option value="Sâu, sắc">Sâu, sắc (Sâu sắc, quyền lực)</option>
                    <option value="Hiền hòa">Hiền hòa (Thân thiện, bao dung)</option>
                    <option value="Híp, dài">Híp, dài (Thông minh, kín đáo)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-white/40">Khuôn Miệng</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-brand-gold/50"
                    value={formData.facialFeatures?.mouth}
                    onChange={e => setFormData({ ...formData, facialFeatures: { ...formData.facialFeatures!, mouth: e.target.value } })}
                  >
                    <option value="Cân đối">Cân đối (Hài hòa, khéo léo)</option>
                    <option value="Rộng, dày">Rộng, dày (Hào phóng, bản lĩnh)</option>
                    <option value="Nhỏ, mỏng">Nhỏ, mỏng (Tinh tế, cẩn trọng)</option>
                    <option value="Đều đặn">Đều đặn (Trung thực, đáng tin)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-white/5 border border-white/10 py-5 rounded-2xl text-white font-display uppercase tracking-widest hover:bg-white/10 transition-all subtle-glow"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="flex-[2] bg-brand-gold py-5 rounded-2xl text-black font-display font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl gold-glow"
              >
                Bắt đầu phân tích <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
