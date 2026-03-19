import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeroLine, FadeUp } from '../SplitText';

const EASE = [0.76, 0, 0.24, 1];
const HERO_IMAGE = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1800&q=85';

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax bg */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <motion.img
          src={HERO_IMAGE}
          alt="Premium packaging"
          className="w-full h-[115%] object-cover"
          style={{ marginTop: '-7.5%' }}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/10" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-36 pb-28"
        style={{ y: textY }}
      >
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <HeroLine delay={0.1}>
            <span className="text-[10px] font-jost text-navy-400 tracking-[0.35em] uppercase block mb-7">
              Premium Food Packaging
            </span>
          </HeroLine>

          {/* Giant headline — each line its own reveal */}
          <h1 className="font-display font-medium leading-[0.9] mb-8" style={{ fontSize: 'clamp(3.5rem, 9vw, 9rem)' }}>
            <HeroLine delay={0.22}>
              <span className="block text-navy-900">Packaging</span>
            </HeroLine>
            <HeroLine delay={0.34}>
              <span className="block text-navy-900">
                that <em className="font-light text-navy-400 not-italic">Performs.</em>
              </span>
            </HeroLine>
          </h1>

          {/* Subline */}
          <HeroLine delay={0.48}>
            <span className="block text-xl md:text-2xl font-display font-light text-navy-500 mb-10">
              Innovated for Industry Leaders.
            </span>
          </HeroLine>

          {/* Description */}
          <FadeUp delay={0.65}>
            <p className="text-sm font-jost text-navy-400 leading-relaxed max-w-md mb-10">
              Premium packaging solutions for food service, food processing, and agricultural businesses across the globe.
            </p>
          </FadeUp>

          {/* CTAs */}
          <FadeUp delay={0.78}>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/Shop"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-navy-900 text-white text-sm font-jost font-semibold tracking-wide rounded-full hover:bg-navy-700 transition-colors duration-300 group overflow-hidden relative"
              >
                <span>Shop Products</span>
                <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
              </Link>
              <Link
                to="/Contact"
                className="inline-flex items-center gap-2 px-8 py-4 border border-navy-200 text-navy-900 text-sm font-jost font-semibold tracking-wide rounded-full hover:border-navy-900 hover:bg-navy-900 hover:text-white transition-all duration-400"
              >
                Custom Solutions
              </Link>
            </div>
          </FadeUp>
        </div>
      </motion.div>

      {/* Animated scroll line */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <motion.div
          className="w-px bg-navy-300 origin-top"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 48, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
        >
          <motion.div
            className="w-full bg-navy-600"
            style={{ height: '100%' }}
            animate={{ scaleY: [0, 1, 0], y: ['0%', '0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
          />
        </motion.div>
        <motion.span
          className="text-[9px] font-jost text-navy-300 tracking-[0.25em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Scroll
        </motion.span>
      </div>
    </section>
  );
}