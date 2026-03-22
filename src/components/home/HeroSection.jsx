import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeroLine, FadeUp, SplitCharacters } from '../SplitText';
import MagneticButton from '../MagneticButton';

const EASE = [0.76, 0, 0.24, 1];
const HERO_IMAGE = '/images/custom-hero-bg.png';

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const yTranslate = useSpring(useTransform(scrollYProgress, [0, 1], [0, 200]), springConfig);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Background Parallax */}
      <motion.div className="absolute inset-0" style={{ y: yTranslate, scale }}>
        <motion.img
          src={HERO_IMAGE}
          alt="Custom Packaging Printwork"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, filter: 'blur(10px)', opacity: 0 }}
          animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      </motion.div>

      {/* Floating Elements for 3D depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-navy-900/[0.03] border border-navy-900/[0.05]"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50, 0],
              x: [0, Math.random() * 50 - 25, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24 w-full pt-32 pb-24"
        style={{ opacity }}
      >
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <HeroLine delay={0.1}>
            <span className="flex items-center gap-3 text-[10px] font-jost text-navy-300 tracking-[0.4em] uppercase mb-10">
              <span className="w-8 h-px bg-navy-200" />
              Est. 2012 — PT Printwork Indonesia
            </span>
          </HeroLine>

          {/* Giant headline with creative emphasis */}
          <h1 className="font-display font-medium leading-[0.9] mb-10" style={{ fontSize: 'clamp(2.5rem, 8vw, 6.5rem)' }}>
            <HeroLine delay={0.15}>
              <span className="block text-navy-900 tracking-tighter">Kemasan</span>
            </HeroLine>
            <div className="block text-navy-900 tracking-tighter flex flex-wrap items-baseline gap-[0.2em]">
              <SplitCharacters delay={0.25} className="font-display">Eksklusif</SplitCharacters>
              <HeroLine delay={0.4}>
                <em className="font-light text-navy-400 not-italic tracking-normal">Premium.</em>
              </HeroLine>
            </div>
          </h1>

          {/* Subline */}
          <HeroLine delay={0.5}>
            <p className="block text-base md:text-xl font-jost font-light text-navy-500 mb-12 max-w-xl leading-relaxed">
              Solusi kemasan <span className="text-navy-900 font-medium">custom</span> berkualitas tinggi yang membangun identitas brand Anda di pasar modern.
            </p>
          </HeroLine>

          {/* CTAs */}
          <FadeUp delay={0.65}>
            <div className="flex flex-wrap gap-8 items-center">
              <MagneticButton strength={30}>
                <Link
                  to="/Shop"
                  className="group relative inline-flex items-center gap-4 px-10 py-5 bg-navy-900 text-white rounded-full overflow-hidden transition-all duration-300 hover:bg-black shadow-2xl shadow-navy-900/20"
                >
                  <span className="relative z-10 font-jost font-semibold text-sm tracking-widest uppercase">Lihat Katalog</span>
                  <div className="relative z-10 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-800 to-navy-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </MagneticButton>

              <MagneticButton strength={20}>
                <Link
                  to="/Contact"
                  className="group inline-flex items-center gap-3 px-10 py-5 border border-navy-100 text-navy-900 text-sm font-jost font-semibold tracking-widest uppercase rounded-full hover:border-navy-900 hover:bg-navy-50 transition-all duration-300"
                >
                  Konsultasi Gratis
                </Link>
              </MagneticButton>
            </div>
          </FadeUp>
        </div>
      </motion.div>

      {/* Modern Scroll Indicator */}
      <div className="absolute bottom-12 left-10 hidden lg:flex items-center gap-5">
        <div className="flex flex-col gap-2">
           <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-navy-900"
            animate={{ y: [0, 10, 0], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
           />
           <div className="w-px h-20 bg-navy-100 mx-auto" />
        </div>
        <span className="text-[10px] font-jost text-navy-300 tracking-[0.3em] uppercase vertical-text">
          Scroll Down
        </span>
      </div>
    </section>
  );
}
