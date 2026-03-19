import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ProductCard from '../ProductCard';
import HorizontalSlider from '../HorizontalSlider';

export default function NewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    const load = async () => {
      const data = await base44.entities.Product.filter({ is_new: true }, '-created_date', 8);
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-secondary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div style={{ overflow: 'hidden' }}>
              <motion.p
                className="text-[10px] font-jost text-navy-400 tracking-[0.3em] uppercase mb-3"
                initial={{ y: '100%' }}
                animate={inView ? { y: '0%' } : {}}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              >
                Just Arrived
              </motion.p>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900"
                initial={{ y: '100%' }}
                animate={inView ? { y: '0%' } : {}}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              >
                New <em className="font-light text-navy-500">Products</em>
              </motion.h2>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/Shop"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white text-sm font-jost font-semibold rounded-full hover:bg-navy-800 transition-colors"
            >
              Shop now
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-shrink-0 w-[260px]">
                <div className="aspect-square bg-white rounded-2xl animate-pulse mb-4" />
                <div className="h-3 bg-white rounded animate-pulse w-2/3 mb-2" />
                <div className="h-3 bg-white rounded animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <HorizontalSlider>
            {products.map((product, i) => (
              <div key={product.id} className="flex-shrink-0 w-[240px] sm:w-[260px]">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </HorizontalSlider>
        )}

        <Link
          to="/Shop"
          className="md:hidden inline-flex items-center gap-2 mt-8 px-6 py-3 bg-navy-900 text-white text-sm font-jost font-semibold rounded-full"
        >
          Shop now
        </Link>
      </div>
    </section>
  );
}