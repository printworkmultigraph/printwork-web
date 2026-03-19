import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.76, 0, 0.24, 1];

/**
 * Splits text into lines and reveals each from overflow:hidden container.
 * Exactly like Yucca's GSAP split-text effect.
 */
export function SplitLines({ lines, className = '', lineClassName = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  const arr = Array.isArray(lines) ? lines : [lines];

  return (
    <div ref={ref} className={className}>
      {arr.map((line, i) => (
        <span key={i} style={{ display: 'block', overflow: 'hidden' }}>
          <motion.span
            style={{ display: 'block' }}
            initial={{ y: '110%' }}
            animate={inView ? { y: '0%' } : {}}
            transition={{ duration: 0.85, ease: EASE, delay: delay + i * 0.1 }}
            className={lineClassName}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

/**
 * Single line reveal
 */
export function LineReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });

  return (
    <div ref={ref} style={{ overflow: 'hidden', display: 'block' }} className={className}>
      <motion.span
        style={{ display: 'block' }}
        initial={{ y: '110%' }}
        animate={inView ? { y: '0%' } : {}}
        transition={{ duration: 0.85, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </div>
  );
}

/**
 * Hero line reveal (fires on mount, no scroll trigger)
 */
export function HeroLine({ children, delay = 0, className = '' }) {
  return (
    <div style={{ overflow: 'hidden', display: 'block' }} className={className}>
      <motion.span
        style={{ display: 'block' }}
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.95, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </div>
  );
}

/**
 * Fade + slide up for body text / small elements
 */
export function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}