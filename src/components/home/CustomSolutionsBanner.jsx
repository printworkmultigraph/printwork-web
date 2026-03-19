import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function CustomSolutionsBanner() {
  return (
    <section className="py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          className="relative bg-navy-900 rounded-[2rem] overflow-hidden p-10 md:p-16 lg:p-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-2xl">
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-6">Custom Solutions</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-white leading-tight mb-6">
              Brands that thrive invest in{' '}
              <span className="italic text-white/70">custom-designed</span>{' '}
              packaging.
            </h2>
            <p className="text-white/50 leading-relaxed mb-10 max-w-lg">
              Let us help bring your vision to life. Not sure what's possible? Get in touch to find out.
            </p>
            <Link
              to="/Contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 text-sm font-semibold rounded-full hover:bg-white/90 transition-colors group"
            >
              Enquire now
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}