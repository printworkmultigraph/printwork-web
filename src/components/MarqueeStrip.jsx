import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function MarqueeStrip({ items, dark = false, speed = 40 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  // Duplicate enough to fill any screen width
  const repeated = [...items, ...items, ...items, ...items, ...items, ...items];

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden py-5 border-y ${dark ? 'bg-navy-900 border-white/10' : 'bg-secondary border-navy-100'}`}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        style={{ width: 'max-content' }}
      >
        {repeated.map((item, i) => (
          <span key={i} className={`mx-8 flex items-center gap-8 text-[10px] font-jost font-medium tracking-[0.2em] uppercase ${dark ? 'text-white/40' : 'text-navy-300'}`}>
            {item}
            <span className={`text-[6px] ${dark ? 'text-white/15' : 'text-navy-200'}`}>✦</span>
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
