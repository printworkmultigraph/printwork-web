import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Minus, Plus, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;
    const load = async () => {
      const data = await base44.entities.Product.filter({ id }, '-created_date', 1);
      if (data.length > 0) {
        setProduct(data[0]);
        setSelectedSize(data[0].sizes?.[0] || null);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('yucca_cart') || '[]');
    const existing = cart.findIndex(item => item.id === product.id && item.size === selectedSize);
    if (existing >= 0) {
      cart[existing].qty += qty;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize, qty });
    }
    localStorage.setItem('yucca_cart', JSON.stringify(cart));
    setAdded(true);
    window.dispatchEvent(new Event('cartUpdated'));
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-28 min-h-screen max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-secondary rounded-2xl animate-pulse" />
            <div className="space-y-4 py-8">
              <div className="h-8 bg-secondary rounded animate-pulse w-2/3" />
              <div className="h-4 bg-secondary rounded animate-pulse w-1/2" />
              <div className="h-4 bg-secondary rounded animate-pulse w-full" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-28 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-navy-400 text-lg">Product not found</p>
            <Link to="/Shop" className="text-navy-900 font-semibold mt-4 inline-block">← Back to Shop</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link to="/Shop" className="inline-flex items-center gap-2 text-sm text-navy-500 hover:text-navy-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Image */}
            <motion.div
              className="aspect-square bg-secondary rounded-3xl overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Details */}
            <motion.div
              className="py-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                {product.is_new && (
                  <span className="px-3 py-1 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">New</span>
                )}
                <span className="text-xs text-navy-400 uppercase tracking-wider">{product.category}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-medium text-navy-900 mb-3">
                {product.name}
              </h1>

              <p className="text-2xl text-navy-900 font-semibold mb-6">
                From R{product.price?.toFixed(2)} <span className="text-sm text-navy-400 font-normal">incl. vat</span>
              </p>

              <p className="text-navy-500 leading-relaxed mb-8">{product.description}</p>

              {/* Material */}
              {product.material && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">Material</p>
                  <span className="px-3 py-1.5 border border-navy-200 rounded-full text-sm text-navy-700">{product.material}</span>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-navy-900 text-white'
                            : 'border border-navy-200 text-navy-700 hover:border-navy-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">Quantity</p>
                <div className="inline-flex items-center border border-navy-200 rounded-full">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-navy-600 hover:text-navy-900"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-navy-900">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center text-navy-600 hover:text-navy-900"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                  added
                    ? 'bg-green-600 text-white'
                    : product.in_stock
                    ? 'bg-navy-900 text-white hover:bg-navy-800'
                    : 'bg-navy-200 text-navy-400 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}