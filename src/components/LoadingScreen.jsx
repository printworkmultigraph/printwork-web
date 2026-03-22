import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADER_IMAGES = [
  '/images/lunch box eco-kraft 1.jpeg',
  '/images/food pail eco-kraft.jpeg',
  '/images/dus fried chicken eco-kraft 275 gr.jpeg',
  '/images/standing pouch paper metalized.jpeg',
  '/images/food tray eco kraft.jpeg',
];

export default function LoadingScreen({ onComplete }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const imgTimer = setInterval(() => {
      setImgIndex(i => (i + 1) % LOADER_IMAGES.length);
    }, 200);

    const doneTimer = setTimeout(() => {
      clearInterval(imgTimer);
      setExiting(true);
      setTimeout(() => onComplete?.(), 550);
    }, 1600);

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
          style={{ backgroundColor: '#0D1B3E' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <img 
              src="/images/new_logo.png" 
              alt="Printwork Logo" 
              className="h-12 w-auto object-contain brightness-0 invert"
            />
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

          {/* Pulsing oval dot */}
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
        <motion.div
          key="curtain-exit"
          className="fixed inset-0 z-[9999]"
          style={{ backgroundColor: '#0D1B3E', transformOrigin: 'top' }}
          initial={{ y: 0 }}
          animate={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
