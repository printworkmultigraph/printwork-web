import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ProductCard from '../ProductCard';
import HorizontalSlider from '../HorizontalSlider';

export default function NewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await base44.entities.Product.filter({ is_new: true }, '-created_date', 8);
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          className="flex items-end justify-between mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-navy-400 text-xs tracking-[0.3em] uppercase mb-3">Just Arrived</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900">
              New <span className="italic text-navy-500">Products</span>
            </h2>
          </div>
          <Link
            to="/Shop"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white text-sm font-semibold rounded-full hover:bg-navy-800 transition-colors"
          >
            Shop now
          </Link>
        </motion.div>

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
          className="md:hidden inline-flex items-center gap-2 mt-8 px-6 py-3 bg-navy-900 text-white text-sm font-semibold rounded-full"
        >
          Shop now
        </Link>
      </div>
    </section>
  );
}