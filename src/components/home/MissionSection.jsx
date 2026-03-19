import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MissionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-navy-900 leading-tight"
              initial={{ y: '100%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              Committed to <em className="font-light text-navy-500">Excellence,</em>
              <br />always <em className="font-light text-navy-500">Innovating</em>
            </motion.h2>
          </div>
          <motion.p
            className="text-navy-400 max-w-xl mx-auto mt-6 text-sm font-jost leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Remarkable packaging is our promise to you. What doesn't meet our standards is refined until it does.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Link
              to="/About"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 border border-navy-200 text-navy-900 text-sm font-jost font-semibold tracking-wide rounded-full hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-all duration-400 group"
            >
              <span className="overflow-hidden h-[1.1em] flex flex-col">
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">About us</span>
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">About us</span>
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            className="p-10 lg:p-12 bg-secondary rounded-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
          >
            <p className="text-[10px] font-jost text-navy-400 tracking-[0.3em] uppercase mb-5">Our Mission</p>
            <p className="font-display text-2xl font-light text-navy-800 leading-snug">
              We provide world-class, compliant packaging from trusted global partners to food service, food processing, and agricultural businesses across the globe.
            </p>
          </motion.div>

          <motion.div
            className="p-10 lg:p-12 bg-navy-900 rounded-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.32 }}
          >
            <p className="text-[10px] font-jost text-white/30 tracking-[0.3em] uppercase mb-5">Our Vision</p>
            <p className="font-display text-2xl font-light text-white/80 leading-snug">
              To be the trusted, industry-leading packaging supplier, known for ethical practices, reliable supply and dedication to sustainable innovation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}