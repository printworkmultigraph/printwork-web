import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADER_IMAGES = [
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&q=80',
  'https://images.unsplash.com/photo-1585237017125-24baf8d7406f?w=200&q=80',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=80',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=80',
  'https://images.unsplash.com/photo-1606787503714-35a3e8ac63d1?w=200&q=80',
];

export default function LoadingScreen({ onComplete }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Cycle product images
    const imgTimer = setInterval(() => {
      setImgIndex(i => (i + 1) % LOADER_IMAGES.length);
    }, 350);

    // Complete after ~2s
    const completeTimer = setTimeout(() => {
      clearInterval(imgTimer);
      setDone(true);
      setTimeout(() => onComplete?.(), 900);
    }, 2000);

    return () => {
      clearInterval(imgTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: '#162d20' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Yucca arrow icon */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="6" fill="white" fillOpacity="0.12"/>
              <path d="M22 10L10 22M10 22H20M10 22V12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <div className="text-white text-xl font-jost font-semibold tracking-widest uppercase">Yucca</div>
              <div className="text-white/50 text-[10px] font-jost tracking-[0.25em] uppercase">Packaging</div>
            </div>
          </motion.div>

          {/* Cycling product image */}
          <div className="relative w-24 h-24 mb-8">
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIndex}
                src={LOADER_IMAGES[imgIndex]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -10 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
              />
            </AnimatePresence>
          </div>

          {/* Pulsing dot */}
          <motion.div
            className="w-2 h-1 rounded-full bg-white/40"
            animate={{ scaleX: [1, 2.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}