import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Cycling packaging product images (tight crop, transparent bg style)
const LOADER_IMAGES = [
  'https://images.unsplash.com/photo-1585237017125-24baf8d7406f?w=300&q=90&fit=crop',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=90&fit=crop',
  'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=300&q=90&fit=crop',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&q=90&fit=crop',
  'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=300&q=90&fit=crop',
];

export default function LoadingScreen({ onComplete }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Fast cycle through images
    const imgTimer = setInterval(() => {
      setImgIndex(i => (i + 1) % LOADER_IMAGES.length);
    }, 300);

    // Start exit after images have cycled
    const doneTimer = setTimeout(() => {
      clearInterval(imgTimer);
      setExiting(true);
      setTimeout(() => onComplete?.(), 850);
    }, 2200);

    return () => {
      clearInterval(imgTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: '#152b1e' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 26L26 6M26 6H10M26 6V22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <div className="text-white text-lg font-jost font-bold tracking-[0.25em] uppercase leading-none">Yucca</div>
              <div className="text-white/40 text-[9px] font-jost tracking-[0.3em] uppercase mt-0.5">Packaging</div>
            </div>
          </motion.div>

          {/* Cycling product image */}
          <div className="relative w-28 h-28 mb-10">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={imgIndex}
                src={LOADER_IMAGES[imgIndex]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                initial={{ opacity: 0, scale: 0.8, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.15, y: -16 }}
                transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
              />
            </AnimatePresence>
          </div>

          {/* Pulsing oval dot — exactly like Yucca */}
          <motion.div
            style={{
              width: 28,
              height: 10,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.35)',
            }}
            animate={{
              scaleX: [1, 0.4, 1],
              scaleY: [1, 1.4, 1],
              opacity: [0.35, 0.9, 0.35],
            }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      ) : (
        /* Green curtain slides UP to reveal page */
        <motion.div
          key="curtain-exit"
          className="fixed inset-0 z-[9999]"
          style={{ backgroundColor: '#152b1e', transformOrigin: 'top' }}
          initial={{ y: 0 }}
          animate={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  );
}