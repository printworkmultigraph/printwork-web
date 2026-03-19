import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import HorizontalSlider from '../HorizontalSlider';
import { LineReveal, FadeUp } from '../SplitText';
import { ImageReveal } from '../ClipReveal';

const EASE = [0.76, 0, 0.24, 1];

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
    <Link ref={ref} to={cat.path} className="flex-shrink-0 w-[290px] sm:w-[350px] lg:w-[390px] group block">
      {/* Image with clip-path wipe */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5">
        <motion.div
          className="absolute inset-0"
          style={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={inView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: index * 0.1 }}
        >
          <motion.img
            src={cat.image}
            alt={cat.title}
            className="w-full h-full object-cover"
            style={{ scale: 1.1 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 1.0, ease: EASE, delay: index * 0.1 }}
            whileHover={{ scale: 1.06 }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/55 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-5 left-5 right-5">
          <span className="text-white text-xl font-display font-medium block">{cat.title}</span>
          <motion.span
            className="text-white/70 text-xs font-jost tracking-wide block mt-1"
            initial={{ opacity: 0, y: 6 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Explore →
          </motion.span>
        </div>
      </div>
      <FadeUp delay={index * 0.1 + 0.3}>
        <p className="text-sm font-jost text-navy-400 leading-relaxed px-1">{cat.description}</p>
      </FadeUp>
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
            <LineReveal delay={0}>
              <span className="text-[10px] font-jost text-navy-400 tracking-[0.3em] uppercase block mb-3">Solutions</span>
            </LineReveal>
            <LineReveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900">
                Packaging <em className="font-light text-navy-400 not-italic">Solutions</em>
              </h2>
            </LineReveal>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}>
            <Link to="/Shop" className="hidden md:flex overflow-hidden h-5 flex-col group">
              <span className="block text-sm font-jost text-navy-400 transition-transform duration-300 group-hover:-translate-y-full">View all →</span>
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