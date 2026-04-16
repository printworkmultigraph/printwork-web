import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ─── CUSTOMERS HOOK ───
export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('updated_at', { ascending: false });
    if (!error) setCustomers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const upsert = async (customer) => {
    const payload = { ...customer, updated_at: new Date().toISOString() };
    if (customer.id) {
      const { error } = await supabase.from('customers').update(payload).eq('id', customer.id);
      if (!error) setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, ...payload } : c));
      return !error;
    } else {
      delete payload.id;
      const { data, error } = await supabase.from('customers').insert(payload).select().single();
      if (!error && data) setCustomers(prev => [data, ...prev]);
      return !error;
    }
  };

  const remove = async (id) => {
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
      setCustomers(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error removing customer:', error);
      return { success: false, error };
    }
  };

  const updateField = async (id, field, value) => {
    try {
      const { error } = await supabase.from('customers').update({ [field]: value, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
      return { success: true };
    } catch (error) {
      console.error('Error updating customer field:', error);
      return { success: false, error };
    }
  };

  return { customers, loading, fetch, upsert, remove, updateField };
}

// ─── INVENTORY HOOK ───
export function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('product_name', { ascending: true });
    if (!error) setInventory(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStock = async (id, stock) => {
    const { error } = await supabase.from('inventory').update({ stock, updated_at: new Date().toISOString() }).eq('id', id);
    if (!error) setInventory(prev => prev.map(i => i.id === id ? { ...i, stock } : i));
    return !error;
  };

  const updateField = async (id, field, value) => {
    const { error } = await supabase.from('inventory').update({ [field]: value, updated_at: new Date().toISOString() }).eq('id', id);
    if (!error) setInventory(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
    return !error;
  };

  const seedFromProducts = async (products) => {
    const existing = inventory.map(i => `${i.product_id}_${i.variant_key}`);
    const toInsert = [];

    products.forEach(product => {
      const variants = product.laminasi || ['Default'];
      variants.forEach(variant => {
        const key = `${product.id}_${variant}`;
        if (!existing.includes(key)) {
          toInsert.push({
            product_id: product.id,
            product_name: product.name,
            variant_key: variant,
            stock: 0,
            min_stock: 50,
            cogs: 0,
            price: product.price || 0,
          });
        }
      });
    });

    if (toInsert.length > 0) {
      const { error } = await supabase.from('inventory').insert(toInsert);
      if (!error) await fetch();
      return toInsert.length;
    }
    return 0;
  };

  const getStockForProduct = async (productId, variantKey) => {
    const { data } = await supabase
      .from('inventory')
      .select('stock')
      .eq('product_id', productId)
      .eq('variant_key', variantKey)
      .maybeSingle();
    return data?.stock ?? null;
  };

  return { inventory, loading, fetch, updateStock, updateField, seedFromProducts, getStockForProduct };
}

// ─── REVIEWS HOOK ───
export function useReviews(productIdFilter) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (productIdFilter) {
      query = query.eq('product_id', productIdFilter);
    }
    const { data, error } = await query;
    if (!error) setReviews(data || []);
    setLoading(false);
  }, [productIdFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const addReview = async (review) => {
    const { data, error } = await supabase.from('reviews').insert(review).select().single();
    if (!error && data) setReviews(prev => [data, ...prev]);
    return { data, error };
  };

  const updateField = async (id, field, value) => {
    const { error } = await supabase.from('reviews').update({ [field]: value }).eq('id', id);
    if (!error) setReviews(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    return !error;
  };

  const toggleHidden = async (id) => {
    const review = reviews.find(r => r.id === id);
    if (review) return updateField(id, 'is_hidden', !review.is_hidden);
    return false;
  };

  const submitReply = async (id, reply) => {
    return updateField(id, 'admin_reply', reply);
  };

  const remove = async (id) => {
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      setReviews(prev => prev.filter(r => r.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error removing review:', error);
      return { success: false, error };
    }
  };

  return { reviews, loading, fetch, addReview, updateField, toggleHidden, submitReply, remove };
}

// ─── PREORDERS HOOK ───
export function usePreorders() {
  const [preorders, setPreorders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('preorders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setPreorders(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const addPreorder = async (preorder) => {
    const { data, error } = await supabase.from('preorders').insert(preorder).select().single();
    if (!error && data) setPreorders(prev => [data, ...prev]);
    return { data, error };
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('preorders').update({ status }).eq('id', id);
    if (!error) setPreorders(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    return !error;
  };

  const openWhatsApp = (phone, name, productName) => {
    const message = `Halo Kak ${name},\n\nKabar baik! Stok ${productName} sudah ready lagi di Printwork. Karena kakak sudah pre-order duluan, kakak bisa langsung order sekarang ya.\n\nTerima kasih sudah menunggu! 🙏`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const remove = async (id) => {
    try {
      const { error } = await supabase.from('preorders').delete().eq('id', id);
      if (error) throw error;
      setPreorders(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error removing preorder:', error);
      return { success: false, error };
    }
  };

  return { preorders, loading, fetch, addPreorder, updateStatus, openWhatsApp, remove };
}
