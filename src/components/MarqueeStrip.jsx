import { motion } from 'framer-motion';

export default function MarqueeStrip({ items, dark = false, speed = 35 }) {
  // Duplicate enough to fill
  const repeated = [...items, ...items, ...items, ...items, ...items];

  return (
    <div className={`overflow-hidden py-4 ${dark ? 'bg-navy-900' : 'bg-secondary'}`}>
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        style={{ width: 'max-content' }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className={`mx-8 text-xs font-jost font-medium tracking-[0.18em] uppercase ${
              dark ? 'text-white/50' : 'text-navy-400'
            }`}
          >
            {item}
            <span className={`ml-8 text-[8px] ${dark ? 'text-white/20' : 'text-navy-200'}`}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}