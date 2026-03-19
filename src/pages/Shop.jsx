import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Coffee', 'Smoothies', 'Deli', 'Takeout', 'Cutlery', 'Bags', 'Extras'];
const MATERIALS = ['All', 'PET', 'Kraft Paper', 'Bagasse', 'Bamboo', 'Paper Pulp', 'Plastic'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeMaterial, setActiveMaterial] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat && CATEGORIES.includes(cat)) {
      setActiveCategory(cat);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let data;
      const filters = {};
      if (activeCategory !== 'All') filters.category = activeCategory;
      if (activeMaterial !== 'All') filters.material = activeMaterial;

      if (Object.keys(filters).length > 0) {
        data = await base44.entities.Product.filter(filters, '-created_date', 50);
      } else {
        data = await base44.entities.Product.list('-created_date', 50);
      }
      setProducts(data);
      setLoading(false);
    };
    load();
  }, [activeCategory, activeMaterial]);

  const filtered = searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        {/* Header */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-12 pb-8">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-navy-900 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Shop all <span className="italic text-navy-500">products</span>
          </motion.h1>

          {/* Search bar */}
          <motion.div
            className="relative max-w-md mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-secondary rounded-xl text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
            />
          </motion.div>

          {/* Category tabs */}
          <motion.div
            className="flex items-center gap-2 flex-wrap mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-navy-900 text-white'
                    : 'bg-secondary text-navy-600 hover:bg-navy-100'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto flex items-center gap-2 px-4 py-2 text-sm text-navy-600 hover:text-navy-900 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </motion.div>

          {/* Material filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="p-5 bg-secondary rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Material</span>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-4 h-4 text-navy-400" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {MATERIALS.map(mat => (
                      <button
                        key={mat}
                        onClick={() => setActiveMaterial(mat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          activeMaterial === mat
                            ? 'bg-navy-900 text-white'
                            : 'bg-white text-navy-600 hover:bg-navy-50'
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Products grid */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-24">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i}>
                  <div className="aspect-square bg-secondary rounded-2xl animate-pulse mb-4" />
                  <div className="h-3 bg-secondary rounded animate-pulse w-2/3 mb-2" />
                  <div className="h-3 bg-secondary rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-navy-400 text-lg">No products found</p>
              <p className="text-navy-300 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}