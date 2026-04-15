import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Package, 
  Settings, 
  LogOut, 
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Lock,
  ChevronRight,
  Star,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const { user, isAuthenticated: isSupabaseAuth, login, logout: supabaseLogout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('1h');
  const [viewType, setViewType] = useState('revenue'); // revenue or orders
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  
  // Real data states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = user?.email === 'printworkmultigraph@gmail.com';

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error('Error fetching orders:', fetchError);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setOrdersLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isSupabaseAuth && isAdmin) {
      fetchOrders();
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [isSupabaseAuth, isAdmin]);

  // Calculate statistics based on filter
  const stats = useMemo(() => {
    const now = new Date();
    let filteredOrders = orders;
    let prevFilteredOrders = [];

    const getRanges = (f) => {
      const ms = {
        '1h': 60 * 60 * 1000,
        '1d': 24 * 60 * 60 * 1000,
        '1w': 7 * 24 * 60 * 60 * 1000,
        '1M': 30 * 24 * 60 * 60 * 1000,
      };
      
      if (f === 'total') return { start: new Date(0), prevStart: new Date(0), prevEnd: new Date(0) };
      
      const duration = ms[f];
      const start = new Date(now.getTime() - duration);
      const prevEnd = start;
      const prevStart = new Date(start.getTime() - duration);
      
      return { start, prevStart, prevEnd };
    };

    const { start, prevStart, prevEnd } = getRanges(filter);

    if (filter !== 'total') {
      filteredOrders = orders.filter(o => new Date(o.created_at) >= start);
      prevFilteredOrders = orders.filter(o => {
        const d = new Date(o.created_at);
        return d >= prevStart && d < prevEnd;
      });
    }

    const paidOrders = filteredOrders.filter(o => o.status === 'PAID');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    const totalOrders = filteredOrders.length;
    const paidCount = paidOrders.length;
    const pendingCount = filteredOrders.filter(o => o.status === 'PENDING').length;

    const prevRevenue = prevFilteredOrders.filter(o => o.status === 'PAID').reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    const prevOrderCount = prevFilteredOrders.length;

    const revenueGrowth = prevRevenue > 0 ? (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : totalRevenue > 0 ? '100' : '0';
    const orderGrowth = prevOrderCount > 0 ? (((totalOrders - prevOrderCount) / prevOrderCount) * 100).toFixed(1) : totalOrders > 0 ? '100' : '0';

    return {
      revenue: totalRevenue,
      orders: totalOrders,
      paidCount,
      pendingCount,
      revenueGrowth: Number(revenueGrowth),
      orderGrowth: Number(orderGrowth),
    };
  }, [orders, filter]);

  // Chart data: orders per day in the last 7 days
  const chartData = useMemo(() => {
    const now = new Date();
    const result = [];
    
    const configs = {
      '1h': { count: 24, step: 2.5 * 60 * 1000, label: (d) => `${d.getHours()}:${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}` },
      '1d': { count: 24, step: 1 * 60 * 60 * 1000, label: (d) => `${d.getHours()}:00` },
      '1w': { count: 14, step: 12 * 60 * 60 * 1000, label: (d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] },
      '1M': { count: 30, step: 24 * 60 * 60 * 1000, label: (d) => `${d.getDate()}/${d.getMonth()+1}` },
      'total': { count: 12, step: 30 * 24 * 60 * 60 * 1000, label: (d) => d.toLocaleString('default', { month: 'short' }) }
    };

    const config = configs[filter] || configs['1w'];
    let runningRevenue = 0;
    let runningOrders = 0;

    // First pass: get raw data in chronological order
    const rawPoints = [];
    for (let i = config.count - 1; i >= 0; i--) {
      const end = new Date(now.getTime() - i * config.step);
      const start = new Date(end.getTime() - config.step);

      const periodOrders = orders.filter(o => {
        const d = new Date(o.created_at);
        return d >= start && d < end;
      });

      const periodRevenue = periodOrders.filter(o => o.status === 'PAID').reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
      const periodOrderCount = periodOrders.length;
      
      runningRevenue += periodRevenue;
      runningOrders += periodOrderCount;

      rawPoints.push({
        label: config.label(end, i),
        revenue: runningRevenue,
        orders: runningOrders,
        value: viewType === 'revenue' ? runningRevenue : runningOrders,
      });
    }

    const maxVal = Math.max(...rawPoints.map(r => r.value), 1);
    return rawPoints.map((r, i) => ({ 
      ...r, 
      x: (i / (rawPoints.length - 1)) * 1000, // 0 to 1000 for better precision
      y: 100 - (r.value / maxVal) * 85 - 5 
    }));
  }, [orders, filter, viewType]);

  const formatCurrency = (amount) => {
    return `Rp ${Number(amount).toLocaleString('id-ID')}`;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      if (password === 'PrintworkID123') {
        await login('printworkmultigraph@gmail.com', password);
        setError('');
      } else {
        setError('Password Incorrect');
      }
    } catch (err) {
      setError(err.message || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deletePassword === '180308') {
      try {
        const { error: deleteError } = await supabase
          .from('orders')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (deleteError) {
          alert('Error deleting: ' + deleteError.message);
        } else {
          setOrders([]);
          alert('Semua data order berhasil dihapus.');
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
      setShowDeleteConfirm(false);
      setDeletePassword('');
    } else {
      alert('Invalid Delete Password');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAID': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'EXPIRED': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'EXPIRED': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (!isSupabaseAuth || !isAdmin) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center">
              <Lock className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-navy-900">Admin Access</h1>
              <p className="text-xs text-navy-300 uppercase tracking-widest font-jost">Printwork ID Portal</p>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-navy-400 mb-2 ml-1">Secure Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-6 py-4 bg-secondary rounded-2xl border border-navy-50 focus:outline-none focus:ring-2 focus:ring-navy-900/10 transition-all font-jost"
                placeholder="••••••••"
              />
              {error && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1">{error}</p>}
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-navy-900 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-xl shadow-navy-900/10 disabled:opacity-50"
            >
              {loading ? 'Authorizing...' : 'Authorize Access'}
            </button>
          </form>
          <p className="text-center mt-10 text-[10px] text-navy-200 uppercase tracking-widest">
            Printwork Indonesia &copy; 2026 Admin Panel
          </p>
        </motion.div>
      </div>
    );
  }

    const customStyles = \`
      .custom-scrollbar::-webkit-scrollbar {
        height: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 10px;
        transition: all 0.2s;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    \`;

    return (
      <div className="min-h-screen bg-slate-50 font-sans text-navy-900 pb-20">
        <style>{customStyles}</style>
        <Navbar />
      
      <div className="max-w-[1400px] mx-auto pt-32 px-6 md:px-10 lg:px-16 pb-20">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar */}
          <aside className="lg:w-72 space-y-2">
            {[
              { icon: LayoutDashboard, label: 'Overview', active: true },
              { icon: TrendingUp, label: 'Analytics', active: false },
              { icon: Users, label: 'Customers', active: false },
              { icon: Package, label: 'Inventory', active: false },
              { icon: Star, label: 'Reviews', active: false },
              { icon: Settings, label: 'System', active: false },
            ].map((item) => (
              <button 
                key={item.label}
                className={\`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all \${
                  item.active ? 'bg-navy-900 text-white shadow-xl shadow-navy-900/20' : 'text-slate-500 hover:bg-white hover:shadow-lg'
                }\`}
              >
                <item.icon size={20} />
                <span className="font-jost font-semibold text-sm">{item.label}</span>
              </button>
            ))}
            <div className="pt-10">
               <button 
                 onClick={() => supabaseLogout()}
                 className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
               >
                 <LogOut size={20} />
                 <span className="font-jost font-semibold text-sm">Logout Session</span>
               </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-3xl font-display font-bold text-navy-900">Dashboard</h2>
                  <p className="text-slate-400 font-jost text-sm">Data real-time dari Xendit & Supabase.</p>
                </div>
                <button 
                  onClick={fetchOrders}
                  disabled={refreshing}
                  className={\`p-2 rounded-xl hover:bg-white hover:shadow-md transition-all \${refreshing ? 'animate-spin' : ''}\`}
                  title="Refresh data"
                >
                  <RefreshCw size={18} className="text-slate-400" />
                </button>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                {[
                  { id: '1h', label: '1 Jam' },
                  { id: '1d', label: '1 Hari' },
                  { id: '1w', label: '1 Minggu' },
                  { id: '1M', label: '1 Bulan' },
                  { id: 'total', label: 'Total' }
                ].map((f) => (
                  <button 
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={\`px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap \${
                      filter === f.id ? 'bg-navy-900 text-white shadow-lg' : 'text-slate-400 hover:text-navy-900'
                    }\`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </header>

            {/* Stats Grid */}
            {ordersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-pulse">
                    <div className="h-12 w-12 bg-slate-100 rounded-2xl mb-6" />
                    <div className="h-4 w-20 bg-slate-100 rounded mb-2" />
                    <div className="h-8 w-32 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="Revenue (Paid)" 
                  value={formatCurrency(stats.revenue)} 
                  growth={\`\${stats.revenueGrowth >= 0 ? '+' : ''}\${stats.revenueGrowth}%\`} 
                  icon={DollarSign} 
                  trend={stats.revenueGrowth >= 0 ? 'up' : 'down'}
                />
                <StatCard 
                  title="Total Orders" 
                  value={stats.orders} 
                  growth={\`\${stats.orderGrowth >= 0 ? '+' : ''}\${stats.orderGrowth}%\`} 
                  icon={Package} 
                  trend={stats.orderGrowth >= 0 ? 'up' : 'down'}
                />
                <StatCard 
                  title="Paid / Pending" 
                  value={\`\${stats.paidCount} / \${stats.pendingCount}\`}
                  growth={stats.paidCount > 0 ? \`\${((stats.paidCount / Math.max(stats.orders, 1)) * 100).toFixed(0)}% paid\` : '0%'}
                  icon={Users} 
                  trend={stats.paidCount > stats.pendingCount ? 'up' : 'down'}
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sales Chart */}
              <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col">
                <div className="flex items-center justify-between mb-10">
                   <div>
                     <h3 className="font-display font-semibold text-navy-900">
                       {viewType === 'revenue' ? 'Revenue Analytics' : 'Order Distribution'}
                     </h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Timeline: {
                          filter === '1h' ? '1 Jam' : 
                          filter === '1d' ? '24 Jam' : 
                          filter === '1w' ? '7 Hari' : 
                          filter === '1M' ? '30 Hari' : 'Semua Data'
                        }
                     </p>
                   </div>
                   <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
                      <button 
                         onClick={() => setViewType('revenue')}
                         className={\`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all \${viewType === 'revenue' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-400'}\`}
                      >
                         Revenue
                      </button>
                      <button 
                         onClick={() => setViewType('orders')}
                         className={\`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all \${viewType === 'orders' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-400'}\`}
                      >
                         Orders
                      </button>
                   </div>
                </div>
                
                <div className="flex-1 min-h-[350px] flex gap-4 mt-6 bg-slate-50/20 rounded-3xl p-6 border border-slate-100">
                  {/* Y-Axis Labels */}
                  <div className="flex flex-col justify-between text-[10px] font-bold text-slate-400 uppercase py-8 w-14 text-right border-r border-slate-100/50 pr-4 relative">
                    {[100, 75, 50, 25, 0].map(val => {
                      const maxValInPoints = Math.max(...chartData.map(r => r.value), 1);
                      const price = (maxValInPoints * val) / 100;
                      const formatted = price === 0 ? '0' : 
                                      price >= 1000000 ? \`\${(price/1000000).toFixed(1)}jt\` :
                                      price >= 1000 ? \`\${(price/1000).toFixed(0)}rb\` : price;
                      return <span key={val}>{formatted}</span>
                    })}

                    {/* Y-Axis Value Bubble (TradingView Style) */}
                    {hoveredPoint !== null && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-[-10px] bg-navy-900 text-white text-[8px] px-1.5 py-0.5 rounded font-mono z-50 shadow-lg border border-white/20"
                        style={{ 
                          top: \`\${chartData[hoveredPoint].y}%\`,
                          transform: 'translateY(-50%)'
                        }}
                      >
                        {viewType === 'revenue' 
                          ? (chartData[hoveredPoint].value >= 1000000 
                              ? \`\${(chartData[hoveredPoint].value/1000000).toFixed(2)}M\` 
                              : chartData[hoveredPoint].value.toLocaleString('id-ID'))
                          : chartData[hoveredPoint].value
                        }
                      </motion.div>
                    )}
                  </div>

                  {/* Scrollable Chart Area */}
                  <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar group/chart-scroll cursor-grab active:cursor-grabbing">
                    <div 
                      className="relative h-[300px]" 
                      style={{ width: \`\${Math.max(100, chartData.length * 6)}%\`, minWidth: '100%' }}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const width = rect.width;
                        const percentage = x / width;
                        const index = Math.round(percentage * (chartData.length - 1));
                        if (index >= 0 && index < chartData.length) {
                          setHoveredPoint(index);
                        }
                      }}
                    >
                      {/* Grid Lines */}
                      {[0, 25, 50, 75, 100].map(val => (
                        <div key={val} className="absolute w-full border-t border-slate-100/50" style={{ top: \`\${val}%\` }} />
                      ))}

                      <svg 
                        viewBox="0 0 1000 100" 
                        preserveAspectRatio="none"
                        className="absolute inset-0 w-full h-full overflow-visible"
                        style={{ zIndex: 10 }}
                      >
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1E1E1E" stopOpacity="0.15" />
                            <stop offset="50%" stopColor="#1E1E1E" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="#1E1E1E" stopOpacity="0" />
                          </linearGradient>
                          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="0.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* Area Fill - Smoothed */}
                        <path 
                          d={\`M 0 100 \${chartData.map((p, i) => {
                            if (i === 0) return \`L \${p.x} \${p.y}\`;
                            const prev = chartData[i-1];
                            const cx = (prev.x + p.x) / 2;
                            return \`C \${cx} \${prev.y}, \${cx} \${p.y}, \${p.x} \${p.y}\`;
                          }).join(' ')} L 1000 100 Z\`}
                          fill="url(#chartGradient)"
                          className="transition-all duration-500"
                        />

                        {/* Premium Smooth Line */}
                        <motion.path 
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          d={\`M 0 \${chartData[0]?.y || 100} \${chartData.map((p, i) => {
                            if (i === 0) return '';
                            const prev = chartData[i-1];
                            const cx = (prev.x + p.x) / 2;
                            return \`C \${cx} \${prev.y}, \${cx} \${p.y}, \${p.x} \${p.y}\`;
                          }).join(' ')}\`}
                          fill="none"
                          stroke="#1E1E1E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ 
                            vectorEffect: 'non-scaling-stroke',
                            filter: 'url(#lineGlow)'
                          }}
                        />
                      </svg>

                      {/* Interaction Layer (Calculated from hoveredPoint) - TOP LEVEL */}
                      {chartData.map((p, i) => (
                        <div 
                          key={i}
                          className="absolute h-full pointer-events-none transition-all duration-300"
                          style={{ 
                            left: \`\${(p.x / 1000) * 100}%\`,
                            width: '1px',
                            transform: 'translateX(-50%)',
                            zIndex: 30 
                          }}
                        >
                          {/* Vertical Crosshair Line */}
                          {hoveredPoint === i && (
                            <div className="absolute left-1/2 w-[1px] h-full border-l border-dashed border-slate-300 -translate-x-1/2 opacity-50" />
                          )}

                          {/* Data Point Dot - ALWAYS VISIBLE OVER LINE */}
                          {(hoveredPoint === i || (i === chartData.length - 1 && hoveredPoint === null)) && (
                            <div className="relative w-full h-full">
                               {/* Glow Pulse */}
                               <div 
                                  className={\`absolute left-1/2 w-8 h-8 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse \${
                                    i === chartData.length - 1 ? 'bg-emerald-500/10' : 'bg-navy-900/5'
                                  }\`}
                                  style={{ top: \`\${p.y}%\` }}
                               />
                               {/* Dot */}
                               <div 
                                 className={\`absolute left-1/2 w-3.5 h-3.5 border-[2.5px] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] -translate-x-1/2 -translate-y-1/2 \${
                                   i === chartData.length - 1 && hoveredPoint === null
                                   ? 'bg-emerald-500 border-white z-20'
                                   : 'bg-white border-navy-900'
                                 }\`}
                                 style={{ top: \`\${p.y}%\` }}
                               />
                               {/* Live Label if last point */}
                               {i === chartData.length - 1 && hoveredPoint === null && (
                                 <div 
                                   className="absolute left-[20px] bg-emerald-500 text-white text-[7px] font-bold px-1 py-0.5 rounded tracking-tighter -translate-y-1/2"
                                   style={{ top: \`\${p.y}%\` }}
                                 >
                                   LIVE
                                 </div>
                               )}
                            </div>
                          )}

                          {/* Tooltip */}
                          {hoveredPoint === i && (
                            <div 
                              className="absolute left-1/2"
                              style={{ 
                                top: \`\${p.y}%\`,
                                transform: \`translate(-50%, -160%)\`,
                                zIndex: 100
                              }}
                            >
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="bg-[#1E1E1E] text-white px-5 py-2.5 rounded-2xl shadow-2xl border border-white/10 relative"
                              >
                                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 leading-none">{p.label}</div>
                                <div className="text-xs font-bold whitespace-nowrap">
                                  {viewType === 'revenue' ? formatCurrency(p.revenue) : \`\${p.orders} Total Orders\`}
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1E1E1E]" />
                              </motion.div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* X-Axis Labels - Optimized spacing */}
                      <div className="absolute bottom-[-40px] w-full flex justify-between px-6 pointer-events-none">
                        {chartData.map((p, i) => (
                          (i % (chartData.length > 20 ? 2 : 1) === 0) && (
                            <div key={i} className="text-center w-0 overflow-visible">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap translate-x-[-50%] opacity-80">{p.label}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Actions */}
              <div className="bg-navy-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <h3 className="text-xl font-display font-medium mb-2">Restricted Area</h3>
                      <p className="text-white/40 text-sm leading-relaxed mb-10">Sensible administrative actions require double authorization.</p>
                      <div className="space-y-4">
                         <button 
                            onClick={fetchOrders}
                            className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl group transition-all"
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-xs font-semibold tracking-wide">Refresh Data</span>
                              <span className="text-[8px] text-white/30 uppercase mt-1">Perbarui data dari Supabase</span>
                            </div>
                            <RefreshCw size={16} className={\`text-white/40 group-hover:rotate-180 transition-transform duration-500 \${refreshing ? 'animate-spin' : ''}\`} />
                         </button>
                         <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl group transition-all">
                            <span className="text-xs font-semibold tracking-wide">Export CSV</span>
                            <ChevronRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl flex items-center justify-center gap-3 transition-all mt-10 border border-red-500/30"
                    >
                      <Trash2 size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Wipe All Orders</span>
                    </button>
                 </div>
                 <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display font-semibold text-navy-900">Recent Orders</h3>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  {orders.length} total
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 text-sm">Belum ada pesanan.</p>
                  <p className="text-slate-300 text-xs mt-1">Data akan muncul setelah customer melakukan checkout.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-3 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Order ID</th>
                        <th className="text-left py-3 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Produk</th>
                        <th className="text-left py-3 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Qty</th>
                        <th className="text-left py-3 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Amount</th>
                        <th className="text-left py-3 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                        <th className="text-left py-3 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Waktu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 20).map((order, i) => (
                        <motion.tr 
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="py-4 px-2">
                            <span className="font-mono text-xs text-navy-500">{order.external_id}</span>
                          </td>
                          <td className="py-4 px-2">
                            <div>
                              <span className="font-semibold text-navy-900 text-xs block truncate max-w-[200px]">{order.product_name || '-'}</span>
                              {order.product_variant && (
                                <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">{order.product_variant}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <span className="text-xs text-navy-700 font-medium">{order.quantity || '-'}</span>
                          </td>
                          <td className="py-4 px-2">
                            <span className="font-semibold text-navy-900 text-xs">{formatCurrency(order.amount)}</span>
                          </td>
                          <td className="py-4 px-2">
                            <span className={\`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border \${getStatusColor(order.status)}\`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <span className="text-[10px] text-slate-400">
                              {new Date(order.created_at).toLocaleString('id-ID', { 
                                day: '2-digit', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-navy-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="text-red-500 w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold text-navy-900 mb-2 text-center">Double Authorization</h3>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed text-center">Semua data order di Supabase akan dihapus permanen. Masukkan password untuk konfirmasi.</p>
              
              <div className="space-y-6">
                <input 
                  type="password" 
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-6 py-4 bg-secondary rounded-2xl border border-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/10 transition-all font-mono"
                  placeholder="Master Key Required"
                  autoFocus
                />
                <div className="flex gap-4">
                   <button 
                     onClick={() => setShowDeleteConfirm(false)}
                     className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all font-sans"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleDelete}
                     className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all font-sans"
                   >
                     Confirm Wipe
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: \`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      \`}} />
    </div>
  );
}

const StatCard = ({ title, value, growth, icon: Icon, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-navy-900/5 transition-all group relative overflow-hidden"
  >
    <div className=\"flex justify-between items-start mb-6 relatives z-10\">
      <div className=\"w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-navy-900 group-hover:text-white transition-all duration-500\">
        <Icon size={20} className=\"text-navy-900 group-hover:text-white transition-colors\" />
      </div>
      <div className={\`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold \${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}\`}>
        {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {growth}
      </div>
    </div>
    <div className=\"relative z-10\">
      <h4 className=\"text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1\">{title}</h4>
      <div className=\"text-2xl font-display font-bold text-navy-900\">{value}</div>
    </div>
    <div className=\"absolute bottom-[-20px] right-[-20px] opacity-[0.02] group-hover:opacity-[0.05] transition-opacity\">
      <Icon size={120} />
    </div>
  </motion.div>
);
// deploy_trigger: 1776271767590
