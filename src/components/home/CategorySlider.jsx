import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import HorizontalSlider from '../HorizontalSlider';

const categories = [
  {
    title: 'Food Service',
    description: 'Cups, tubs, bowls, and more for takeout, catering, and deli food.',
    path: '/Shop?category=Coffee',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
  },
  {
    title: 'Food Processing',
    description: 'Keep meat, poultry, and seafood fresh with packaging that minimises waste.',
    path: '/Shop?category=Deli',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  },
  {
    title: 'Agriculture',
    description: 'Ensure produce remains crisp and fresh from harvest to store shelves.',
    path: '/Shop?category=Extras',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80',
  },
  {
    title: 'Custom Solutions',
    description: 'Bespoke branding and custom-designed packaging for your unique vision.',
    path: '/Contact',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  },
];

function CategoryCard({ cat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <Link ref={ref} to={cat.path} className="flex-shrink-0 w-[300px] sm:w-[360px] lg:w-[400px] group block">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: index * 0.08 }}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5">
          <motion.img
            src={cat.image}
            alt={cat.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
          <motion.div
            className="absolute bottom-4 left-5 right-5"
            initial={{ y: 8, opacity: 0.7 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-white text-xl font-display font-medium block">{cat.title}</span>
            <span className="text-white/0 group-hover:text-white/80 text-xs font-jost transition-colors duration-300 block mt-1">
              Explore →
            </span>
          </motion.div>
        </div>
        <p className="text-sm font-jost text-navy-500 leading-relaxed px-1">{cat.description}</p>
      </motion.div>
    </Link>
  );
}

export default function CategorySlider() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="flex items-end justify-between mb-12">
          <div>
            <div style={{ overflow: 'hidden' }}>
              <motion.p
                className="text-[10px] font-jost text-navy-400 tracking-[0.3em] uppercase mb-3"
                initial={{ y: '100%' }}
                animate={inView ? { y: '0%' } : {}}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              >
                Solutions
              </motion.p>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900"
                initial={{ y: '100%' }}
                animate={inView ? { y: '0%' } : {}}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              >
                Packaging <em className="not-italic font-light text-navy-500">Solutions</em>
              </motion.h2>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <Link to="/Shop" className="hidden md:inline-flex overflow-hidden group flex-col h-5">
              <span className="block text-sm font-jost text-navy-500 transition-transform duration-300 group-hover:-translate-y-full">View all →</span>
              <span className="block text-sm font-jost text-navy-900 transition-transform duration-300 group-hover:-translate-y-full">View all →</span>
            </Link>
          </motion.div>
        </div>

        <HorizontalSlider>
          {categories.map((cat, i) => (
            <CategoryCard key={cat.title} cat={cat} index={i} />
          ))}
        </HorizontalSlider>
      </div>
    </section>
  );
}