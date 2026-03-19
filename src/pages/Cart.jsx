import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Cart() {
  const [items, setItems] = useState([]);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('yucca_cart') || '[]');
    setItems(cart);
  };

  useEffect(() => {
    loadCart();
    const handler = () => loadCart();
    window.addEventListener('cartUpdated', handler);
    return () => window.removeEventListener('cartUpdated', handler);
  }, []);

  const updateQty = (index, delta) => {
    const updated = [...items];
    updated[index].qty = Math.max(1, updated[index].qty + delta);
    setItems(updated);
    localStorage.setItem('yucca_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    localStorage.setItem('yucca_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <Navbar cartCount={items.length} />
      <main className="pt-28 pb-24 min-h-screen">
        <div className="max-w-[900px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/Shop" className="inline-flex items-center gap-2 text-sm text-navy-500 hover:text-navy-900 transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>

            <h1 className="text-3xl md:text-4xl font-display font-medium text-navy-900 mb-10">
              Your <span className="italic text-navy-500">Cart</span>
            </h1>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ShoppingBag className="w-16 h-16 text-navy-200 mx-auto mb-4" />
              <p className="text-navy-400 text-lg mb-2">Your cart is empty</p>
              <p className="text-navy-300 text-sm mb-8">Add some products to get started</p>
              <Link
                to="/Shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white text-sm font-semibold rounded-full"
              >
                Browse Products
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="space-y-4 mb-10">
                {items.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${item.size}-${i}`}
                    className="flex gap-5 p-4 bg-secondary rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-navy-900 truncate">{item.name}</h3>
                      {item.size && <p className="text-xs text-navy-400 mt-0.5">{item.size}</p>}
                      <p className="text-sm font-semibold text-navy-900 mt-2">R{(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(i)} className="text-navy-300 hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center border border-navy-200 rounded-full bg-white">
                        <button onClick={() => updateQty(i, -1)} className="w-8 h-8 flex items-center justify-center">
                          <Minus className="w-3 h-3 text-navy-600" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold">{item.qty}</span>
                        <button onClick={() => updateQty(i, 1)} className="w-8 h-8 flex items-center justify-center">
                          <Plus className="w-3 h-3 text-navy-600" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-navy-500">Subtotal</span>
                  <span className="text-sm font-semibold text-navy-900">R{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-navy-500">Delivery</span>
                  <span className="text-sm text-navy-500">{total >= 2000 ? 'Free' : 'Calculated at checkout'}</span>
                </div>
                <div className="flex items-center justify-between mb-8 pt-4 border-t border-border">
                  <span className="text-lg font-semibold text-navy-900">Total</span>
                  <span className="text-lg font-bold text-navy-900">R{total.toFixed(2)}</span>
                </div>
                <button className="w-full py-4 bg-navy-900 text-white text-sm font-semibold tracking-wide rounded-full hover:bg-navy-800 transition-colors">
                  Proceed to Checkout
                </button>
                <p className="text-center text-xs text-navy-400 mt-3">
                  Free delivery on orders over R2,000 incl. vat
                </p>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}