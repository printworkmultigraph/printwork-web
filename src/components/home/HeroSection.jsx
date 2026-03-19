import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HERO_IMAGE = '/__generating__/img_73bd96938a2f.png';

const words = ['Packaging', 'that', 'Performs.'];
const subtitle = ['Innovated', 'for', 'Industry', 'Leaders.'];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <motion.img
          src={HERO_IMAGE}
          alt="Premium packaging"
          className="w-full h-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/30" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-32 pb-20">
        <div className="max-w-2xl">
          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-medium leading-[0.95] mb-4">
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 60, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3 + i * 0.12,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                {word === 'Performs.' ? (
                  <span className="italic text-navy-600">{word}</span>
                ) : word}
              </motion.span>
            ))}
          </h1>

          <div className="mb-8">
            {subtitle.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.25em] text-2xl sm:text-3xl lg:text-4xl font-display text-navy-500 font-light"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.8 + i * 0.1,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Description */}
          <motion.p
            className="text-base text-navy-500 leading-relaxed max-w-md mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
          >
            Premium packaging solutions for food service, food processing, and agricultural businesses across the globe.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.5 }}
          >
            <Link
              to="/Shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white text-sm font-semibold tracking-wide rounded-full hover:bg-navy-800 transition-colors group"
            >
              Shop Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/Contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-navy-900 text-navy-900 text-sm font-semibold tracking-wide rounded-full hover:bg-navy-900 hover:text-white transition-colors"
            >
              Custom Solutions
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-navy-300 rounded-full flex items-start justify-center pt-2">
          <motion.div
            className="w-1 h-2.5 bg-navy-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}