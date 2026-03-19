import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=85';

// Staggered line reveal — each line slides up from overflow:hidden
function LineReveal({ children, delay = 0 }) {
  return (
    <div style={{ overflow: 'hidden', display: 'block' }}>
      <motion.div
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax bg image */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <img
          src={HERO_IMAGE}
          alt="Premium packaging"
          className="w-full h-[115%] object-cover"
          style={{ marginTop: '-7.5%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/20" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-36 pb-24"
        style={{ y: textY }}
      >
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div style={{ overflow: 'hidden' }}>
            <motion.p
              className="text-xs font-jost text-navy-400 tracking-[0.35em] uppercase mb-6"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            >
              Premium Food Packaging
            </motion.p>
          </div>

          {/* Headline — each line in its own overflow:hidden container */}
          <h1 className="font-display font-medium leading-[0.92] mb-8"
              style={{ fontSize: 'clamp(3.2rem, 8vw, 8rem)' }}>
            <LineReveal delay={0.25}>
              <span className="block text-navy-900">Packaging</span>
            </LineReveal>
            <LineReveal delay={0.38}>
              <span className="block text-navy-900">that <em className="text-navy-500 not-italic font-light">Performs.</em></span>
            </LineReveal>
          </h1>

          {/* Sub-headline */}
          <div className="mb-10">
            <LineReveal delay={0.52}>
              <p className="text-lg md:text-xl font-display font-light text-navy-600 leading-snug">
                Innovated for Industry Leaders.
              </p>
            </LineReveal>
          </div>

          {/* Body */}
          <div style={{ overflow: 'hidden' }}>
            <motion.p
              className="text-sm font-jost text-navy-500 leading-relaxed max-w-md mb-10"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.65 }}
            >
              Premium packaging solutions for food service, food processing, and agricultural businesses across the globe.
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.8 }}
          >
            <Link
              to="/Shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white text-sm font-jost font-semibold tracking-wide rounded-full hover:bg-navy-800 transition-colors duration-300 group"
            >
              Shop Products
              <motion.span whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
            <Link
              to="/Contact"
              className="inline-flex items-center gap-2 px-8 py-4 border border-navy-300 text-navy-900 text-sm font-jost font-semibold tracking-wide rounded-full hover:border-navy-900 hover:bg-navy-900 hover:text-white transition-all duration-300"
            >
              Custom Solutions
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <motion.div
          className="w-px h-12 bg-navy-300 origin-top"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-[10px] font-jost text-navy-300 tracking-[0.2em] uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}