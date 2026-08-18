import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Radio, Sparkles, Sliders, ChevronDown, Zap, Gauge } from 'lucide-react';
import { triggerVibration } from '../lib/vibration';

interface AudioNarratorProps {
  text: string;
  title?: string;
  className?: string;
}

const STORAGE_STYLE_KEY = 'heysimi_narrator_style';
const STORAGE_VOICE_KEY = 'heysimi_narrator_voice';
const STORAGE_SPEED_KEY = 'heysimi_narrator_speed';

// Global playback reference to ensure only one narrator speaks at any time
interface GlobalPlaybackState {
  stop: () => void;
}
let globalPlayback: GlobalPlaybackState | null = null;

// Helper to get initial states safely
const getInitialStyle = (): 'meditative' | 'expressive' | 'clear' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_STYLE_KEY);
    if (saved === 'meditative' || saved === 'expressive' || saved === 'clear') {
      return saved;
    }
  }
  return 'expressive';
};

const getInitialVoice = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_VOICE_KEY) || '';
  }
  return '';
};

const getInitialSpeed = (): number => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_SPEED_KEY);
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= 0.8 && parsed <= 2.0) {
        return parsed;
      }
    }
  }
  return 1.2; // Default to brisk, engaging 1.2x speed
};

const SPEED_OPTIONS = [
  { value: 0.9, label: '0.9x', desc: 'Chậm rãi' },
  { value: 1.0, label: '1.0x', desc: 'Tiêu chuẩn' },
  { value: 1.2, label: '1.2x', desc: 'Nhanh vừa' },
  { value: 1.4, label: '1.4x', desc: 'Nhanh' },
  { value: 1.6, label: '1.6x', desc: 'Rất nhanh' },
];

export function AudioNarrator({ text, title = "Nghe sư thầy luận giải", className = "" }: AudioNarratorProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(false);
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = React.useState<string>(getInitialVoice);
  const [styleMode, setStyleMode] = React.useState<'meditative' | 'expressive' | 'clear'>(getInitialStyle);
  const [speedMultiplier, setSpeedMultiplier] = React.useState<number>(getInitialSpeed);
  const [showSettings, setShowSettings] = React.useState(false);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = React.useRef(false);

  // Initialize and load SpeechSynthesis voices
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);

      const loadVoices = () => {
        const allVoices = window.speechSynthesis.getVoices();
        // Filter Vietnamese voices
        const vi = allVoices.filter(v => v.lang.toLowerCase().includes('vi'));
        setVoices(vi);
        
        // Auto-select preferred voice if none selected or if preferred is not in current list
        if (vi.length > 0) {
          const savedVoice = localStorage.getItem(STORAGE_VOICE_KEY);
          const voiceExists = vi.some(v => v.name === savedVoice);
          
          if (!savedVoice || !voiceExists) {
            // Find highest quality voice (Online, Natural, Google, specific names)
            const bestVoice = vi.find(v => 
              v.name.toLowerCase().includes('natural') || 
              v.name.toLowerCase().includes('online') || 
              v.name.toLowerCase().includes('google') ||
              v.name.toLowerCase().includes('hoaimy') ||
              v.name.toLowerCase().includes('namminh') ||
              v.name.toLowerCase().includes('linh')
            ) || vi[0];
            setSelectedVoiceName(bestVoice.name);
            localStorage.setItem(STORAGE_VOICE_KEY, bestVoice.name);
          }
        }
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Pre-process raw text into highly readable sentences, inserting punctuation to create natural pauses
  const cleanTextForReading = (rawText: string): string => {
    if (!rawText) return '';
    
    // First, process newlines to make sure they end with a natural punctuation if they don't already
    const textWithPauses = rawText
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        // If line doesn't end with a punctuation, append a period so it pauses naturally
        if (/[a-zA-Z0-9ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]$/.test(trimmed)) {
          return trimmed + '.';
        }
        return trimmed;
      })
      .filter(line => line.length > 0)
      .join(' | '); // Custom separator to mark layout blocks

    return textWithPauses
      // Remove markdown formatting
      .replace(/\*\*|__/g, '')
      .replace(/\*|_/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/^\s*#{1,6}\s+/gm, '')
      // Translate symbols to clean Vietnamese spoken words
      .replace(/&/g, ' và ')
      .replace(/\+/g, ' cộng ')
      .replace(/[~`@#$^*{}[\]<>\\\-_]/g, ' ')
      // Normalize spaces
      .replace(/\s+/g, ' ')
      .trim();
  };

  const stopSpeaking = React.useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    if (globalPlayback?.stop === stopSpeaking) {
      globalPlayback = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (isPlayingRef.current) {
        stopSpeaking();
      }
    };
  }, [stopSpeaking]);

  const handleStyleChange = (mode: 'meditative' | 'expressive' | 'clear') => {
    setStyleMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_STYLE_KEY, mode);
    }
    triggerVibration(30);
    
    // If currently speaking, restart speaking with the new style settings
    if (isPlayingRef.current) {
      setTimeout(() => {
        startSpeaking(mode, selectedVoiceName, speedMultiplier);
      }, 100);
    }
  };

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoiceName(voiceName);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_VOICE_KEY, voiceName);
    }
    triggerVibration(30);

    // If currently speaking, restart with the new voice
    if (isPlayingRef.current) {
      setTimeout(() => {
        startSpeaking(styleMode, voiceName, speedMultiplier);
      }, 100);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeedMultiplier(newSpeed);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_SPEED_KEY, newSpeed.toString());
    }
    triggerVibration(30);

    // If currently speaking, restart with the new speed
    if (isPlayingRef.current) {
      setTimeout(() => {
        startSpeaking(styleMode, selectedVoiceName, newSpeed);
      }, 100);
    }
  };

  const cycleSpeed = () => {
    const currentIndex = SPEED_OPTIONS.findIndex(opt => opt.value === speedMultiplier);
    const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
    const nextSpeed = SPEED_OPTIONS[nextIndex].value;
    handleSpeedChange(nextSpeed);
  };

  const startSpeaking = (
    currentStyle = styleMode, 
    currentVoiceName = selectedVoiceName,
    currentSpeed = speedMultiplier
  ) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Halt any active narration
    if (globalPlayback) {
      globalPlayback.stop();
    }

    try {
      window.speechSynthesis.cancel();

      // Clean and preprocess text
      const cleanedText = cleanTextForReading(text);
      
      // Split text into rhythmic phrases at periods, question/exclamation marks, colons, semicolons, and layout borders
      const rawSentences = cleanedText
        .replace(/([.!?|:;])\s*/g, '$1|') 
        .split('|')
        .map(s => s.trim())
        .filter(s => s.length > 1);

      // Group short consecutive sentences (< 25 characters) to create a fast, continuous, unbroken flow
      const sentences: string[] = [];
      let temp = '';
      for (const seg of rawSentences) {
        if (!temp) {
          temp = seg;
        } else if (temp.length + seg.length < 50) {
          temp += ' ' + seg;
        } else {
          sentences.push(temp);
          temp = seg;
        }
      }
      if (temp) {
        sentences.push(temp);
      }

      if (sentences.length === 0) return;

      isPlayingRef.current = true;
      setIsPlaying(true);
      globalPlayback = { stop: stopSpeaking };

      let currentIdx = 0;

      // Base rhythm configuration optimized for faster, more dynamic and natural Vietnamese speech
      let baseRate = 1.1;
      let pitch = 1.0;
      let sentencePause = 180; // Milliseconds pause between phrases

      if (currentStyle === 'meditative') {
        baseRate = 0.95;
        pitch = 0.88;
        sentencePause = 280; // Gentle, rhythmic pause
      } else if (currentStyle === 'clear') {
        baseRate = 1.2;
        pitch = 1.02;
        sentencePause = 120; // Snappy, swift pace
      }

      // Calculate effective speech rate clamped to valid browser bounds (0.5 - 2.0)
      const effectiveRate = Math.min(2.0, Math.max(0.5, Number((baseRate * (currentSpeed / 1.0)).toFixed(2))));
      const effectivePause = Math.max(80, Math.round(sentencePause / currentSpeed));

      const speakSentence = () => {
        if (!isPlayingRef.current) return;

        if (currentIdx >= sentences.length) {
          stopSpeaking();
          return;
        }

        const sentenceText = sentences[currentIdx];
        const utterance = new SpeechSynthesisUtterance(sentenceText);
        utterance.lang = 'vi-VN';

        // Bind selected voice
        if (currentVoiceName) {
          const foundVoice = voices.find(v => v.name === currentVoiceName);
          if (foundVoice) {
            utterance.voice = foundVoice;
          }
        } else {
          // Fallback to any Vietnamese voice
          const fallbackVoice = voices.find(v => v.lang.toLowerCase().includes('vi'));
          if (fallbackVoice) {
            utterance.voice = fallbackVoice;
          }
        }

        utterance.rate = effectiveRate;
        utterance.pitch = pitch;

        utterance.onend = () => {
          if (!isPlayingRef.current) return;
          currentIdx++;
          // Fast, natural rhythm delay before reading the next clause
          timeoutRef.current = setTimeout(speakSentence, effectivePause);
        };

        utterance.onerror = (e) => {
          console.warn("Sentence speaking skipped on error:", e);
          if (!isPlayingRef.current) return;
          currentIdx++;
          timeoutRef.current = setTimeout(speakSentence, 120);
        };

        window.speechSynthesis.speak(utterance);
      };

      // Begin sequence
      speakSentence();

    } catch (err) {
      console.error("Failed to start speech synthesis stream:", err);
      setIsPlaying(false);
    }
  };

  const handleTogglePlay = () => {
    if (!speechSupported) return;
    triggerVibration(40);

    if (isPlaying) {
      stopSpeaking();
    } else {
      startSpeaking();
    }
  };

  if (!speechSupported) return null;

  return (
    <div className={`relative flex flex-col items-start gap-2 ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTogglePlay}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer text-xs font-display font-medium uppercase tracking-wide ${
            isPlaying 
              ? 'bg-brand-orange/20 border-brand-orange text-brand-orange shadow-lg shadow-brand-orange/15 font-semibold' 
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
          }`}
        >
          <div className="relative flex items-center justify-center">
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4 relative z-10 text-brand-orange animate-pulse" />
                <span className="absolute -inset-1 bg-brand-orange/30 rounded-full animate-ping pointer-events-none" />
              </>
            ) : (
              <Volume2 className="w-4 h-4 text-brand-gold" />
            )}
          </div>

          <span>
            {isPlaying ? "Dừng nghe sư thầy" : title}
          </span>

          {/* Audio Equalizer animation */}
          {isPlaying && (
            <div className="flex items-end gap-[2px] h-3 px-1">
              <motion.div 
                animate={{ height: [4, 11, 4] }}
                transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}
                className="w-[2px] bg-brand-orange rounded-full"
              />
              <motion.div 
                animate={{ height: [6, 14, 6] }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut", delay: 0.1 }}
                className="w-[2px] bg-brand-orange rounded-full"
              />
              <motion.div 
                animate={{ height: [3, 9, 3] }}
                transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut", delay: 0.2 }}
                className="w-[2px] bg-brand-orange rounded-full"
              />
            </div>
          )}
        </motion.button>

        {/* Quick Speed Switcher Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={cycleSpeed}
          className="flex items-center gap-1 px-2.5 py-2.5 rounded-xl border border-brand-gold/20 bg-brand-gold/5 hover:bg-brand-gold/15 text-brand-gold font-mono font-bold text-xs transition-all cursor-pointer shadow-sm"
          title={`Tốc độ đọc hiện tại: ${speedMultiplier}x (Nhấn để chuyển tốc độ)`}
        >
          <Zap className="w-3 h-3 text-brand-orange" />
          <span>{speedMultiplier}x</span>
        </motion.button>

        {/* Custom Settings button to fine-tune voice, pitch, style */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowSettings(!showSettings);
            triggerVibration(30);
          }}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            showSettings 
              ? 'bg-brand-gold/20 border-brand-gold text-brand-gold' 
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/50 hover:text-white'
          }`}
          title="Tùy chỉnh giọng đọc và tốc độ"
        >
          <Sliders className="w-3.5 h-3.5" />
        </motion.button>

        {isPlaying && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-orange/10 border border-brand-orange/15 rounded-lg text-[9px] text-brand-orange uppercase tracking-widest font-mono animate-pulse">
            <Radio className="w-3 h-3 animate-spin" /> Sư thầy đang phán ({speedMultiplier}x)...
          </span>
        )}
      </div>

      {/* Settings Overlay Dropdown */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 top-full mt-2 z-50 w-80 p-4 rounded-2xl bg-brand-black/95 border border-brand-gold/20 backdrop-blur-md shadow-2xl space-y-4 text-left"
          >
            {/* Speed Control Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-brand-gold/80 font-display font-bold flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Tốc độ đọc giọng AI</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded border border-brand-orange/20">
                  {speedMultiplier}x
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {SPEED_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSpeedChange(opt.value)}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer text-center ${
                      speedMultiplier === opt.value
                        ? 'bg-brand-orange text-black border-brand-orange shadow-md shadow-brand-orange/30'
                        : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selector */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-brand-gold/70 font-display font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-orange" />
                <span>Phong cách nhịp điệu</span>
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'meditative', label: 'Trầm Ấm' },
                  { id: 'expressive', label: 'Truyền Cảm' },
                  { id: 'clear', label: 'Minh Triết' }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => handleStyleChange(style.id as any)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-display font-medium border transition-all cursor-pointer ${
                      styleMode === style.id
                        ? 'bg-brand-orange/20 border-brand-orange text-brand-orange font-semibold'
                        : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Selector */}
            {voices.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-brand-gold/70 font-display font-bold">
                  Giọng đọc thiết bị
                </span>
                <div className="relative">
                  <select
                    value={selectedVoiceName}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                    className="w-full text-[11px] bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 outline-none focus:border-brand-orange cursor-pointer appearance-none pr-8 font-sans"
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name} className="bg-brand-black text-white py-1">
                        {v.name.replace('Microsoft', '').replace('Google', '').trim()} ({v.localService ? 'Ngoại tuyến' : 'Trực tuyến'})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
                </div>
              </div>
            )}

            <div className="text-[9.5px] text-white/40 leading-relaxed pt-2 border-t border-white/5 flex flex-col gap-1">
              <span>⚡ Tối ưu tốc độ: Tự động ghép nối câu mượt mà, giảm khoảng lặng thừa để đọc nhanh và cuốn hút.</span>
              <span>💾 Lưu cấu hình: Cài đặt tốc độ ({speedMultiplier}x) được tự động lưu cho các lần nghe sau.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


