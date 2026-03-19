import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Wraps text in an overflow-hidden container and slides it up on scroll.
 * Usage: <TextReveal as="h2" delay={0.1}>Your text</TextReveal>
 */
export default function TextReveal({ children, as: Tag = 'div', className = '', delay = 0, once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px 0px' });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '105%', opacity: 0 }}
        animate={inView ? { y: '0%', opacity: 1 } : {}}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay }}
      >
        <Tag>{children}</Tag>
      </motion.div>
    </div>
  );
}

/**
 * Splits text by words and reveals each word with stagger
 */
export function WordReveal({ text, className = '', delay = 0, once = true, tag: Tag = 'span' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px 0px' });
  const words = text.split(' ');

  return (
    <Tag ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}>
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            style={{ display: 'inline-block' }}
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
    </Tag>
  );
}