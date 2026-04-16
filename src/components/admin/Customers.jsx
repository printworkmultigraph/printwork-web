import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Search, Phone, Trash2, Edit3, Check, X, ChevronDown,
  MessageSquare, AlertTriangle, Download, Filter, Crown, ShieldAlert, User2, Tag
} from 'lucide-react';
import { useCustomers } from '../../hooks/useSupabaseData';

const STATUS_OPTIONS = [
  { value: 'Komunikasi', label: 'Komunikasi', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '💬' },
  { value: 'In-going', label: 'In-going', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '⚙️' },
  { value: 'Done', label: 'Done', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✅' },
  { value: 'Closed', label: 'Closed', color: 'bg-red-50 text-red-600 border-red-200', icon: '❌' },
];

const TAG_OPTIONS = [
  { value: 'Regular', label: 'Regular', color: 'bg-slate-50 text-slate-600', icon: <User2 size={12} /> },
  { value: 'VIP', label: 'VIP', color: 'bg-purple-50 text-purple-700', icon: <Crown size={12} /> },
  { value: 'Reseller', label: 'Reseller', color: 'bg-cyan-50 text-cyan-700', icon: <Tag size={12} /> },
  { value: 'Red Flag', label: 'Red Flag 🚩', color: 'bg-red-50 text-red-700', icon: <ShieldAlert size={12} /> },
];

export default function Customers({ formatCurrency }) {
  const { customers, loading, upsert, remove, updateField } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCell, setEditingCell] = useState(null); // { id, field }
  const [editValue, setEditValue] = useState('');
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', product_type: '', demand: '', notes: '', status: 'Komunikasi', tag: 'Regular' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Stats
  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter(c => c.status === 'In-going' || c.status === 'Komunikasi').length;
    const done = customers.filter(c => c.status === 'Done').length;
    const closed = customers.filter(c => c.status === 'Closed').length;
    // Urgency: in Komunikasi for more than 3 days
    const now = new Date();
    const urgent = customers.filter(c => {
      if (c.status !== 'Komunikasi') return false;
      const updated = new Date(c.updated_at || c.created_at);
      return (now - updated) > 3 * 24 * 60 * 60 * 1000;
    }).length;
    return { total, active, done, closed, urgent };
  }, [customers]);

  // Filtered
  const filtered = useMemo(() => {
    let data = customers;
    if (filterStatus !== 'all') data = data.filter(c => c.status === filterStatus);
    if (filterTag !== 'all') data = data.filter(c => c.tag === filterTag);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q) ||
        (c.product_type || '').toLowerCase().includes(q) ||
        (c.demand || '').toLowerCase().includes(q)
      );
    }
    return data;
  }, [customers, filterStatus, filterTag, searchQuery]);

  const startEdit = (id, field, currentValue) => {
    setEditingCell({ id, field });
    setEditValue(currentValue || '');
  };

  const saveEdit = async () => {
    if (editingCell) {
      await updateField(editingCell.id, editingCell.field, editValue);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim()) return;
    await upsert(newCustomer);
    setNewCustomer({ name: '', phone: '', product_type: '', demand: '', notes: '', status: 'Komunikasi', tag: 'Regular' });
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    const result = await remove(id);
    if (result && !result.success) {
      alert('Gagal menghapus dari database: ' + (result.error?.message || 'Unknown error'));
    }
    setDeleteConfirm(null);
  };

  const exportCSV = () => {
    const headers = ['Nama', 'Telepon', 'Tag', 'Status', 'Tipe Produk', 'Demand', 'Notes', 'Tanggal'];
    const rows = customers.map(c => [
      c.name, c.phone || '', c.tag || 'Regular', c.status || '',
      c.product_type || '', c.demand || '', (c.notes || '').replace(/\n/g, ' '),
      new Date(c.created_at).toLocaleDateString('id-ID')
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `printwork-customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusConfig = (status) => STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  const getTagConfig = (tag) => TAG_OPTIONS.find(t => t.value === tag) || TAG_OPTIONS[0];

  const isUrgent = (customer) => {
    if (customer.status !== 'Komunikasi') return false;
    const updated = new Date(customer.updated_at || customer.created_at);
    return (new Date() - updated) > 3 * 24 * 60 * 60 * 1000;
  };

  const EditableCell = ({ id, field, value, className = '', textarea = false }) => {
    const isEditing = editingCell?.id === id && editingCell?.field === field;
    if (isEditing) {
      return textarea ? (
        <div className="flex gap-1">
          <textarea
            autoFocus
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') setEditingCell(null); }}
            className="w-full px-2 py-1 text-xs bg-white border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/10 resize-none"
            rows={2}
          />
          <div className="flex flex-col gap-0.5">
            <button onClick={saveEdit} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={12} /></button>
            <button onClick={() => setEditingCell(null)} className="p-1 text-red-400 hover:bg-red-50 rounded"><X size={12} /></button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingCell(null); }}
            className="w-full px-2 py-1 text-xs bg-white border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/10"
          />
          <button onClick={saveEdit} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={12} /></button>
        </div>
      );
    }
    return (
      <div
        className={`cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-lg transition-all group/cell ${className}`}
        onClick={() => startEdit(id, field, value)}
      >
        <span className="text-xs">{value || <span className="text-slate-300 italic">Klik untuk isi...</span>}</span>
        <Edit3 size={10} className="inline ml-1 opacity-0 group-hover/cell:opacity-40 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy-900">Customers CRM</h2>
          <p className="text-slate-400 font-jost text-sm">Kelola data pelanggan, komunikasi, dan demand.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:bg-white hover:shadow-lg rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
            <Download size={14} /> Export
          </button>
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xl shadow-navy-900/20 hover:bg-black transition-all">
            <UserPlus size={14} /> Tambah Customer
          </button>
        </div>
      </header>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-slate-50 text-slate-700' },
          { label: 'Active', value: stats.active, color: 'bg-blue-50 text-blue-700' },
          { label: 'Done', value: stats.done, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Closed', value: stats.closed, color: 'bg-red-50 text-red-600' },
          { label: 'Urgent ⚠️', value: stats.urgent, color: stats.urgent > 0 ? 'bg-orange-50 text-orange-700 ring-2 ring-orange-200' : 'bg-slate-50 text-slate-400' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-display font-bold">{stat.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            placeholder="Cari nama, telepon, produk..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-900/10 transition-all"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white rounded-xl text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-900/10 font-semibold"
        >
          <option value="all">Semua Status</option>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.icon} {s.label}</option>)}
        </select>

        <select
          value={filterTag}
          onChange={e => setFilterTag(e.target.value)}
          className="px-4 py-3 bg-white rounded-xl text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-900/10 font-semibold"
        >
          <option value="all">Semua Tag</option>
          {TAG_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-navy-900/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl"
            >
              <h3 className="text-xl font-display font-bold text-navy-900 mb-6">Tambah Customer Baru</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Nama *</label>
                  <input value={newCustomer.name} onChange={e => setNewCustomer(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary rounded-xl text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                    placeholder="Nama customer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Telepon (WA)</label>
                    <input value={newCustomer.phone} onChange={e => setNewCustomer(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-secondary rounded-xl text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                      placeholder="628xxx" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Tag</label>
                    <select value={newCustomer.tag} onChange={e => setNewCustomer(p => ({ ...p, tag: e.target.value }))}
                      className="w-full px-4 py-3 bg-secondary rounded-xl text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-900/10">
                      {TAG_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Tipe Produk Diminta</label>
                  <input value={newCustomer.product_type} onChange={e => setNewCustomer(p => ({ ...p, product_type: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary rounded-xl text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                    placeholder="e.g., Lunch Box Eco-Kraft" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Demand / Permintaan</label>
                  <input value={newCustomer.demand} onChange={e => setNewCustomer(p => ({ ...p, demand: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary rounded-xl text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                    placeholder="e.g., 2000pcs, desain custom, kirim minggu depan" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Catatan</label>
                  <textarea value={newCustomer.notes} onChange={e => setNewCustomer(p => ({ ...p, notes: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary rounded-xl text-xs border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-900/10 resize-none"
                    rows={2}
                    placeholder="Catatan internal..." />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowAddForm(false)} className="flex-1 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-navy-900 transition-all">Batal</button>
                <button onClick={handleAddCustomer} className="flex-1 py-3 bg-navy-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-navy-900/20">Simpan</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customer Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100">
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
          <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Belum ada customer.</p>
          <p className="text-slate-300 text-xs mt-1">Klik "Tambah Customer" untuk memulai.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((customer, idx) => {
            const statusConfig = getStatusConfig(customer.status);
            const tagConfig = getTagConfig(customer.tag);
            const urgent = isUrgent(customer);

            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-lg ${urgent ? 'border-orange-200 ring-1 ring-orange-100' : 'border-slate-100'}`}
              >
                {/* Top row: name, tag, status, actions */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Urgency Badge */}
                    {urgent && (
                      <div className="shrink-0 w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center" title="Komunikasi > 3 hari!">
                        <AlertTriangle size={14} className="text-orange-600" />
                      </div>
                    )}

                    {/* Name editable */}
                    <div className="flex-1 min-w-0">
                      <EditableCell id={customer.id} field="name" value={customer.name} className="font-semibold text-navy-900" />
                    </div>

                    {/* Tag dropdown */}
                    <select
                      value={customer.tag || 'Regular'}
                      onChange={e => updateField(customer.id, 'tag', e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border-none focus:outline-none focus:ring-0 cursor-pointer ${tagConfig.color}`}
                    >
                      {TAG_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>

                    {/* Status dropdown */}
                    <select
                      value={customer.status || 'Komunikasi'}
                      onChange={e => updateField(customer.id, 'status', e.target.value)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold border cursor-pointer focus:outline-none focus:ring-0 ${statusConfig.color}`}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.icon} {s.label}</option>)}
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {customer.phone && (
                      <a
                        href={`https://wa.me/${customer.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="WhatsApp"
                      >
                        <Phone size={14} />
                      </a>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(customer.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Detail rows */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 block mb-0.5">Tipe Produk</span>
                    <EditableCell id={customer.id} field="product_type" value={customer.product_type} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 block mb-0.5">Demand</span>
                    <EditableCell id={customer.id} field="demand" value={customer.demand} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 block mb-0.5">Telepon</span>
                    <EditableCell id={customer.id} field="phone" value={customer.phone} />
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-3 pt-3 border-t border-slate-50">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 block mb-0.5">📝 Catatan Khusus</span>
                  <EditableCell id={customer.id} field="notes" value={customer.notes} textarea />
                </div>

                {/* Timestamp */}
                <div className="mt-2 text-right">
                  <span className="text-[9px] text-slate-300">
                    Update: {new Date(customer.updated_at || customer.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-navy-900/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-500 w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-navy-900 mb-2">Hapus Customer?</h3>
              <p className="text-sm text-slate-400 mb-6">Data customer ini akan dihapus permanen.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-navy-900 transition-all">Batal</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
