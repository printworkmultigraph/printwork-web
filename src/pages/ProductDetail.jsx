import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Star, Share, Heart, ShoppingBag, Phone, Send, Package } from 'lucide-react';
import { products } from '../data/products';
import { supabase } from '../lib/supabase';
import { adjustRating, calculateAverageRating, getRatingDistribution } from '../utils/reviewHelpers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const product = products.find((p) => p.id === id);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedPrint, setSelectedPrint] = useState('');
  const [selectedLaminasi, setSelectedLaminasi] = useState('');
  const [quantity, setQuantity] = useState(500);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Stock state
  const [variantStock, setVariantStock] = useState(null);
  const [stockLoading, setStockLoading] = useState(true);

  // Pre-order state
  const [showPreorderForm, setShowPreorderForm] = useState(false);
  const [preorderName, setPreorderName] = useState('');
  const [preorderPhone, setPreorderPhone] = useState('');
  const [preorderSubmitting, setPreorderSubmitting] = useState(false);
  const [preorderSuccess, setPreorderSuccess] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
      if (product.materials?.length) setSelectedMaterial(product.materials[0]);
      if (product.prints?.length) setSelectedPrint(product.prints[0]);
      if (product.laminasi?.length) setSelectedLaminasi(product.laminasi[0]);
      setQuantity(500);
      fetchReviews();
    }
  }, [product]);

  // Fetch stock when variant changes
  useEffect(() => {
    if (product && selectedSize) {
      fetchStock();
    }
  }, [product, selectedSize]);

  const fetchStock = async () => {
    setStockLoading(true);
    try {
      const { data } = await supabase
        .from('inventory')
        .select('stock')
        .eq('product_id', product.id)
        .eq('variant_key', selectedSize)
        .maybeSingle();
      setVariantStock(data?.stock ?? null);
    } catch (err) {
      console.error('Stock fetch error:', err);
      setVariantStock(null);
    }
    setStockLoading(false);
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', product.id)
        .eq('is_hidden', false)
        .order('created_at', { ascending: false });
      setReviews(data || []);
    } catch (err) {
      console.error('Reviews fetch error:', err);
    }
    setReviewsLoading(false);
  };

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

  // Is this variant out of stock?
  const isOutOfStock = variantStock !== null && variantStock === 0;

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white pt-32 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-4">Produk Tidak Ditemukan</h1>
            <p className="text-gray-500 mb-8">Produk yang Anda cari tidak ada.</p>
            <Link to="/Shop" className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
              Kembali ke Kategori
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

  const handleCheckoutNow = async () => {
    try {
      setIsProcessing(true);
      
      // 1. Verify and decrement stock in real-time
      if (variantStock !== null) {
        // Double check stock from DB to be safe
        const { data: currentDbStock, error: stockCheckError } = await supabase
          .from('inventory')
          .select('stock')
          .eq('product_id', product.id)
          .eq('variant_key', selectedSize)
          .single();

        if (stockCheckError) throw new Error('Gagal memverifikasi stok.');
        
        if (currentDbStock.stock < quantity) {
          alert(`Maaf, stok tidak mencukupi. Sisa stok saat ini: ${currentDbStock.stock} pcs.`);
          setVariantStock(currentDbStock.stock);
          setIsProcessing(false);
          return;
        }

        // Decrement the stock
        const newStock = currentDbStock.stock - quantity;
        const { error: updateError } = await supabase
          .from('inventory')
          .update({ stock: newStock, updated_at: new Date().toISOString() })
          .eq('product_id', product.id)
          .eq('variant_key', selectedSize);

        if (updateError) throw new Error('Gagal memproses stok.');
        
        // Update local state so UI updates immediately
        setVariantStock(newStock);
      }

      // 2. Add to cart record (for local state)
      handleAddToCart();
      
      const totalPrice = currentPrice * quantity;
      
      const variantParts = [];
      if (selectedSize) variantParts.push(selectedSize);
      if (selectedMaterial) variantParts.push(selectedMaterial);
      if (selectedPrint) variantParts.push(selectedPrint);
      if (selectedLaminasi) variantParts.push(selectedLaminasi);
      const variantName = variantParts.join(' | ');

      // 3. Create invoice / Process payment
      const response = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          external_id: `PW-${Date.now()}`,
          description: `Pesanan Printwork - ${product.name} (${quantity} pcs)`,
          payer_email: 'customer@printwork.id',
          product_name: product.name,
          product_variant: variantName,
          quantity: quantity
        })
      });
      
      const data = await response.json();
      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        // If invoice fails, we technically already decremented stock. 
        // In production, you'd use a transaction or database function.
        // For this demo, we'll just alert.
        console.error('Invoice failed but stock was reduced (Demo mode)');
        alert('Checkout sedang diproses. (Invoice simulator redirect)');
        // Simulate redirect if local api non-existent
        setTimeout(() => navigate('/Cart'), 1000);
      }
    } catch (e) {
      console.error(e);
      alert(e.message || 'Terjadi kesalahan koneksi ke Payment Gateway.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreorder = async () => {
    if (!preorderName.trim() || !preorderPhone.trim()) return;
    setPreorderSubmitting(true);
    try {
      const { error } = await supabase.from('preorders').insert({
        product_id: product.id,
        product_name: product.name,
        variant_key: selectedSize,
        customer_name: preorderName,
        customer_phone: preorderPhone.startsWith('0') ? `62${preorderPhone.slice(1)}` : preorderPhone,
        qty: quantity,
        status: 'pending',
      });
      if (!error) {
        setPreorderSuccess(true);
        setPreorderName('');
        setPreorderPhone('');
        setTimeout(() => {
          setPreorderSuccess(false);
          setShowPreorderForm(false);
        }, 4000);
      }
    } catch (err) {
      console.error('Preorder error:', err);
    }
    setPreorderSubmitting(false);
  };

  const handleReviewSubmit = async () => {
    if (!reviewName.trim()) return;
    setReviewSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        product_id: product.id,
        customer_name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
        is_hidden: false,
        is_approved: true,
      });
      if (!error) {
        setReviewSuccess(true);
        setReviewName('');
        setReviewComment('');
        setReviewRating(5);
        fetchReviews();
        setTimeout(() => {
          setReviewSuccess(false);
          setShowReviewForm(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Review submit error:', err);
    }
    setReviewSubmitting(false);
  };

  const productDescription = product.description || `${product.name} diproduksi dengan material berkualitas tinggi dan standar produksi yang ketat, memastikan setiap detail sempurna untuk kemasan bisnis Anda.`;
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);
  if (relatedProducts.length < 5) {
    relatedProducts.push(...products.filter(p => p.id !== product.id && !relatedProducts.find(rp => rp.id === p.id)).slice(0, 5 - relatedProducts.length));
  }

  // Calculate dummy original price for the strikethrough effect
  const originalPrice = Math.floor(currentPrice * 1.3);

  // Review stats
  const avgAdjustedRating = calculateAverageRating(reviews, true);
  const ratingDist = getRatingDistribution(reviews, true);
  const maxDistCount = Math.max(...Object.values(ratingDist), 1);

  return (
    <>
      <Navbar />
      
      {/* Toast Notification */}
      {showAddedNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-black text-white shadow-xl rounded px-6 py-3 flex items-center gap-4 transition-all animate-fade-in-down">
          <p className="text-sm">{product.name} added to cart.</p>
          <Link to="/Cart" className="text-xs font-bold underline">View Cart</Link>
        </div>
      )}

      {/* Main Content Start */}
      <div className="min-h-screen bg-white pt-24 pb-16 font-sans">
        
        {/* Breadcrumbs */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <Link to="/" className="hover:text-gray-900 transition-colors">Homepage</Link>
            <span>&gt;</span>
            <Link to="/Shop" className="hover:text-gray-900 transition-colors">Packaging</Link>
            <span>&gt;</span>
            <Link to={`/Shop?category=${product.category}`} className="hover:text-gray-900 transition-colors">{product.category}</Link>
            <span>&gt;</span>
            <span className="text-gray-900 truncate max-w-[200px] md:max-w-none">{product.name}</span>
          </nav>
        </div>

        {/* Product Layout */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">
            
            {/* Left: Images */}
            <div className="w-full lg:w-[50%] flex-shrink-0 relative">
              <div className="relative bg-[#f6f6f6] rounded-lg aspect-[4/5] md:aspect-square flex items-center justify-center p-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                
                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors text-gray-600">
                    <Share className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors text-gray-600">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Removed Thumbnails as requested */}
            </div>

            {/* Right: Details */}
            <div className="w-full lg:w-[50%] lg:pt-4">
              <p className="text-xs text-gray-500 font-medium tracking-wide">Printwork Packaging</p>
              <h1 className="text-2xl md:text-[32px] font-bold text-gray-900 mt-2 mb-4 leading-snug">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 line-through text-lg font-medium">Rp {originalPrice.toLocaleString('id-ID')}</span>
                  <span className="text-3xl font-bold text-gray-900 tracking-tight">Rp {currentPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Stock Badge */}
              {!stockLoading && variantStock !== null && (
                <div className="mb-4">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Out of Stock — {selectedSize}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Ready Stock: {variantStock.toLocaleString()} pcs — {selectedSize}
                    </span>
                  )}
                </div>
              )}

              {/* Description (Moved up as requested by design) */}
              <div className="mb-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description:</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {productDescription}
                </p>
              </div>

              {/* Combinations / Variants Block */}
              <div className="mb-8 space-y-6">
                
                {/* Materials / Prints */}
                {product.materials && (
                  <div>
                    <h3 className="flex items-center text-sm mb-3">
                      <span className="text-gray-500 mr-2">Material:</span> 
                      <span className="font-semibold text-gray-900">{selectedMaterial}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.materials.map(mat => (
                        <button
                          key={mat}
                          onClick={() => setSelectedMaterial(mat)}
                          className={`px-4 py-2 border rounded-md text-xs font-medium transition-all ${
                            selectedMaterial === mat ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {mat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prints */}
                {product.prints && (
                  <div>
                    <h3 className="flex items-center text-sm mb-3">
                      <span className="text-gray-500 mr-2">Cetak / Warna:</span> 
                      <span className="font-semibold text-gray-900">{selectedPrint}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.prints.map(print => (
                        <button
                          key={print}
                          onClick={() => setSelectedPrint(print)}
                          className={`px-4 py-2 border rounded-md text-xs font-medium transition-all ${
                            selectedPrint === print ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {print}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Laminasi */}
                {product.laminasi && (
                  <div>
                    <h3 className="flex items-center text-sm mb-3">
                      <span className="text-gray-500 mr-2">Laminasi:</span> 
                      <span className="font-semibold text-gray-900">{selectedLaminasi}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.laminasi.map(lam => (
                        <button
                          key={lam}
                          onClick={() => setSelectedLaminasi(lam)}
                          className={`px-4 py-2 border rounded-md text-xs font-medium transition-all ${
                            selectedLaminasi === lam ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {lam}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="flex items-center text-sm">
                        <span className="text-gray-500 mr-2">Size:</span> 
                        <span className="font-semibold text-gray-900">{selectedSize.split('(')[0].trim()}</span>
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => {
                        const shortName = size.split('(')[0].trim();
                        return (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 xl:px-5 py-2.5 border rounded-md text-sm font-medium transition-all min-w-[3rem] ${
                              selectedSize === size ? 'border-gray-900 shadow-[0_0_0_1px_#111827]' : 'border-gray-200 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                            }`}
                          >
                            {shortName}
                          </button>
                        );
                      })}
                    </div>
                    {/* Small preview of full size desc */}
                    {selectedSize.includes('(') && (
                      <p className="text-[11px] text-gray-400 mt-2">{selectedSize.split('(')[1].replace(')', '')}</p>
                    )}
                  </div>
                )}
                
                {/* Quantity */}
                <div>
                  <h3 className="flex items-center text-sm mb-3">
                    <span className="text-gray-500 mr-2">Quantity:</span> 
                    <span className="font-semibold text-gray-900">{quantity} Pcs</span>
                  </h3>
                  <div className="inline-flex items-center border border-gray-200 rounded-md bg-white h-11 w-40">
                    <button 
                      onClick={() => setQuantity(Math.max(500, quantity - 500))} 
                      className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-l-md"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 flex items-center justify-center border-x border-gray-200 h-full">
                      <span className="text-sm font-semibold text-gray-900">{quantity}</span>
                    </div>
                    <button 
                      onClick={() => setQuantity(quantity + 500)} 
                      className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-r-md"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
              
              {/* CTA Buttons — Switch between normal and pre-order */}
              {isOutOfStock ? (
                <>
                  {/* Pre-Order Button */}
                  {!showPreorderForm ? (
                    <button
                      onClick={() => setShowPreorderForm(true)}
                      className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 mb-4"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Pre-Order — Kami Kabari Saat Stok Ready
                    </button>
                  ) : preorderSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4 text-center">
                      <p className="text-emerald-700 font-semibold text-sm">✅ Pre-order Anda tercatat!</p>
                      <p className="text-emerald-600 text-xs mt-1">Kami akan menghubungi Anda via WhatsApp ketika stok ready.</p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-5 mb-4 space-y-3">
                      <h4 className="text-sm font-bold text-orange-900">📋 Form Pre-Order</h4>
                      <p className="text-xs text-orange-700">Isi data di bawah, kami akan menghubungi Anda saat stok tersedia kembali.</p>
                      <input
                        value={preorderName}
                        onChange={e => setPreorderName(e.target.value)}
                        placeholder="Nama Anda"
                        className="w-full px-4 py-2.5 bg-white rounded-lg border border-orange-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                      <input
                        value={preorderPhone}
                        onChange={e => setPreorderPhone(e.target.value)}
                        placeholder="No. WhatsApp (08xxx atau 628xxx)"
                        className="w-full px-4 py-2.5 bg-white rounded-lg border border-orange-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setShowPreorderForm(false)} className="flex-1 py-2.5 text-orange-500 font-bold text-xs rounded-lg hover:bg-orange-100 transition-colors">
                          Batal
                        </button>
                        <button
                          onClick={handlePreorder}
                          disabled={preorderSubmitting || !preorderName.trim() || !preorderPhone.trim()}
                          className="flex-1 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                          {preorderSubmitting ? 'Mengirim...' : 'Kirim Pre-Order'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    disabled={isProcessing}
                    className="flex-1 h-12 bg-[#111] text-white font-medium text-sm rounded-md hover:bg-black transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Add To Cart'}
                  </button>
                  <button
                    onClick={handleCheckoutNow}
                    disabled={isProcessing}
                    className="flex-1 h-12 bg-white text-gray-900 border border-gray-300 font-medium text-sm rounded-md hover:bg-gray-50 transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {isProcessing ? 'Redirecting to Payment...' : 'Checkout Now'}
                  </button>
                </div>
              )}

              {/* Delivery info */}
              <div className="pt-6 border-t border-gray-100 border-dashed">
                <Link to="#" className="text-xs text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors">
                  Delivery T&C
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* ─── REVIEWS SECTION ─── */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="border-t border-gray-100 pt-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
                <div className="flex items-center gap-3 mt-2">
                  {reviews.length > 0 ? (
                    <>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgAdjustedRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{avgAdjustedRating}</span>
                      <span className="text-xs text-gray-400">({reviews.length} reviews)</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">Belum ada review</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-all"
              >
                Tulis Review
              </button>
            </div>

            {/* Rating Distribution */}
            {reviews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-10">
                <div className="space-y-1.5">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 w-3">{star}</span>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${(ratingDist[star] / maxDistCount) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 w-4 text-right">{ratingDist[star]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-8">
                {reviewSuccess ? (
                  <div className="text-center py-4">
                    <p className="text-emerald-600 font-semibold text-sm">✅ Terima kasih atas review Anda!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900">Tulis Review Anda</h4>
                    
                    {/* Star selector */}
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-2">Rating</label>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} onClick={() => setReviewRating(s)} className="p-0.5">
                            <Star className={`w-6 h-6 transition-colors ${s <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 hover:text-amber-200'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1.5">Nama</label>
                      <input
                        value={reviewName}
                        onChange={e => setReviewName(e.target.value)}
                        placeholder="Nama Anda"
                        className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1.5">Komentar (opsional)</label>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="Ceritakan pengalaman Anda..."
                        rows={3}
                        className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setShowReviewForm(false)} className="flex-1 py-2.5 text-gray-500 font-medium text-xs hover:text-gray-900 transition-colors">
                        Batal
                      </button>
                      <button
                        onClick={handleReviewSubmit}
                        disabled={reviewSubmitting || !reviewName.trim()}
                        className="flex-1 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-lg hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Send className="w-3 h-3" />
                        {reviewSubmitting ? 'Mengirim...' : 'Kirim Review'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Review List */}
            {reviewsLoading ? (
              <div className="space-y-4">
                {[1,2].map(i => (
                  <div key={i} className="animate-pulse border-b border-gray-50 pb-6">
                    <div className="h-3 w-24 bg-gray-100 rounded mb-2" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Belum ada review untuk produk ini.</p>
                <p className="text-gray-300 text-xs mt-1">Jadilah yang pertama memberikan review!</p>
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-gray-50">
                {reviews.slice(0, 10).map((review) => (
                  <div key={review.id} className="py-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                          {(review.customer_name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{review.customer_name}</p>
                          <p className="text-[10px] text-gray-400">
                            {new Date(review.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= adjustRating(review.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600 leading-relaxed ml-11">{review.comment}</p>
                    )}
                    {review.admin_reply && (
                      <div className="ml-11 mt-3 bg-gray-50 border border-gray-100 rounded-lg p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Balasan Printwork</p>
                        <p className="text-xs text-gray-600">{review.admin_reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
