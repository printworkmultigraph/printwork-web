import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { HeroLine, FadeUp } from '../SplitText';

const EASE = [0.76, 0, 0.24, 1];

export default function CustomSolutionsBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  // Each word on its own line for the split effect
  const words = ['Brands that thrive invest in', 'custom-designed packaging.', "Let us help bring your vision to life."];

  return (
    <section ref={ref} className="py-16 px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Card with clip-path reveal */}
        <motion.div
          className="relative bg-navy-900 overflow-hidden"
          style={{ borderRadius: 40, clipPath: 'inset(100% 0 0 0 round 40px)' }}
          animate={inView ? { clipPath: 'inset(0% 0 0 0 round 40px)' } : {}}
          transition={{ duration: 1.0, ease: EASE }}
        >
          {/* Ambient */}
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/[0.03]" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/[0.04]" />

          <div className="relative z-10 px-10 py-16 md:px-20 md:py-24">
            <motion.p
              className="text-[10px] font-jost text-white/25 tracking-[0.3em] uppercase mb-8"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              Custom Solutions
            </motion.p>

            {/* Split-line headline */}
            <div className="mb-10 max-w-3xl">
              {words.map((line, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <motion.div
                    className={`font-display font-medium text-white leading-tight ${
                      i === 2
                        ? 'text-lg md:text-xl font-light text-white/50 mt-4'
                        : 'text-3xl md:text-4xl lg:text-5xl'
                    } ${i === 1 ? 'italic font-light text-white/60' : ''}`}
                    initial={{ y: '110%' }}
                    animate={inView ? { y: '0%' } : {}}
                    transition={{ duration: 0.85, ease: EASE, delay: 0.3 + i * 0.12 }}
                  >
                    {line}
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.75, ease: EASE }}
            >
              <Link
                to="/Contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 text-sm font-jost font-semibold rounded-full hover:bg-white/90 transition-colors group"
              >
                Enquire now
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}