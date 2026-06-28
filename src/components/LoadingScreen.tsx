import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Sparkles } from 'lucide-react';

export function LoadingScreen() {
  const steps = [
    "Đang kết nối với bộ não AI...",
    "Đang phân tích tần số rung động của các con số...",
    "Đang quét biểu đồ nhân tướng học...",
    "Đang đối chiếu dữ liệu Pythagoras...",
    "Đang khởi tạo vận trình tương lai..."
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-brand-black flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-64 h-64 flex items-center justify-center"
      >
        <div className="absolute inset-0 border-2 border-brand-orange/20 rounded-full animate-pulse" />
        <div className="absolute inset-4 border border-brand-orange/40 rounded-full animate-spin-slow" />
        <div className="scan-line" />
        
        <div className="relative z-10 flex flex-col items-center">
          <Cpu className="w-16 h-16 text-brand-orange mb-4 animate-pulse" />
          <div className="text-brand-orange font-display text-sm tracking-widest uppercase">AI Scanning</div>
        </div>
      </motion.div>

      <div className="mt-12 h-8 flex items-center">
        <motion.p 
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-white font-light flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-brand-orange" />
          {steps[currentStep]}
        </motion.p>
      </div>

      <div className="absolute bottom-12 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, ease: "linear" }}
          className="h-full bg-brand-orange shadow-[0_0_10px_#fb923c]"
        />
      </div>
    </div>
  );
}
