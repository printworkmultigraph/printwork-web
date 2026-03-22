import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Package, 
  Settings, 
  LogOut, 
  Search, 
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Trash2,
  Lock,
  ChevronRight,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../lib/AuthContext';

const STATS = {
  daily: { revenue: 'Rp 42.500.000', growth: '+12%', orders: 156 },
  weekly: { revenue: 'Rp 285.000.000', growth: '+8%', orders: 1120 },
  monthly: { revenue: 'Rp 3.120.000.000', growth: '+15%', orders: 4800 },
  total: { revenue: 'Rp 14.850.000.000', growth: '+22%', orders: 24500 }
};

const CHART_DATA = [
  { label: 'Mon', value: 45, color: 'bg-navy-900' },
  { label: 'Tue', value: 72, color: 'bg-navy-900' },
  { label: 'Wed', value: 38, color: 'bg-navy-900' },
  { label: 'Thu', value: 85, color: 'bg-navy-900' },
  { label: 'Fri', value: 65, color: 'bg-navy-900' },
  { label: 'Sat', value: 92, color: 'bg-navy-500' },
  { label: 'Sun', value: 55, color: 'bg-navy-400' },
];

export default function Admin() {
  const { user, isAuthenticated: isSupabaseAuth, login, logout: supabaseLogout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('monthly');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Check if session is admin
  const isAdmin = user?.email === 'printworkmultigraph@gmail.com';

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      // For this specific request, we check both password and the email logic
      // In production, Supabase handles this.
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

  const handleDelete = () => {
    if (deletePassword === 'R180308') {
      alert('Data Deleted Successfully');
      setShowDeleteConfirm(false);
      setDeletePassword('');
    } else {
      alert('Invalid Delete Password');
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

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
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
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                  item.active ? 'bg-navy-900 text-white shadow-xl shadow-navy-900/20' : 'text-slate-500 hover:bg-white hover:shadow-lg'
                }`}
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
              <div>
                <h2 className="text-3xl font-display font-bold text-navy-900">Dashboard</h2>
                <p className="text-slate-400 font-jost text-sm">Welcome back, Administrator. Here's what's happening today.</p>
              </div>
              <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                {['daily', 'weekly', 'monthly', 'total'].map((f) => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                      filter === f ? 'bg-navy-900 text-white shadow-lg' : 'text-slate-400 hover:text-navy-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="Revenue" 
                value={STATS[filter].revenue} 
                growth={STATS[filter].growth} 
                icon={DollarSign} 
                trend="up"
              />
              <StatCard 
                title="Orders" 
                value={STATS[filter].orders} 
                growth="+5.4%" 
                icon={Package} 
                trend="up"
              />
              <StatCard 
                title="Active Users" 
                value="2,450" 
                growth="-1.2%" 
                icon={Users} 
                trend="down"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sales Chart */}
              <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="font-display font-semibold text-navy-900">Revenue Performance</h3>
                   <Calendar size={18} className="text-slate-300" />
                </div>
                <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-4">
                  {CHART_DATA.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${item.value}%` }}
                        transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                        className={`w-full rounded-t-xl transition-all duration-300 group-hover:opacity-80 relative ${item.color}`}
                      >
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-navy-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.value}% Target
                         </div>
                      </motion.div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                    </div>
                  ))}
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
                            onClick={() => {
                              alert('Migrating database to Supabase...');
                              // In a real app, this would call migrate-to-supabase.js logic via an API
                            }}
                            className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl group transition-all"
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-xs font-semibold tracking-wide">Sync Master Database</span>
                              <span className="text-[8px] text-white/30 uppercase mt-1">Push products to Supabase</span>
                            </div>
                            <ChevronRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                         </button>
                         <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl group transition-all">
                            <span className="text-xs font-semibold tracking-wide">Sync External ERP</span>
                            <ChevronRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl flex items-center justify-center gap-3 transition-all mt-10 border border-red-500/30"
                    >
                      <Trash2 size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Wipe Statistics</span>
                    </button>
                 </div>
                 <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              </div>
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
              <p className="text-slate-400 text-sm mb-10 leading-relaxed text-center">To confirm deletion, please enter the high-level security password.</p>
              
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
                    onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}
                    className="flex-1 py-4 text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-navy-900 transition-all"
                   >
                     Cancel
                   </button>
                   <button 
                    onClick={handleDelete}
                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-red-600/20"
                   >
                     Confirm Delete
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, growth, trend, icon: Icon }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-navy-900 group-hover:bg-navy-900 group-hover:text-white transition-all">
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          <span className="text-[10px] font-bold">{growth}</span>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        </div>
      </div>
      <div>
        <p className="text-slate-400 font-jost text-[10px] uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-2xl font-display font-bold text-navy-900">{value}</h4>
      </div>
    </div>
  );
}
