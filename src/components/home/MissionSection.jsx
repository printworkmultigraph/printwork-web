import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MissionSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900 mb-4">
            Committed to <span className="italic text-navy-500">Excellence,</span>
            <br />always <span className="italic text-navy-500">Innovating</span>
          </h2>
          <p className="text-navy-500 max-w-xl mx-auto mt-4">
            Remarkable packaging is our promise to you. What doesn't meet our standards is refined until it does.
          </p>
          <Link
            to="/About"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 border-2 border-navy-900 text-navy-900 text-sm font-semibold tracking-wide rounded-full hover:bg-navy-900 hover:text-white transition-all duration-300"
          >
            About us
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            className="p-8 lg:p-10 bg-secondary rounded-3xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-navy-400 text-xs tracking-[0.3em] uppercase mb-4">Our Mission</p>
            <p className="text-navy-700 leading-relaxed">
              We provide world-class, compliant packaging from trusted global partners to food service, 
              food processing, and agricultural businesses across the globe.
            </p>
          </motion.div>

          <motion.div
            className="p-8 lg:p-10 bg-navy-900 rounded-3xl"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-4">Our Vision</p>
            <p className="text-white/80 leading-relaxed">
              To be the trusted, industry-leading packaging supplier, known for ethical practices, 
              reliable supply and dedication to sustainable innovation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}