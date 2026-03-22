import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Wraps children in overflow:hidden and slides up on scroll into view.
 * Usage: <TextReveal delay={0.1}><h2>Your text</h2></TextReveal>
 */
export default function TextReveal({ children, className = '', delay = 0, once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px 0px' });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '108%', opacity: 0 }}
        animate={inView ? { y: '0%', opacity: 1 } : {}}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Splits text by words and reveals each with stagger
 */
export function WordReveal({ text, className = '', delay = 0, once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px 0px' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : {}}
            transition={{
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
              delay: delay + i * 0.06,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
