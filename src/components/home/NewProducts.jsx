import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { products as allProducts } from '../../data/products';
import ProductCard from '../ProductCard';
import HorizontalSlider from '../HorizontalSlider';
import { LineReveal } from '../SplitText';

export default function NewProducts() {
  const newProducts = allProducts.filter(p => p.isNew).slice(0, 8);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <LineReveal delay={0}>
              <span className="text-[10px] font-jost text-navy-400 tracking-[0.3em] uppercase block mb-3">Baru Hadir</span>
            </LineReveal>
            <LineReveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900">
                Produk <em className="font-light text-navy-400 not-italic">Terbaru</em>
              </h2>
            </LineReveal>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/Shop"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white text-sm font-jost font-semibold rounded-full hover:bg-navy-700 transition-colors"
            >
              Lihat Semua
            </Link>
          </motion.div>
        </div>

        <HorizontalSlider>
          {newProducts.map((product, i) => (
            <div key={product.id} className="flex-shrink-0 w-[240px] sm:w-[260px]">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </HorizontalSlider>
      </div>
    </section>
  );
}
