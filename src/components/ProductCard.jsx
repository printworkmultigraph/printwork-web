import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        to={`/ProductDetail?id=${product.id}`}
        className="group block"
      >
        <div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {product.is_new && (
            <span className="absolute top-3 right-3 px-3 py-1 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              New
            </span>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="px-4 py-2 bg-navy-900 text-white text-xs font-semibold tracking-wider uppercase rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        {product.sizes?.length > 0 && (
          <div className="flex gap-2 mb-2">
            {product.sizes.map(size => (
              <span
                key={size}
                className="px-2.5 py-0.5 border border-border rounded-full text-[10px] text-navy-500 font-medium"
              >
                {size}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-sm font-medium text-navy-900 group-hover:text-navy-600 transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="text-sm text-navy-500 mt-1">
          From R{product.price?.toFixed(2)} <span className="text-navy-300 text-xs">incl. vat</span>
        </p>
      </Link>
    </motion.div>
  );
}