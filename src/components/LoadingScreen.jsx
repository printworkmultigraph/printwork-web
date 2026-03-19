import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase('exit'), 300);
          setTimeout(() => onComplete?.(), 1200);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-navy-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            if (phase === 'exit') setPhase('done');
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-12"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.div
                  className="w-12 h-12 border-2 border-white/80 rounded-lg flex items-center justify-center"
                  animate={{ rotate: [0, 90, 180, 270, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-sm"
                    animate={{ scale: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </div>
              <div>
                <h1 className="text-white text-2xl font-inter font-bold tracking-tight">YUCCA</h1>
                <p className="text-white/50 text-xs font-inter tracking-[0.3em] uppercase">Packaging</p>
              </div>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/70 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Floating product silhouettes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-16 h-16 border border-white/5 rounded-lg"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: typeof window !== 'undefined' ? window.innerHeight + 100 : 900,
                  rotate: Math.random() * 360,
                  opacity: 0,
                }}
                animate={{
                  y: -100,
                  rotate: Math.random() * 720,
                  opacity: [0, 0.15, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: 'linear',
                }}
              />
            ))}
          </div>

          {/* Loading text */}
          <motion.p
            className="text-white/30 text-xs font-inter tracking-widest mt-8 uppercase"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading experience
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}