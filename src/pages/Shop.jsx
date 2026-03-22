import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { products as allProducts, categories as CATEGORIES, materialsList as MATERIALS } from '../data/products';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import PromoSlider from '../components/PromoSlider';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeMaterial, setActiveMaterial] = useState('Semua');
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
    setLoading(true);
    let data = allProducts;
    
    if (activeCategory !== 'Semua') {
      data = data.filter(p => p.category === activeCategory);
    }
    if (activeMaterial !== 'Semua') {
      data = data.filter(p => p.material === activeMaterial);
    }
    
    setProducts(data);
    setLoading(false);
  }, [activeCategory, activeMaterial]);

  const filtered = searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen transition-all duration-300">
        {/* Top Promo Area */}
        <div className="pb-2">
           <PromoSlider />
        </div>

        {/* Filters & Controls */}
        <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

            {/* Search bar */}
            <motion.div
              className="relative w-full md:w-80"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-secondary rounded-2xl text-xs text-navy-900 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 transition-all border border-navy-50"
              />
            </motion.div>
          </div>

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
                className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-navy-900 text-white shadow-xl shadow-navy-900/10 scale-105'
                    : 'bg-secondary text-navy-600 hover:bg-navy-100'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`ml-auto flex items-center gap-2 px-6 py-2.5 text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 ${
                showFilters 
                ? 'bg-navy-50 text-navy-900' 
                : 'text-navy-400 hover:text-navy-900'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
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
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${activeMaterial === mat
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
        <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24 pb-24">
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
              <p className="text-navy-400 text-lg">Produk tidak ditemukan</p>
              <p className="text-navy-300 text-sm mt-2">Coba sesuaikan pencarian atau filter Anda</p>
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
