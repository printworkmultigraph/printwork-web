import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Search, Plus, Minus, RefreshCw, Phone, AlertTriangle,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, Bell, Save, Image, Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { products as allProducts } from '../../data/products';

const TABS = [
  { id: 'stock', label: 'Stok Produk', icon: Package },
  { id: 'preorder', label: 'Pre-Order Queue', icon: Bell },
];

export default function Inventory({ formatCurrency }) {
  const [activeTab, setActiveTab] = useState('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStock, setFilterStock] = useState('all');
  
  // Inventory from Supabase (keyed by product_id + variant_key)
  const [inventoryMap, setInventoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  
  // Pre-orders
  const [preorders, setPreorders] = useState([]);
  const [poLoading, setPoLoading] = useState(true);
  
  // Expanded products
  const [expandedProduct, setExpandedProduct] = useState(null);
  
  // Editing state
  const [editingStock, setEditingStock] = useState(null);
  const [stockValue, setStockValue] = useState('');

  // Fetch all inventory
  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('inventory').select('*');
    if (!error && data) {
      const map = {};
      data.forEach(item => {
        map[`${item.product_id}_${item.variant_key}`] = item;
      });
      setInventoryMap(map);
    }
    setLoading(false);
  };

  // Fetch pre-orders
  const fetchPreorders = async () => {
    setPoLoading(true);
    const { data } = await supabase.from('preorders').select('*').order('created_at', { ascending: false });
    setPreorders(data || []);
    setPoLoading(false);
  };

  useEffect(() => {
    fetchInventory();
    fetchPreorders();
  }, []);

  // Get stock for a product variant
  const getStock = (productId, variantKey) => {
    const key = `${productId}_${variantKey}`;
    return inventoryMap[key]?.stock ?? null;
  };

  const getInventoryId = (productId, variantKey) => {
    const key = `${productId}_${variantKey}`;
    return inventoryMap[key]?.id ?? null;
  };

  // Save stock — upsert into Supabase
  const saveStock = async (productId, productName, variantKey, newStock) => {
    const saveKey = `${productId}_${variantKey}`;
    setSaving(prev => ({ ...prev, [saveKey]: true }));
    
    try {
      const { data, error } = await supabase.from('inventory').upsert({
        product_id: productId,
        product_name: productName,
        variant_key: variantKey,
        stock: newStock,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'product_id, variant_key' 
      }).select();

      if (error) throw error;

      // Update local state with fresh data from DB
      if (data && data[0]) {
        setInventoryMap(prev => ({
          ...prev,
          [saveKey]: data[0]
        }));
      }
    } catch (err) {
      console.error('Error saving stock:', err);
      alert('Gagal menyimpan stok. Silakan coba lagi.');
    } finally {
      setSaving(prev => ({ ...prev, [saveKey]: false }));
      setEditingStock(null);
    }
  };

  const quickAdjust = async (productId, productName, variantKey, delta) => {
    const currentStock = getStock(productId, variantKey) || 0;
    const newStock = Math.max(0, currentStock + delta);
    await saveStock(productId, productName, variantKey, newStock);
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    let data = [...allProducts];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    
    if (filterStock === 'in-stock') {
      data = data.filter(p => {
        const variants = p.sizes || ['Default'];
        return variants.some(v => (getStock(p.id, v) || 0) > 0);
      });
    }
    if (filterStock === 'out') {
      data = data.filter(p => {
        const variants = p.sizes || ['Default'];
        return variants.every(v => (getStock(p.id, v) || 0) === 0);
      });
    }
    if (filterStock === 'has-stock') {
      data = data.filter(p => {
        const variants = p.sizes || ['Default'];
        return variants.some(v => getStock(p.id, v) !== null);
      });
    }
    
    return data;
  }, [allProducts, searchQuery, filterStock, inventoryMap]);

  // Stats
  const stats = useMemo(() => {
    let totalVariants = 0;
    let inStock = 0;
    let outOfStock = 0;
    let noData = 0;
    
    allProducts.forEach(p => {
      const variants = p.sizes || ['Default'];
      variants.forEach(v => {
        totalVariants++;
        const stock = getStock(p.id, v);
        if (stock === null) noData++;
        else if (stock === 0) outOfStock++;
        else inStock++;
      });
    });
    
    return { totalProducts: allProducts.length, totalVariants, inStock, outOfStock, noData };
  }, [inventoryMap]);

  // Pre-order stats
  const poStats = useMemo(() => {
    const waiting = preorders.filter(p => p.status === 'pending').length;
    const contacted = preorders.filter(p => p.status === 'contacted').length;
    const fulfilled = preorders.filter(p => p.status === 'fulfilled').length;
    return { waiting, contacted, fulfilled };
  }, [preorders]);

  const getStockStatus = (stock) => {
    if (stock === null) return { label: 'Belum diisi', color: 'bg-slate-50 text-slate-400 border-slate-200', dot: 'bg-slate-300' };
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };
    if (stock <= 50) return { label: 'Low Stock', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    return { label: 'In Stock', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
  };

  const PO_STATUS_OPTIONS = [
    { value: 'pending', label: 'Waiting', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'contacted', label: 'Contacted', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'fulfilled', label: 'Fulfilled', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  const updatePOStatus = async (id, status) => {
    await supabase.from('preorders').update({ status }).eq('id', id);
    setPreorders(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const openWhatsApp = (phone, name, productName) => {
    const message = `Halo Kak ${name},\n\nKabar baik! Stok ${productName} sudah ready lagi di Printwork. Karena kakak sudah pre-order duluan, kakak bisa langsung order sekarang ya.\n\nTerima kasih sudah menunggu! 🙏`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDeletePreorder = async (id) => {
    if (!window.confirm('Hapus pre-order ini secara permanen dari database?')) return;
    try {
      const { error } = await supabase.from('preorders').delete().eq('id', id);
      if (error) throw error;
      setPreorders(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting preorder:', err);
      alert('Gagal menghapus pre-order: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy-900">Inventory Management</h2>
          <p className="text-slate-400 font-jost text-sm">Kelola stok semua {allProducts.length} produk. Klik produk untuk isi stok per varian.</p>
        </div>
        <button
          onClick={fetchInventory}
          className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:bg-white hover:shadow-lg rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id ? 'bg-navy-900 text-white shadow-lg' : 'text-slate-400 hover:text-navy-900'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.id === 'preorder' && poStats.waiting > 0 && (
              <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{poStats.waiting}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'stock' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Produk', value: stats.totalProducts, color: 'bg-slate-50 text-slate-700' },
              { label: 'Stok Terisi', value: stats.inStock, color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Out of Stock', value: stats.outOfStock, color: stats.outOfStock > 0 ? 'bg-red-50 text-red-700 ring-2 ring-red-200' : 'bg-slate-50 text-slate-400' },
              { label: 'Belum Diisi', value: stats.noData, color: stats.noData > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-400' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.color} rounded-2xl p-4 text-center`}>
                <p className="text-2xl font-display font-bold">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
              />
            </div>
            <select
              value={filterStock}
              onChange={e => setFilterStock(e.target.value)}
              className="px-4 py-3 bg-white rounded-xl text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-900/10 font-semibold"
            >
              <option value="all">Semua Produk ({allProducts.length})</option>
              <option value="in-stock">✅ Ada Stok</option>
              <option value="out">❌ Out of Stock</option>
              <option value="has-stock">📦 Sudah Diisi</option>
            </select>
          </div>

          {/* Product Cards with Images */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-slate-100 flex gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-xl shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((product, idx) => {
                const variants = product.sizes || ['Default'];
                const isExpanded = expandedProduct === product.id;
                
                // Overall stock status for this product
                const allStocks = variants.map(v => getStock(product.id, v));
                const hasAnyStock = allStocks.some(s => s !== null && s > 0);
                const allFilled = allStocks.every(s => s !== null);
                const anyOutOfStock = allStocks.some(s => s === 0);

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Product Card Header — with image */}
                    <button
                      onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors text-left"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-slate-50 rounded-xl shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-300"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>'; }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-navy-900 truncate">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{product.category}</span>
                          <span className="text-[10px] text-slate-400">{variants.length} varian</span>
                        </div>
                      </div>

                      {/* Stock Summary Dots */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex gap-1">
                          {variants.map(v => {
                            const stock = getStock(product.id, v);
                            const status = getStockStatus(stock);
                            return (
                              <div 
                                key={v} 
                                className={`w-3 h-3 rounded-full ${status.dot} transition-colors`} 
                                title={`${v}: ${stock !== null ? stock : 'belum diisi'}`} 
                              />
                            );
                          })}
                        </div>
                        {!allFilled && (
                          <span className="text-[9px] text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full">Perlu diisi</span>
                        )}
                        {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                      </div>
                    </button>

                    {/* Expanded Variant Stock Controls */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-slate-50"
                        >
                          <div className="p-4 space-y-2 bg-slate-50/30">
                            {/* Price info */}
                            <div className="flex items-center gap-3 mb-3 px-2">
                              <span className="text-[10px] text-slate-400">Harga mulai:</span>
                              <span className="text-xs font-bold text-navy-900">{formatCurrency(product.price)}</span>
                              <span className="text-[10px] text-slate-400">|</span>
                              <span className="text-[10px] text-slate-400">Min Order: {product.minOrder || 500} pcs</span>
                            </div>

                            {variants.map(variant => {
                              const stock = getStock(product.id, variant);
                              const status = getStockStatus(stock);
                              const isEditing = editingStock === `${product.id}_${variant}`;
                              const isSaving = saving[`${product.id}_${variant}`];

                              // Extract short label if it follows "Size (Dimensions)" format
                              const shortLabel = variant.includes('(') ? variant.split('(')[0].trim() : variant;

                              return (
                                <div key={variant} className="flex items-center justify-between bg-white rounded-xl p-4 border border-slate-100">
                                  <div className="flex-1">
                                    <p className="text-xs font-semibold text-navy-700">{shortLabel}</p>
                                    <p className="text-[9px] text-slate-400 truncate max-w-[150px] md:max-w-none" title={variant}>
                                      {variant.includes('(') ? variant.substring(variant.indexOf('(')) : variant}
                                    </p>
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${status.color}`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                      {status.label}{stock !== null ? ` — ${stock.toLocaleString()} pcs` : ''}
                                    </span>
                                  </div>

                                  {/* Stock Controls */}
                                  <div className="flex items-center gap-2">
                                    {/* Minus button */}
                                    <button
                                      onClick={() => quickAdjust(product.id, product.name, variant, -100)}
                                      disabled={isSaving || (stock || 0) <= 0}
                                      className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-30"
                                    >
                                      <Minus size={14} />
                                    </button>

                                    {/* Stock input */}
                                    {isEditing ? (
                                      <div className="flex items-center gap-1">
                                        <input
                                          autoFocus
                                          value={stockValue}
                                          onChange={e => setStockValue(e.target.value)}
                                          onKeyDown={e => { 
                                            if (e.key === 'Enter') saveStock(product.id, product.name, variant, parseInt(stockValue, 10) || 0);
                                            if (e.key === 'Escape') setEditingStock(null);
                                          }}
                                          className="w-20 text-center px-2 py-2 text-sm font-bold bg-white border-2 border-navy-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/20"
                                          placeholder="0"
                                        />
                                        <button
                                          onClick={() => saveStock(product.id, product.name, variant, parseInt(stockValue, 10) || 0)}
                                          className="w-8 h-8 bg-navy-900 text-white rounded-lg flex items-center justify-center hover:bg-black transition-colors"
                                        >
                                          <Save size={12} />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => { 
                                          setEditingStock(`${product.id}_${variant}`); 
                                          setStockValue(String(stock || 0)); 
                                        }}
                                        className={`w-24 text-center px-3 py-2 text-sm font-bold rounded-lg transition-colors cursor-text border ${
                                          stock === null 
                                            ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100' 
                                            : 'bg-slate-50 border-slate-200 text-navy-900 hover:bg-slate-100'
                                        }`}
                                      >
                                        {stock !== null ? stock.toLocaleString() : 'Isi Stok'}
                                      </button>
                                    )}

                                    {/* Plus button */}
                                    <button
                                      onClick={() => quickAdjust(product.id, product.name, variant, 100)}
                                      disabled={isSaving}
                                      className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center hover:bg-emerald-100 transition-colors disabled:opacity-30"
                                    >
                                      <Plus size={14} />
                                    </button>

                                    {/* Saving indicator */}
                                    {isSaving && <RefreshCw size={14} className="animate-spin text-navy-400" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ─── PRE-ORDER QUEUE ─── */}
      {activeTab === 'preorder' && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Waiting', value: poStats.waiting, color: 'bg-amber-50 text-amber-700' },
              { label: 'Contacted', value: poStats.contacted, color: 'bg-blue-50 text-blue-700' },
              { label: 'Fulfilled', value: poStats.fulfilled, color: 'bg-emerald-50 text-emerald-700' },
            ].map(s => (
              <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
                <p className="text-2xl font-display font-bold">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {poLoading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100"><div className="h-4 bg-slate-100 rounded w-1/3" /></div>)}</div>
          ) : preorders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
              <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">Belum ada pre-order.</p>
              <p className="text-slate-300 text-xs mt-1">Pre-order muncul otomatis saat customer pesan produk out of stock.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Customer</th>
                      <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Produk</th>
                      <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Varian</th>
                      <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Qty</th>
                      <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Tanggal</th>
                      <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                      <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preorders.map((po, i) => {
                      const statusConfig = PO_STATUS_OPTIONS.find(s => s.value === po.status) || PO_STATUS_OPTIONS[0];
                      return (
                        <motion.tr
                          key={po.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <span className="font-semibold text-navy-900 text-xs block">{po.customer_name}</span>
                            <span className="text-[10px] text-slate-400">{po.customer_phone}</span>
                          </td>
                          <td className="py-4 px-4 text-xs text-navy-700 max-w-[200px] truncate">{po.product_name}</td>
                          <td className="py-4 px-4 text-xs text-slate-500">{po.variant_key || '-'}</td>
                          <td className="py-4 px-4 text-xs font-semibold text-navy-900">{po.qty || 1}</td>
                          <td className="py-4 px-4 text-[10px] text-slate-400">
                            {new Date(po.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-4 px-4">
                            <select
                                value={po.status || 'pending'}
                                onChange={e => updatePOStatus(po.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold border cursor-pointer focus:outline-none ${statusConfig.color}`}
                              >
                                {PO_STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                              </select>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openWhatsApp(po.customer_phone, po.customer_name, po.product_name)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                              >
                                <Phone size={10} /> WA
                              </button>
                              <button
                                onClick={() => handleDeletePreorder(po.id)}
                                className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                title="Hapus Pre-order"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
