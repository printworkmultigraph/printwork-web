import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

const EASE = [0.76, 0, 0.24, 1];

export default function ProductCard({ product, index = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1], delay: index * 0.07 }}
    >
      <Link to={`/ProductDetail?id=${product.id}`} className="group block">
        {/* Image with clip-path reveal */}
        <div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden mb-4">
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={inView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: index * 0.06 }}
          >
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ scale: 1.1 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: index * 0.06 }}
              whileHover={{ scale: 1.06 }}
            />
          </motion.div>
          {product.is_new && (
            <span className="absolute top-3 right-3 px-3 py-1 bg-navy-900 text-white text-[9px] font-jost font-bold uppercase tracking-wider rounded-full">
              New
            </span>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="px-4 py-2 bg-navy-900 text-white text-[10px] font-jost font-semibold tracking-wider uppercase rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.sizes.map(size => (
              <span
                key={size}
                className="px-2.5 py-0.5 border border-border rounded-full text-[9px] font-jost text-navy-400 font-medium tracking-wide"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Name */}
        <h3 className="text-sm font-jost font-medium text-navy-900 group-hover:text-navy-500 transition-colors duration-300 leading-snug">
          {product.name}
        </h3>

        {/* Price */}
        <p className="text-sm font-jost text-navy-400 mt-1">
          From <span className="text-navy-700 font-semibold">R{product.price?.toFixed(2)}</span>
          <span className="text-navy-300 text-[10px] ml-1">incl. vat</span>
        </p>
      </Link>
    </motion.div>
  );
}