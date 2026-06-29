import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserInput, Gender } from '../types';
import { Calendar, User, Clock, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { triggerVibration } from '../lib/vibration';
import { FaceScanner } from './FaceScanner';

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
    triggerVibration(60);
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
                      onClick={() => {
                        triggerVibration(25);
                        setFormData({ ...formData, gender: g });
                      }}
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

            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                triggerVibration(40);
                nextStep();
              }}
              className="w-full bg-brand-orange py-5 rounded-2xl text-black font-display font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl gold-glow"
            >
              Tiếp tục <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.form>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <FaceScanner 
              onScanComplete={(features) => {
                const updatedData = { ...formData, facialFeatures: features };
                setFormData(updatedData);
                onStart(updatedData);
              }}
              onBack={prevStep}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
