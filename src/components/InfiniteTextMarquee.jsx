import { motion } from 'framer-motion';

export default function InfiniteTextMarquee({ text, speed = 20, className = "" }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap flex ${className}`}>
      <motion.div
        className="flex"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: "linear",
        }}
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-4 text-8xl md:text-9xl font-display font-medium text-navy-900/5 uppercase">
            {text} — 
          </span>
        ))}
      </motion.div>
      <motion.div
        className="flex"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: "linear",
        }}
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-4 text-8xl md:text-9xl font-display font-medium text-navy-900/5 uppercase">
            {text} — 
          </span>
        ))}
      </motion.div>
    </div>
  );
}
