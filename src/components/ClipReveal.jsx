import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Reveals content with a clip-path wipe from bottom (like Yucca's image/card reveals).
 * clip-path: inset(100% 0 0 0) → inset(0% 0 0 0)
 */
export default function ClipReveal({ children, delay = 0, className = '', direction = 'bottom' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  const initialClip = {
    bottom: 'inset(100% 0 0 0)',
    top: 'inset(0 0 100% 0)',
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
  }[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ clipPath: initialClip }}
      animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)' } : {}}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Image reveal — parent clips, inner image scales from 110% down to 100%
 */
export function ImageReveal({ src, alt, className = '', delay = 0, aspect = 'aspect-square' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${aspect} ${className}`}
    >
      <motion.div
        className="w-full h-full"
        style={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={inView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
        transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          style={{ scale: 1.12 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay }}
        />
      </motion.div>
    </div>
  );
}
