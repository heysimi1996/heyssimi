import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';
import { triggerVibration } from '../lib/vibration';

interface AudioNarratorProps {
  text: string;
  title?: string;
  className?: string;
}

// Global active controller to ensure only one narrator speaks at a time
let globalCurrentUtterance: SpeechSynthesisUtterance | null = null;
let globalActiveStopFn: (() => void) | null = null;

export function AudioNarrator({ text, title = "Nghe sư thầy luận giải", className = "" }: AudioNarratorProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(false);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Safe cleaner function to strip markdown tags (like **, #, -, etc.) before reading
  const cleanTextForReading = (rawText: string): string => {
    return rawText
      .replace(/[#*`_~-]/g, ' ') // Strip markdown special characters
      .replace(/\[.*?\]\(.*?\)/g, ' ') // Strip links
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  };

  const stopSpeaking = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    if (globalActiveStopFn === stopSpeaking) {
      globalActiveStopFn = null;
      globalCurrentUtterance = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      // Clean up when component unmounts
      if (isPlaying) {
        stopSpeaking();
      }
    };
  }, [isPlaying, stopSpeaking]);

  const handleTogglePlay = () => {
    if (!speechSupported) return;

    triggerVibration(40);

    if (isPlaying) {
      stopSpeaking();
      return;
    }

    // Stop any other active narration
    if (globalActiveStopFn) {
      globalActiveStopFn();
    }

    try {
      window.speechSynthesis.cancel(); // Reset any hung synthesis states

      const cleanedText = cleanTextForReading(text);
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = 'vi-VN';
      
      // Try to find native vi-VN voice
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(v => v.lang.toLowerCase().includes('vi'));
      if (viVoice) {
        utterance.voice = viVoice;
      }

      // "Sư thầy phán" characteristics:
      // - Rate: ~0.8 (slower, extremely majestic and authoritative, no rushed speech)
      // - Pitch: ~0.85 (deep, warm, spiritual and calm)
      utterance.rate = 0.82;
      utterance.pitch = 0.85;

      utterance.onstart = () => {
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        if (globalCurrentUtterance === utterance) {
          globalCurrentUtterance = null;
          globalActiveStopFn = null;
        }
      };

      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setIsPlaying(false);
        if (globalCurrentUtterance === utterance) {
          globalCurrentUtterance = null;
          globalActiveStopFn = null;
        }
      };

      utteranceRef.current = utterance;
      globalCurrentUtterance = utterance;
      globalActiveStopFn = stopSpeaking;

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Failed to start speech synthesis:", error);
      setIsPlaying(false);
    }
  };

  if (!speechSupported) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleTogglePlay}
        className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
          isPlaying 
            ? 'bg-brand-orange/20 border-brand-orange text-brand-orange shadow-lg shadow-brand-orange/15' 
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

        <span className="text-xs font-display font-medium tracking-wide uppercase">
          {isPlaying ? "Dừng nghe sư thầy" : title}
        </span>

        {/* Audio Equalizer Waveform animation */}
        {isPlaying && (
          <div className="flex items-end gap-[2px] h-3.5 px-1">
            <motion.div 
              animate={{ height: [4, 12, 4] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
              className="w-[2.5px] bg-brand-orange rounded-full"
            />
            <motion.div 
              animate={{ height: [6, 15, 6] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.15 }}
              className="w-[2.5px] bg-brand-orange rounded-full"
            />
            <motion.div 
              animate={{ height: [3, 10, 3] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut", delay: 0.3 }}
              className="w-[2.5px] bg-brand-orange rounded-full"
            />
            <motion.div 
              animate={{ height: [5, 13, 5] }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut", delay: 0.05 }}
              className="w-[2.5px] bg-brand-orange rounded-full"
            />
          </div>
        )}
      </motion.button>

      {isPlaying && (
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 border border-brand-orange/15 rounded-lg text-[10px] text-brand-orange uppercase tracking-widest font-mono animate-pulse">
          <Radio className="w-3 h-3 animate-spin" /> Sư thầy đang phán...
        </span>
      )}
    </div>
  );
}
