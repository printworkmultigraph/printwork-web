import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import TiltCard from './TiltCard';

const EASE = [0.76, 0, 0.24, 1];

export default function ProductCard({ product, index = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.05 }}
    >
      <Link to={`/ProductDetail?id=${product.id}`} className="group block">
        {/* Image with subtle reveal */}
        <div className="relative aspect-square bg-[#FAFAFA] rounded-3xl overflow-hidden mb-6 shadow-sm border border-navy-50/50">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: index * 0.05 }}
          >
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-8 md:p-12 transition-transform duration-1000 group-hover:scale-[1.03]"
            />
          </motion.div>
          
          {/* Subtle Hover Overlay */}
          <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/[0.02] transition-colors duration-500" />

          {/* Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-4 py-1.5 bg-navy-900 text-white text-[9px] font-jost font-bold uppercase tracking-[0.2em] rounded-full">
                New
              </span>
            )}
          </div>

          {product.outOfStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
              <span className="px-5 py-2 bg-navy-900 text-white text-[10px] font-jost font-bold tracking-[0.2em] uppercase rounded-full">
                Stok Habis
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-1">
          {/* Sizes */}
          <div className="flex gap-2 mb-2 overflow-hidden">
             <span className="text-[10px] font-jost text-navy-300 uppercase tracking-widest">{product.category}</span>
          </div>

          <h3 className="text-base font-display font-medium text-navy-900 group-hover:text-navy-500 transition-colors duration-300 leading-tight mb-1">
            {product.name}
          </h3>

          <p className="text-sm font-jost text-navy-400">
            <span className="text-navy-900 font-bold">Rp {product.price?.toLocaleString('id-ID')}</span>
            <span className="text-[10px] ml-1 opacity-60 uppercase tracking-tighter">/ pcs</span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
