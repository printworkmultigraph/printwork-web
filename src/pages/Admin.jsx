import { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Package, 
  ChevronRight, 
  Clock, 
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Bell,
  Calendar,
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA SIMULATION ---
const REVENUE_DATA = {
  '1h': [...Array(60)].map((_, i) => ({ 
    label: `${i}m`, 
    revenue: Math.floor(1000000 + Math.random() * 500000), 
    orders: Math.floor(5 + Math.random() * 15) 
  })),
  '1d': [...Array(24)].map((_, i) => ({ 
    label: `${i}:00`, 
    revenue: Math.floor(5000000 + Math.random() * 3000000), 
    orders: Math.floor(50 + Math.random() * 100) 
  })),
  '1w': ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => ({ 
    label: day, 
    revenue: Math.floor(20000000 + Math.random() * 15000000), 
    orders: Math.floor(200 + Math.random() * 500) 
  })),
  '1M': [...Array(30)].map((_, i) => ({ 
    label: `${i+1}`, 
    revenue: Math.floor(15000000 + Math.random() * 10000000), 
    orders: Math.floor(150 + Math.random() * 400) 
  })),
  'all': [...Array(12)].map((_, i) => ({ 
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i], 
    revenue: Math.floor(500000000 + Math.random() * 300000000), 
    orders: Math.floor(5000 + Math.random() * 3000) 
  })),
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
};

// --- COMPONENTS ---

const StatCard = ({ title, value, change, isPositive, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-navy-900/5 transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-navy-900 group-hover:text-white transition-colors duration-500">
        <Icon size={20} className="text-navy-900 group-hover:text-white transition-colors" />
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
        {change}%
      </div>
    </div>
    <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">{title}</h4>
    <div className="text-2xl font-display font-bold text-navy-900">{value}</div>
  </motion.div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
      active 
        ? 'bg-navy-900 text-white shadow-lg shadow-navy-900/20' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-navy-900'
    }`}
  >
    <Icon size={18} className={active ? 'text-white' : 'group-hover:text-navy-900'} />
    <span className="text-[13px] font-bold tracking-tight">{label}</span>
    {active && (
      <motion.div 
        layoutId="activeTab"
        className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
      />
    )}
  </button>
);

export default function Admin() {
  const [filter, setFilter] = useState('1M');
  const [viewType, setViewType] = useState('revenue'); // 'revenue' or 'orders'
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Calculate smoothed chart data
  const rawData = REVENUE_DATA[filter] || REVENUE_DATA['1M'];
  
  // Accumulate prices for revenue view (as requested by user)
  let accumulatedPrice = 0;
  const chartData = rawData.map((d, i) => {
    const val = viewType === 'revenue' ? d.revenue : d.orders;
    accumulatedPrice += val;
    return {
      ...d,
      value: accumulatedPrice, // This makes it an accumulation chart
      x: (i / (rawData.length - 1)) * 1000,
      y: 100 // placeholder
    }
  });

  // Normalize Y values to 0-100 (inverted for SVG coordinates)
  const maxVal = Math.max(...chartData.map(d => d.value), 1);
  chartData.forEach(d => {
    d.y = 90 - (d.value / maxVal) * 80; // keep 10% padding
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-navy-900 font-jost selection:bg-navy-900 selection:text-white">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col p-8 fixed h-screen z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">PRINTWORK</h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Management</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={ShoppingBag} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <SidebarItem icon={Users} label="Customers" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
          <SidebarItem icon={Package} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <SidebarItem icon={TrendingUp} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50 space-y-2">
          <SidebarItem icon={HelpCircle} label="Help Center" onClick={() => {}} />
          <SidebarItem icon={LogOut} label="Logout" onClick={() => {}} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-navy-900 mb-1">Welcome back, Admin</h2>
            <p className="text-slate-400 text-sm font-medium">Here's what's happening with your store today.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/10 w-64 transition-all"
              />
            </div>
            <button className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center transition-all hover:bg-slate-50 relative">
              <Bell size={20} className="text-slate-600" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-navy-900 overflow-hidden border-2 border-white shadow-lg cursor-pointer">
              <img src="https://ui-avatars.com/api/?name=Admin&background=0D1B3E&color=fff" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Revenue" value={formatCurrency(accumulatedPrice)} change={12.5} isPositive={true} icon={DollarSign} delay={0.1} />
          <StatCard title="Orders" value="1,284" change={3.2} isPositive={true} icon={ShoppingBag} delay={0.2} />
          <StatCard title="Active Users" value="842" change={2.1} isPositive={false} icon={Users} delay={0.3} />
          <StatCard title="Inventory" value="48" change={0.0} isPositive={true} icon={Package} delay={0.4} />
        </div>

        {/* Large Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-10">
               <div>
                 <h3 className="font-display font-semibold text-navy-900 text-lg uppercase tracking-tight">
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
                     className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${viewType === 'revenue' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-400'}`}
                  >
                     Revenue
                  </button>
                  <button 
                     onClick={() => setViewType('orders')}
                     className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${viewType === 'orders' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-400'}`}
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
                                  price >= 1000000 ? `${(price/1000000).toFixed(1)}jt` :
                                  price >= 1000 ? `${(price/1000).toFixed(0)}rb` : price;
                  return <span key={val}>{formatted}</span>
                })}

                {/* Y-Axis Value Bubble (TradingView Style) */}
                {hoveredPoint !== null && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-[-10px] bg-navy-900 text-white text-[8px] px-1.5 py-0.5 rounded font-mono z-50 shadow-lg border border-white/20"
                    style={{ 
                      top: `${chartData[hoveredPoint].y}%`,
                      transform: 'translateY(-50%)'
                    }}
                  >
                    {viewType === 'revenue' 
                      ? (chartData[hoveredPoint].value >= 1000000 
                          ? `${(chartData[hoveredPoint].value/1000000).toFixed(2)}M` 
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
                  style={{ width: `${Math.max(100, chartData.length * 6)}%`, minWidth: '100%' }}
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
                    <div key={val} className="absolute w-full border-t border-slate-100/50" style={{ top: `${val}%` }} />
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
                      d={`M 0 100 ${chartData.map((p, i) => {
                        if (i === 0) return `L ${p.x} ${p.y}`;
                        const prev = chartData[i-1];
                        const cx = (prev.x + p.x) / 2;
                        return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
                      }).join(' ')} L 1000 100 Z`}
                      fill="url(#chartGradient)"
                      className="transition-all duration-500"
                    />

                    {/* Premium Smooth Line */}
                    <motion.path 
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      d={`M 0 ${chartData[0]?.y || 100} ${chartData.map((p, i) => {
                        if (i === 0) return '';
                        const prev = chartData[i-1];
                        const cx = (prev.x + p.x) / 2;
                        return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
                      }).join(' ')}`}
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
                        left: `${(p.x / 1000) * 100}%`,
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
                              className={`absolute left-1/2 w-8 h-8 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse ${
                                i === chartData.length - 1 ? 'bg-emerald-500/10' : 'bg-navy-900/5'
                              }`}
                              style={{ top: `${p.y}%` }}
                           />
                           {/* Dot */}
                           <div 
                             className={`absolute left-1/2 w-3.5 h-3.5 border-[2.5px] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] -translate-x-1/2 -translate-y-1/2 ${
                               i === chartData.length - 1 && hoveredPoint === null
                               ? 'bg-emerald-500 border-white z-20'
                               : 'bg-white border-navy-900'
                             }`}
                             style={{ top: `${p.y}%` }}
                           />
                           {/* Live Label if last point */}
                           {i === chartData.length - 1 && hoveredPoint === null && (
                             <div 
                               className="absolute left-[20px] bg-emerald-500 text-white text-[7px] font-bold px-1 py-0.5 rounded tracking-tighter -translate-y-1/2"
                               style={{ top: `${p.y}%` }}
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
                            top: `${p.y}%`,
                            transform: `translate(-50%, -160%)`,
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
                              {viewType === 'revenue' ? formatCurrency(p.value) : `${p.value} Total Orders`}
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
                      (i % (chartData.length > 20 ? 4 : 1) === 0) && (
                        <div key={i} className="text-center w-0 overflow-visible">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap translate-x-[-50%] opacity-80">{p.label}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeframe Selectors */}
            <div className="mt-14 flex items-center justify-center gap-2">
              {[
                { label: 'Hour', val: '1h' },
                { label: 'Day', val: '1d' },
                { label: 'Week', val: '1w' },
                { label: 'Month', val: '1M' },
                { label: 'Year', val: 'all' }
              ].map(t => (
                <button 
                  key={t.val}
                  onClick={() => setFilter(t.val)}
                  className={`px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${filter === t.val ? 'bg-navy-900 text-white shadow-xl shadow-navy-900/10' : 'text-slate-400 hover:text-navy-900 hover:bg-slate-50'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Side Content / Recent Activity */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col">
            <h3 className="font-display font-semibold text-navy-900 mb-8 uppercase tracking-widest text-xs">Recent Orders</h3>
            <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer p-1 hover:bg-slate-50 rounded-2xl transition-all">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-navy-900 font-bold text-xs group-hover:bg-navy-900 group-hover:text-white transition-all">
                    #{1080 + i}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold leading-none mb-1">Customer #{i + 1}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Lunch Box • 500 Pcs</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-navy-900">{formatCurrency(2500000 + (Math.random() * 1000000))}</div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">SUCCESS</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-auto w-full py-4 bg-slate-50 text-navy-900 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest hover:bg-navy-900 hover:text-white transition-all duration-500 flex items-center justify-center gap-2">
              View All Transactions
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
           {['New Invoice', 'Manage Inventory', 'Store Settings', 'Customer Support'].map((action, i) => (
             <button key={i} className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-navy-900 hover:border-navy-900/20 hover:shadow-lg transition-all">
               {action}
             </button>
           ))}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />
    </div>
  );
}
