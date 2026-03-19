import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HorizontalSlider from '../HorizontalSlider';

const IMAGES = {
  'Food Service': 'https://media.base44.com/images/public/69bb88d987e87c84bc284bfc/a6f90cc61_generated_7e7f4f66.png',
  'Food Processing': 'https://media.base44.com/images/public/69bb88d987e87c84bc284bfc/6ca141c7f_generated_bf0be04d.png',
  'Agriculture': 'https://media.base44.com/images/public/69bb88d987e87c84bc284bfc/0399efd28_generated_6c7b1ef5.png',
};

const categories = [
  {
    title: 'Food Service',
    description: 'Cups, tubs, bowls, and more for takeout, catering, and deli food.',
    path: '/Shop?category=Coffee',
  },
  {
    title: 'Food Processing',
    description: 'Keep meat, poultry, and seafood fresh with packaging that minimises waste.',
    path: '/Shop?category=Deli',
  },
  {
    title: 'Agriculture',
    description: 'Ensure produce remains crisp and fresh from harvest to store shelves.',
    path: '/Shop?category=Extras',
  },
];

export default function CategorySlider() {
  return (
    <section className="py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          className="flex items-end justify-between mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-navy-400 text-xs tracking-[0.3em] uppercase mb-3">Solutions</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900">
              Packaging <span className="italic text-navy-500">Solutions</span>
            </h2>
          </div>
          <Link
            to="/Shop"
            className="hidden md:inline-flex items-center text-sm text-navy-600 hover:text-navy-900 font-medium transition-colors"
          >
            View all →
          </Link>
        </motion.div>

        <HorizontalSlider>
          {categories.map((cat, i) => (
            <Link
              key={cat.title}
              to={cat.path}
              className="flex-shrink-0 w-[320px] sm:w-[380px] lg:w-[420px] group"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                  <img
                    src={IMAGES[cat.title]}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
                  <span className="absolute bottom-4 left-5 text-white text-lg font-medium">
                    {cat.title}
                  </span>
                </div>
                <p className="text-sm text-navy-500 leading-relaxed px-1">{cat.description}</p>
                <span className="inline-block mt-3 text-sm text-navy-900 font-semibold group-hover:translate-x-1 transition-transform px-1">
                  Explore →
                </span>
              </motion.div>
            </Link>
          ))}
        </HorizontalSlider>
      </div>
    </section>
  );
}