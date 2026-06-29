import React from 'react';
import { motion } from 'motion/react';

export function Logo({ className = "" }: { className?: string }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className={`logo-container relative ${className}`}>
      <motion.a 
        href="/" 
        title="Trang chủ Hey! Si Mì - Thần số học"
        className="relative block group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Color Bleeding Background Gradient (Loang màu dưới nền) */}
        <div 
          className="absolute inset-0 -m-4 bg-gradient-to-r from-brand-orange/30 via-pink-500/20 to-brand-gold/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none scale-75 group-hover:scale-110"
        />

        {/* Outer ambient soft shadow glow */}
        <div 
          className="absolute inset-0 bg-brand-orange/15 rounded-full blur-lg opacity-25 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
        />

        {/* Logo Image */}
        <img src="https://lh3.googleusercontent.com/d/10IfkZiqW1gDoEthE18YBjII2XgInD7rY" 
             alt="Hey! Si Mì Thần số học Logo" 
             width="260" 
             height="105" 
             loading="lazy"
             className="relative z-10 drop-shadow-[0_4px_12px_rgba(251,146,60,0.25)] transition-all duration-300"
             onError={(e) => {
               // Fallback if image fails
               (e.target as HTMLImageElement).style.display = 'none';
             }}
        />
      </motion.a>
    </div>
  );
}

