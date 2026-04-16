import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Search, Eye, EyeOff, MessageSquare, Send, ChevronDown, ChevronUp,
  Filter, ThumbsUp, ThumbsDown, Copy, BarChart3, Trash2
} from 'lucide-react';
import { useReviews } from '../../hooks/useSupabaseData';
import { adjustRating, calculateAverageRating, getRatingDistribution, getSentimentLabel } from '../../utils/reviewHelpers';
import { products as allProducts } from '../../data/products';

const FILTER_TABS = [
  { id: 'all', label: 'Semua' },
  { id: 'need-reply', label: 'Need Reply' },
  { id: 'negative', label: 'Negatif (<4⭐)' },
  { id: 'hidden', label: 'Ghosted' },
];

const REPLY_TEMPLATES = [
  { label: '🙏 Terima Kasih', text: 'Terima kasih banyak atas review-nya, Kak! Senang bisa melayani. Semoga packaging-nya cocok dan bisa order lagi ya! 😊' },
  { label: '🙇 Mohon Maaf', text: 'Mohon maaf atas ketidaknyamanannya, Kak. Kami akan lebih baik lagi ke depannya. Jika ada keluhan, silakan hubungi kami via WhatsApp ya. Terima kasih atas masukannya! 🙏' },
  { label: '📦 Follow Up', text: 'Halo Kak! Terima kasih sudah order di Printwork. Untuk order selanjutnya, kami bisa kasih harga spesial lho. Jangan ragu hubungi kami ya! 😊' },
];

export default function Reviews() {
  const { reviews, loading, toggleHidden, submitReply, remove } = useReviews();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus review ini secara permanen dari database?')) return;
    const result = await remove(id);
    if (result && !result.success) {
      alert('Gagal menghapus review: ' + (result.error?.message || 'Unknown error'));
    }
  };

  // Overall stats
  const overallStats = useMemo(() => {
    const avgReal = calculateAverageRating(reviews, false);
    const avgAdjusted = calculateAverageRating(reviews, true);
    const totalReviews = reviews.length;
    const hidden = reviews.filter(r => r.is_hidden).length;
    const needReply = reviews.filter(r => !r.admin_reply && !r.is_hidden).length;
    const negative = reviews.filter(r => r.rating < 4).length;
    const distReal = getRatingDistribution(reviews, false);
    const distAdjusted = getRatingDistribution(reviews, true);
    const sentiment = getSentimentLabel(avgAdjusted);
    return { avgReal, avgAdjusted, totalReviews, hidden, needReply, negative, distReal, distAdjusted, sentiment };
  }, [reviews]);

  // Group by product
  const groupedReviews = useMemo(() => {
    let data = reviews;

    if (filterTab === 'need-reply') data = data.filter(r => !r.admin_reply && !r.is_hidden);
    if (filterTab === 'negative') data = data.filter(r => r.rating < 4);
    if (filterTab === 'hidden') data = data.filter(r => r.is_hidden);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(r =>
        (r.customer_name || '').toLowerCase().includes(q) ||
        (r.comment || '').toLowerCase().includes(q)
      );
    }

    const groups = {};
    data.forEach(review => {
      const key = review.product_id;
      if (!groups[key]) {
        const product = allProducts.find(p => p.id === key);
        groups[key] = {
          product_id: key,
          product_name: product?.name || `Product #${key}`,
          reviews: [],
        };
      }
      groups[key].reviews.push(review);
    });
    return Object.values(groups).sort((a, b) => b.reviews.length - a.reviews.length);
  }, [reviews, filterTab, searchQuery]);

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return;
    await submitReply(reviewId, replyText);
    setReplyingTo(null);
    setReplyText('');
  };

  const StarDisplay = ({ rating, size = 14, className = '' }) => (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={size} className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header>
        <h2 className="text-3xl font-display font-bold text-navy-900">Review Management</h2>
        <p className="text-slate-400 font-jost text-sm">Kelola review pelanggan dengan sistem rating "licik".</p>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
          <p className="text-2xl font-display font-bold text-navy-900">{overallStats.totalReviews}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Total Reviews</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs text-slate-400 line-through">{overallStats.avgReal}</span>
            <span className="text-2xl font-display font-bold text-amber-500">{overallStats.avgAdjusted}</span>
            <Star size={16} className="text-amber-400 fill-amber-400" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Frontend Rating</p>
        </div>
        <div className={`bg-white rounded-2xl p-5 border border-slate-100 text-center ${overallStats.needReply > 0 ? 'ring-2 ring-blue-200' : ''}`}>
          <p className="text-2xl font-display font-bold text-blue-600">{overallStats.needReply}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Need Reply</p>
        </div>
        <div className={`rounded-2xl p-5 border text-center ${overallStats.sentiment.color.replace('text-', 'bg-').replace('600', '50')} border-slate-100`}>
          <p className={`text-lg font-display font-bold ${overallStats.sentiment.color}`}>{overallStats.sentiment.label}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Sentiment</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h4 className="text-sm font-display font-bold text-navy-900 mb-4 flex items-center gap-2">
          <BarChart3 size={14} /> Rating Distribution
          <span className="text-[9px] text-slate-400 font-normal">(Real → Frontend)</span>
        </h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(star => {
            const realCount = overallStats.distReal[star] || 0;
            const adjCount = overallStats.distAdjusted[star] || 0;
            const maxCount = Math.max(...Object.values(overallStats.distAdjusted), 1);
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs font-bold text-navy-700 w-4">{star}</span>
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <div className="flex-1 h-5 bg-slate-50 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-amber-400/30 rounded-full transition-all duration-500"
                    style={{ width: `${(adjCount / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 w-16 text-right font-mono">
                  {realCount}→{adjCount}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-100">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                filterTab === tab.id ? 'bg-navy-900 text-white shadow' : 'text-slate-400 hover:text-navy-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            placeholder="Cari review..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
          />
        </div>
      </div>

      {/* Reviews by Product */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100"><div className="h-4 bg-slate-100 rounded w-1/3" /></div>)}</div>
      ) : groupedReviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
          <Star className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Belum ada review.</p>
          <p className="text-slate-300 text-xs mt-1">Review akan muncul setelah customer mengirimkan feedback.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {groupedReviews.map((group, idx) => {
            const groupAvgReal = calculateAverageRating(group.reviews, false);
            const groupAvgAdj = calculateAverageRating(group.reviews, true);
            const isExpanded = expandedProduct === group.product_id;

            return (
              <motion.div
                key={group.product_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
              >
                {/* Product header */}
                <button
                  onClick={() => setExpandedProduct(isExpanded ? null : group.product_id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-semibold text-navy-900 truncate max-w-[400px]">{group.product_name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400">{group.reviews.length} reviews</span>
                        <span className="text-[10px] text-slate-300">|</span>
                        <span className="text-[10px] text-slate-400">Real: {groupAvgReal}⭐</span>
                        <span className="text-[10px] text-amber-600 font-bold">Frontend: {groupAvgAdj}⭐</span>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>

                {/* Reviews */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-50"
                    >
                      <div className="p-4 space-y-3 bg-slate-50/30">
                        {group.reviews.map(review => (
                          <div key={review.id} className={`bg-white rounded-xl p-4 border ${review.is_hidden ? 'border-red-100 opacity-60' : 'border-slate-100'}`}>
                            {/* Review header */}
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="text-xs font-semibold text-navy-900">{review.customer_name}</span>
                                <span className="text-[10px] text-slate-300 ml-2">
                                  {new Date(review.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Rating comparison */}
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                                  <span className="text-[9px] text-slate-400">Real:</span>
                                  <StarDisplay rating={review.rating} size={10} />
                                  <span className="text-[10px] text-slate-300 mx-0.5">→</span>
                                  <span className="text-[9px] text-amber-600 font-bold">Frontend:</span>
                                  <StarDisplay rating={adjustRating(review.rating)} size={10} />
                                </div>

                                {/* Toggle visibility */}
                                <button
                                  onClick={() => toggleHidden(review.id)}
                                  className={`p-1.5 rounded-lg transition-colors ${review.is_hidden ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:text-navy-900'}`}
                                  title={review.is_hidden ? 'Unhide' : 'Ghost/Hide'}
                                >
                                  {review.is_hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                                </button>
                                <button
                                  onClick={() => handleDelete(review.id)}
                                  className="p-1.5 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                                  title="Hapus Permanen"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Comment */}
                            <p className="text-xs text-slate-600 leading-relaxed mb-3">{review.comment || <span className="text-slate-300 italic">Tidak ada komentar</span>}</p>

                            {/* Admin reply */}
                            {review.admin_reply && (
                              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 mb-2">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 block mb-1">Reply dari Admin</span>
                                <p className="text-xs text-blue-800">{review.admin_reply}</p>
                              </div>
                            )}

                            {/* Reply action */}
                            {replyingTo === review.id ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setShowTemplates(!showTemplates)}
                                    className="text-[10px] text-blue-500 hover:text-blue-700 font-bold flex items-center gap-1"
                                  >
                                    <Copy size={10} /> Template
                                  </button>
                                </div>
                                {showTemplates && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {REPLY_TEMPLATES.map((t, i) => (
                                      <button
                                        key={i}
                                        onClick={() => { setReplyText(t.text); setShowTemplates(false); }}
                                        className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-semibold hover:bg-blue-100 transition-colors"
                                      >
                                        {t.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <textarea
                                    autoFocus
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900/10 resize-none"
                                    rows={2}
                                    placeholder="Ketik balasan..."
                                  />
                                  <div className="flex flex-col gap-1">
                                    <button onClick={() => handleReply(review.id)} className="p-2 bg-navy-900 text-white rounded-lg hover:bg-black transition-colors">
                                      <Send size={12} />
                                    </button>
                                    <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="p-2 text-slate-400 hover:text-red-500 rounded-lg">
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              !review.admin_reply && !review.is_hidden && (
                                <button
                                  onClick={() => setReplyingTo(review.id)}
                                  className="flex items-center gap-1.5 text-[10px] text-blue-500 hover:text-blue-700 font-bold transition-colors"
                                >
                                  <MessageSquare size={10} /> Balas Review
                                </button>
                              )
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
