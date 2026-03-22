import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Cart() {
  const [items, setItems] = useState([]);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('printwork_cart') || '[]');
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
    const prevItem = updated[index];
    // If we use dynamic intervals we could read them here, but for now just increment by 500 or decrement by 500 if item qty is large. 
    // Usually we increment by step. But delta is passed as -1 or 1, let's step by 500 since minimum is 500 mostly.
    // Or we can just adapt standard delta. 
    const step = 500;
    const newQty = Math.max(step, prevItem.quantity + (delta * step));
    updated[index].quantity = newQty;
    
    setItems(updated);
    localStorage.setItem('printwork_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    localStorage.setItem('printwork_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar cartCount={items.length} />
      <main className="pt-28 pb-24 min-h-screen">
        <div className="max-w-[900px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/Shop" className="inline-flex items-center gap-2 text-sm text-navy-500 hover:text-navy-900 transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Lanjut Belanja
            </Link>

            <h1 className="text-3xl md:text-4xl font-display font-medium text-navy-900 mb-10">
              Keranjang <span className="italic text-navy-500">Belanja</span>
            </h1>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ShoppingBag className="w-16 h-16 text-navy-200 mx-auto mb-4" />
              <p className="text-navy-400 text-lg mb-2">Keranjang Anda masih kosong</p>
              <p className="text-navy-300 text-sm mb-8">Pilih produk terbaik kami untuk mulai berbelanja.</p>
              <Link
                to="/Shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white text-sm font-semibold rounded-full"
              >
                Lihat Produk
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="space-y-4 mb-10">
                {items.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${item.variant}-${i}`}
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
                      {item.variant && <p className="text-xs text-navy-400 mt-0.5">{item.variant}</p>}
                      <p className="text-sm font-semibold text-navy-900 mt-2">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(i)} className="text-navy-300 hover:text-navy-700 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center border border-navy-200 rounded-lg bg-white overflow-hidden mt-4">
                        <button onClick={() => updateQty(i, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 border-r border-navy-200">
                          <Minus className="w-3 h-3 text-navy-600" />
                        </button>
                        <span className="w-12 text-center text-xs font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQty(i, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 border-l border-navy-200">
                          <Plus className="w-3 h-3 text-navy-600" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-border pt-6 mt-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-navy-500">Subtotal</span>
                  <span className="text-sm font-semibold text-navy-900">Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center justify-between mb-8 pt-4 border-t border-border mt-4">
                  <span className="text-lg font-semibold text-navy-900">Total Perkiraan</span>
                  <span className="text-xl font-bold text-navy-900">Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex flex-col gap-4">
                  <a
                    href={`https://wa.me/6281113000966?text=Halo%20Printwork,%20saya%20ingin%20memesan%20produk%20berikut:%0A%0A${items.map(item => `- ${item.name} (${item.variant})%0A  Jumlah: ${item.quantity} pcs%0A  Estimasi: Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`).join('%0A%0A')}%0A%0ATotal Estimasi: Rp ${total.toLocaleString('id-ID')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-secondary text-navy-900 text-sm font-semibold tracking-wide rounded-full hover:bg-navy-50 transition-colors flex items-center justify-center border border-navy-100"
                  >
                    Konsultasi via WhatsApp
                  </a>

                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/create-invoice', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            amount: total,
                            external_id: `PW-${Date.now()}`,
                            description: `Pesanan Printwork - ${items.length} item`,
                            payer_email: 'customer@printwork.id'
                          })
                        });
                        const data = await response.json();
                        if (data.invoice_url) {
                          window.location.href = data.invoice_url;
                        } else {
                          alert('Gagal membuat invoice. Pastikan Xendit Key sudah benar.');
                        }
                      } catch (e) {
                        console.error(e);
                        alert('Terjadi kesalahan koneksi ke Payment Gateway.');
                      }
                    }}
                    className="w-full py-4 bg-navy-900 text-white text-sm font-semibold tracking-wide rounded-full hover:bg-black transition-all flex items-center justify-center shadow-xl shadow-navy-900/10"
                  >
                    Bayar Sekarang (Xendit)
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
