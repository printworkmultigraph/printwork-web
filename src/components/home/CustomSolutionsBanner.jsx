import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import TiltCard from '../TiltCard';

const EASE = [0.76, 0, 0.24, 1];

export default function CustomSolutionsBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const words = ['Brand yang berkembang berinvestasi pada', 'kemasan custom berkualitas.', 'Kami bantu wujudkan visi Anda.'];

  return (
    <section ref={ref} className="py-24 px-10 md:px-16 lg:px-24 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <TiltCard>
          {/* Card with image background and glassmorphism */}
          <motion.div
            className="relative overflow-hidden min-h-[450px] flex items-center shadow-2xl shadow-navy-900/10"
            style={{ borderRadius: 60, clipPath: 'inset(100% 0 0 0 round 60px)' }}
            animate={inView ? { clipPath: 'inset(0% 0 0 0 round 60px)' } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Background Image */}
            <img 
              src="/images/dus kentang goreng 2.png" 
              alt="Custom Solutions" 
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-20" 
            />
            <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all duration-700" />
            
            {/* Animated Glow */}
            <motion.div 
              className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-white/[0.08] blur-3xl"
              animate={{ 
                x: [0, 40, 0],
                y: [0, -20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 px-10 py-16 md:px-24 md:py-24 w-full">
              <motion.p
                className="text-[11px] font-jost text-white/40 tracking-[0.4em] uppercase mb-10 flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                <span className="w-12 h-px bg-white/20" />
                Custom Packaging Solutions
              </motion.p>

              {/* Split-line headline */}
              <div className="mb-12 max-w-4xl">
                {words.map((line, i) => (
                  <div key={i} style={{ overflow: 'hidden' }}>
                    <motion.div
                      className={`font-display font-medium text-white leading-[1.1] ${
                        i === 2
                          ? 'text-xl md:text-2xl font-light text-white/60 mt-6'
                          : 'text-4xl md:text-5xl lg:text-7xl tracking-tight'
                      } ${i === 1 ? 'italic font-light text-white/70' : ''}`}
                      initial={{ y: '120%' }}
                      animate={inView ? { y: '0%' } : {}}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.08 }}
                    >
                      {line}
                    </motion.div>
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, ease: EASE }}
              >
                <Link
                  to="/Contact"
                  className="inline-flex items-center gap-4 px-10 py-5 bg-white text-navy-900 text-sm font-jost font-bold tracking-widest uppercase rounded-full hover:bg-navy-900 hover:text-white transition-all duration-300 shadow-xl shadow-black/10 group overflow-hidden relative"
                >
                  <span className="relative z-10">Konsultasi Sekarang</span>
                  <ArrowUpRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </TiltCard>
      </div>
    </section>
  );
}
