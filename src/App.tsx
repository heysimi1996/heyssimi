import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserInput, AnalysisResult as AnalysisResultType, CompatibilityResult as CompatibilityResultType } from './types';
import { InputForm } from './components/InputForm';
import { LoadingScreen } from './components/LoadingScreen';
import { AnalysisResult } from './components/AnalysisResult';
import { CompatibilityForm } from './components/CompatibilityForm';
import { CompatibilityResult } from './components/CompatibilityResult';
import { 
  calculateLifePath, 
  calculateNameNumbers, 
  generateBirthChart, 
  analyzeArrows, 
  calculatePersonalYear, 
  calculatePyramids,
  calculateElement,
  reduceNumber
} from './lib/numerology';
import { interpretNumerology, interpretCompatibility } from './lib/gemini';
import { User, Users, Heart, Sun, Moon } from 'lucide-react';
import { Logo } from './components/Logo';
import { triggerVibration } from './lib/vibration';

export default function App() {
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<'single' | 'compatibility'>('single');
  const [result, setResult] = React.useState<AnalysisResultType | null>(null);
  const [compResult, setCompResult] = React.useState<CompatibilityResultType | null>(null);
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  React.useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const calculateFullNumerology = (input: UserInput) => {
    const lp = calculateLifePath(input.birthDate);
    const { destiny, soulUrge, innerSelf } = calculateNameNumbers(input.fullName);
    const birthChart = generateBirthChart(input.birthDate);
    const arrows = analyzeArrows(birthChart);
    const personalYear = calculatePersonalYear(input.birthDate);
    const pyramids = calculatePyramids(input.birthDate);
    const elementData = calculateElement(input.birthDate);

    return {
      lifePath: lp,
      destiny,
      soulUrge,
      innerSelf,
      maturity: reduceNumber(lp + destiny, true),
      birthChart,
      arrows,
      personalYear,
      pyramids,
      elementData
    };
  };

  const startAnalysis = async (input: UserInput) => {
    if (!input.birthDate || !input.fullName) return;
    setLoading(true);

    try {
      const numerologyData = calculateFullNumerology(input);
      const aiResultPromise = interpretNumerology(input, numerologyData);
      const delayPromise = new Promise(resolve => setTimeout(resolve, 8000));

      const [aiResult] = await Promise.all([aiResultPromise, delayPromise]);

      setResult({
        input,
        numerology: numerologyData,
        aiInterpretation: aiResult
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startCompatibilityAnalysis = async (p1: UserInput, p2: UserInput) => {
    setLoading(true);
    try {
      const d1 = calculateFullNumerology(p1);
      const d2 = calculateFullNumerology(p2);
      
      const aiResultPromise = interpretCompatibility(p1, d1, p2, d2);
      const delayPromise = new Promise(resolve => setTimeout(resolve, 8000));

      const [aiResult] = await Promise.all([aiResultPromise, delayPromise]);

      setCompResult({
        score: aiResult.score,
        person1: p1,
        person2: p2,
        person1Data: d1,
        person2Data: d2,
        aiInterpretation: aiResult
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCompResult(null);
    setLoading(false);
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-brand-orange/30 selection:text-brand-orange transition-colors duration-300 ${theme === 'dark' ? 'bg-brand-black text-white dark-theme' : 'bg-[#fafafa] text-slate-800 light-theme'}`}>
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-50">
        <button
          onClick={() => {
            triggerVibration(30);
            setTheme(theme === 'dark' ? 'light' : 'dark');
          }}
          className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all subtle-glow cursor-pointer flex items-center justify-center shadow-lg hover:scale-110 active:scale-95"
          title={theme === 'dark' ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-brand-orange" />
          ) : (
            <Moon className="w-5 h-5 text-brand-orange" />
          )}
        </button>
      </div>

      {loading && <LoadingScreen />}
      
      {!loading && !result && !compResult && (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          
          {/* Header Navigation */}
          <header className="relative z-20 pt-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
              <div className="flex flex-col items-center">
                <Logo className="scale-75 md:scale-90" />
                <div className="w-12 h-0.5 bg-brand-orange/30 mt-4 rounded-full" />
              </div>

              <nav className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 subtle-glow">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    triggerVibration(30);
                    setMode('single');
                  }}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all ${mode === 'single' ? 'bg-brand-orange text-black gold-glow' : 'text-white/60 hover:bg-white/5'}`}
                >
                  <User className="w-4 h-4" /> Cá Nhân
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    triggerVibration(30);
                    setMode('compatibility');
                  }}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all ${mode === 'compatibility' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-white/60 hover:bg-white/5'}`}
                >
                  <Heart className="w-4 h-4" /> Hợp Tuổi
                </motion.button>
              </nav>
            </div>
          </header>

          <main className="flex-1 flex flex-col justify-center py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                {mode === 'single' ? (
                  <InputForm onStart={startAnalysis} />
                ) : (
                  <CompatibilityForm onAnalyze={startCompatibilityAnalysis} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
          
          <footer className="py-8 text-center border-t border-white/5 bg-brand-black/50 backdrop-blur-sm relative z-10">
            <p className="text-white/20 text-xs tracking-widest uppercase">AI Thần Số Học © 2026 • Powered by AI Deep Numerology</p>
          </footer>
        </div>
      )}

      {!loading && result && (
        <AnalysisResult result={result} onReset={handleReset} />
      )}

      {!loading && compResult && (
        <CompatibilityResult result={compResult} onReset={handleReset} />
      )}
    </div>
  );
}
