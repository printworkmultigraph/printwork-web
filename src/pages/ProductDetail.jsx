import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowRight, Truck, Plus, Minus, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EASE = [0.76, 0, 0.24, 1];

export default function ProductDetail() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const product = products.find((p) => p.id === id);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedPrint, setSelectedPrint] = useState('');
  const [selectedLaminasi, setSelectedLaminasi] = useState('');
  const [quantity, setQuantity] = useState(product?.minOrder || 500);
  const [isPairingOpen, setIsPairingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showAddedNotification, setShowAddedNotification] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
      if (product.materials?.length) setSelectedMaterial(product.materials[0]);
      if (product.prints?.length) setSelectedPrint(product.prints[0]);
      if (product.laminasi?.length) setSelectedLaminasi(product.laminasi[0]);
      setQuantity(product.minOrder || 500);
    }
  }, [product]);

  const { currentPrice, validQuantities } = useMemo(() => {
    if (!product || !product.priceMatrix) return { currentPrice: product?.price || 0, validQuantities: [500] };
    
    let keyParts = [];
    if (product.sizes?.length) keyParts.push(selectedSize);
    if (product.materials?.length) keyParts.push(selectedMaterial);
    if (product.prints?.length) keyParts.push(selectedPrint);
    if (product.laminasi?.length) keyParts.push(selectedLaminasi);
    
    const key = keyParts.join('|');
    const pricingObj = product.priceMatrix[key];
    
    if (pricingObj) {
      const qts = Object.keys(pricingObj).map(Number).sort((a,b) => a-b);
      let applicableQty = qts[0];
      for(let i=0; i<qts.length; i++) {
        if(quantity >= qts[i]) applicableQty = qts[i];
      }
      return { currentPrice: pricingObj[applicableQty], validQuantities: qts };
    }
    
    return { currentPrice: product.price || 0, validQuantities: [product.minOrder || 500] };
  }, [product, selectedSize, selectedMaterial, selectedPrint, selectedLaminasi, quantity]);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white pt-32 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-medium text-navy-900 mb-4">Produk Tidak Ditemukan</h1>
            <p className="text-gray-500 mb-8">Produk yang Anda cari tidak ada.</p>
            <Link to="/Shop" className="inline-flex items-center justify-center px-6 py-3 bg-navy-900 text-white font-medium rounded-lg hover:bg-black transition-all">
              Kembali ke Produk
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    const variantParts = [];
    if (selectedSize) variantParts.push(selectedSize);
    if (selectedMaterial) variantParts.push(selectedMaterial);
    if (selectedPrint) variantParts.push(selectedPrint);
    if (selectedLaminasi) variantParts.push(selectedLaminasi);
    
    const variantName = variantParts.join(' | ');
    const cart = JSON.parse(localStorage.getItem('printwork_cart') || '[]');
    const existing = cart.findIndex(item => item.id === product.id && item.variant === variantName);
    
    if (existing >= 0) {
      cart[existing].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: currentPrice,
        quantity: quantity,
        image: product.image,
        variant: variantName,
      });
    }
    
    localStorage.setItem('printwork_cart', JSON.stringify(cart));
    setShowAddedNotification(true);
    window.dispatchEvent(new Event('cartUpdated'));
    setTimeout(() => setShowAddedNotification(false), 3000);
  };

  const productDescription = product.description || `${product.name} diproduksi dengan material berkualitas tinggi dan standar produksi yang ketat, memastikan setiap detail sempurna untuk kebutuhan bisnis Anda.`;
  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-24 lg:pt-28">
        <AnimatePresence>
          {showAddedNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white shadow-xl rounded-xl px-6 py-4 border border-gray-100"
            >
              <p className="text-navy-900 font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">telah ditambahkan ke keranjang.</p>
              <Link to="/Cart" className="text-navy-900 block text-sm font-medium underline mt-2">Lihat Keranjang</Link>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-b border-gray-100">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
            <nav className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/Shop" className="hover:text-navy-900 transition-colors inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Link>
              <span>/</span>
              <span className="text-navy-900">{product.name}</span>
            </nav>
          </div>
        </div>

        <section className="py-12 md:py-20 lg:py-24">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-start">
              <div className="lg:col-span-7 sticky top-32">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="relative bg-[#FAFAFA] rounded-[3rem] overflow-hidden aspect-square border border-navy-50 flex items-center justify-center p-12 md:p-24"
                >
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-1000 hover:scale-105"
                  />
                  <div className="absolute bottom-10 left-10 flex gap-3">
                    {product.isNew && <span className="px-4 py-1.5 bg-navy-900 text-white text-[10px] font-bold tracking-widest uppercase rounded-full">New</span>}
                    <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md text-navy-900 text-[10px] font-bold tracking-widest uppercase rounded-full border border-navy-50">Ready</span>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                >
                  <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-navy-300 mb-6 block">Premium Packaging</span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-navy-900 leading-[1.1] mb-10">
                    {product.name}
                  </h1>

                  {product.sizes && (
                    <div className="mb-10">
                      <label className="block text-[10px] font-bold tracking-widest text-navy-200 uppercase mb-5">Ukuran</label>
                      <div className="flex flex-wrap gap-4">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 sm:px-6 py-3 rounded-xl border-2 transition-all duration-300 text-center ${
                              selectedSize === size ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-50 bg-white text-navy-400 hover:border-navy-900'
                            }`}
                          >
                            <span className="text-[11px] font-medium leading-tight block">{size}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 mb-10">
                    {product.materials && (
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-bold tracking-widest text-navy-200 uppercase mb-4">Material</label>
                        <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)} className="w-full px-4 py-3 bg-white border border-navy-50 rounded-xl text-xs outline-none">
                          {product.materials.map(mat => <option key={mat} value={mat}>{mat}</option>)}
                        </select>
                      </div>
                    )}
                    {product.variants && (
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-bold tracking-widest text-navy-200 uppercase mb-4">Varian</label>
                        <select className="w-full px-4 py-3 bg-white border border-navy-50 rounded-xl text-xs outline-none">
                          {product.variants.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="mb-12 py-10 border-y border-navy-50">
                    <p className="text-[11px] font-bold tracking-widest text-navy-200 uppercase mb-4">Estimasi Harga</p>
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl lg:text-6xl font-display font-medium text-navy-900">
                        Rp {currentPrice.toLocaleString('id-ID')}
                      </span>
                      <span className="text-navy-300 font-medium text-sm">/ Pcs</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 mb-12">
                    <div className="flex items-center border border-navy-50 rounded-2xl bg-white h-16 px-4">
                      <button onClick={() => {
                        const idx = validQuantities.indexOf(quantity);
                        if (idx > 0) setQuantity(validQuantities[idx - 1]);
                        else if (quantity > 500) setQuantity(quantity - 500);
                      }} className="w-10 h-10 flex items-center justify-center text-navy-900 hover:bg-navy-50 rounded-xl transition-all">
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="flex flex-col items-center justify-center px-6 min-w-[6rem]">
                        <span className="text-xl font-medium text-navy-900">{quantity}</span>
                        <span className="text-[9px] font-bold text-navy-200 uppercase tracking-widest">Pcs</span>
                      </div>
                      <button onClick={() => {
                        const idx = validQuantities.indexOf(quantity);
                        if (idx !== -1 && idx < validQuantities.length - 1) setQuantity(validQuantities[idx + 1]);
                        else setQuantity(quantity + 500);
                      }} className="w-10 h-10 flex items-center justify-center text-navy-900 hover:bg-navy-50 rounded-xl transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 h-16 bg-navy-900 text-white font-bold text-xs tracking-widest uppercase rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3"
                    >
                      Tambah ke Keranjang <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-navy-50">
                    <div className="space-y-2">
                       <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-navy-900">
                         <Truck className="w-4 h-4" /> Pengiriman
                       </span>
                       <p className="text-[11px] text-navy-400">Standard 3-7 hari kerja.</p>
                    </div>
                    <div className="space-y-2">
                       <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-navy-900">
                         <Plus className="w-4 h-4" /> Kebijakan
                       </span>
                       <p className="text-[11px] text-navy-400">Garansi kepuasan 100%.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="py-24 bg-white border-t border-navy-50">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex gap-12 border-b border-navy-50 mb-16">
              {['Deskripsi', 'Spesifikasi', 'Review'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`pb-8 text-[11px] font-bold tracking-widest uppercase relative transition-colors ${
                    activeTab === tab.toLowerCase() ? 'text-navy-900' : 'text-navy-200 hover:text-navy-900'
                  }`}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && (
                    <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-px bg-navy-900" />
                  )}
                </button>
              ))}
            </div>
            <div className="max-w-3xl">
              <p className="text-lg text-navy-400 leading-relaxed font-light">
                {productDescription}
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
