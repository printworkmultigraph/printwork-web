import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SplitLines, LineReveal, FadeUp } from '../SplitText';
import { ImageReveal } from '../ClipReveal';

export default function MissionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 lg:py-36">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Heading */}
        <div className="text-center mb-20">
          <SplitLines
            lines={['Committed to Excellence,', 'always Innovating']}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-navy-900 leading-tight mb-6"
            delay={0}
          />
          <FadeUp delay={0.35}>
            <p className="text-sm font-jost text-navy-400 max-w-md mx-auto leading-relaxed">
              Remarkable packaging is our promise to you. What doesn't meet our standards is refined until it does.
            </p>
          </FadeUp>
          <FadeUp delay={0.45}>
            <Link
              to="/About"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 border border-navy-200 text-navy-900 text-sm font-jost font-semibold tracking-wide rounded-full hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-all duration-400 group"
            >
              About us
            </Link>
          </FadeUp>
        </div>

        {/* Mission / Vision cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            className="p-10 lg:p-12 bg-secondary rounded-3xl"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
          >
            <p className="text-[10px] font-jost text-navy-300 tracking-[0.3em] uppercase mb-6">Our Mission</p>
            <p className="font-display text-xl font-light text-navy-700 leading-relaxed">
              We provide world-class, compliant packaging from trusted global partners to food service, food processing, and agricultural businesses across the globe.
            </p>
          </motion.div>

          <motion.div
            className="p-10 lg:p-12 bg-navy-900 rounded-3xl"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.34 }}
          >
            <p className="text-[10px] font-jost text-white/25 tracking-[0.3em] uppercase mb-6">Our Vision</p>
            <p className="font-display text-xl font-light text-white/75 leading-relaxed">
              To be the trusted, industry-leading packaging supplier, known for ethical practices, reliable supply and dedication to sustainable innovation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}