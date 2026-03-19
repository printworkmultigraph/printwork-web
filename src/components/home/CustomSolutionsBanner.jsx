import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const words = ['Brands', 'that', 'thrive', 'invest', 'in', 'custom-designed', 'packaging.'];

export default function CustomSolutionsBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-16 px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          className="relative bg-navy-900 rounded-[2rem] overflow-hidden px-10 py-16 md:px-16 md:py-20 lg:px-24"
          initial={{ opacity: 0, y: 60, borderRadius: '3rem' }}
          animate={inView ? { opacity: 1, y: 0, borderRadius: '2rem' } : {}}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Ambient circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/[0.03]" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/[0.04]" />

          <div className="relative z-10">
            <motion.p
              className="text-[10px] font-jost text-white/30 tracking-[0.3em] uppercase mb-8"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              Custom Solutions
            </motion.p>

            {/* Word-by-word reveal */}
            <div className="mb-10 flex flex-wrap gap-x-[0.35em] gap-y-1">
              {words.map((word, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <motion.span
                    className="block font-display text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-tight"
                    initial={{ y: '110%' }}
                    animate={inView ? { y: '0%' } : {}}
                    transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.2 + i * 0.07 }}
                  >
                    {word === 'custom-designed' ? <em className="font-light text-white/60">{word}</em> : word}
                  </motion.span>
                </div>
              ))}
            </div>

            <motion.div
              className="flex flex-col sm:flex-row sm:items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.75 }}
            >
              <Link
                to="/Contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 text-sm font-jost font-semibold rounded-full hover:bg-white/90 transition-colors group"
              >
                Enquire now
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <span className="text-sm font-jost text-white/40">Not sure what's possible? Get in touch.</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}