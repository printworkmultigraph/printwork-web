import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, ChevronDown, X, ArrowRight, Menu, Download, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAVY = '#0D1B3E';

const shopCategories = [
  { name: 'Lunch Box & Pail', href: '/Shop?category=Lunch Box' },
  { name: 'Fried Chicken', href: '/Shop?category=Fried Chicken' },
  { name: 'Dus Nasi & Martabak', href: '/Shop?category=Dus Nasi' },
  { name: 'Kantong Kertas', href: '/Shop?category=Kantong Kertas' },
  { name: 'Kemasan Lainnya', href: '/Shop?category=Lainnya' },
];

const serviceSolutions = [
  { name: 'Desain & Inovasi', href: '/Services', image: '/images/service_design.png' },
  { name: 'Manufaktur Presisi', href: '/Services', image: '/images/service_manufacturing.png' },
  { name: 'Packaging & Hard Box', href: '/Services', image: '/images/service_packaging.png' },
  { name: 'Solusi Kustom', href: '/Contact', image: '/images/service_printing.png', description: 'Butuh sesuatu yang spesifik? Kami bisa menyesuaikan kebutuhan Anda.' },
];

const companyLinks = [
  { name: 'Tentang Kami', href: '/About' },
  { name: 'Klien & Portofolio', href: '/Portfolio' },
  { name: 'Kontak', href: '/Contact' },
];

const resourceLinks = [
  { name: 'FAQ', href: '/About' },
  { name: 'Kebijakan Privasi', href: '/PrivacyPolicy' },
  { name: 'Syarat & Ketentuan', href: '/TermsConditions' },
];

export default function Navbar({ cartCount = 0 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localCartCount, setLocalCartCount] = useState(0);
  const location = useLocation();

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('printwork_cart') || '[]');
      const count = cart.length;
      setLocalCartCount(count);
    } catch (e) {
      setLocalCartCount(0);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = (menu) => {
    setActiveDropdown((prev) => menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const isActive = (href) => {
    if (href === '#') return false;
    // Adapt to yucca paths where /Home is root usually
    if (href === '/' && location.pathname === '/Home') return true;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-700 ${
          mobileMenuOpen ? 'z-[9999]' : 'z-50'
        } ${
          isScrolled 
            ? 'bg-white/96 backdrop-blur-xl border-b border-[#000000]/[0.03] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to="/Home" className="flex items-center group">
                <img 
                  src="/images/new_logo.png" 
                  alt="Printwork Logo" 
                  className="h-10 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            </motion.div>

            {/* Navigation — Desktop */}
            <nav className="hidden lg:flex items-center gap-12">
              {[
                { name: 'Beranda', key: 'home', href: '/Home' },
                { name: 'Produk', key: 'shop' },
                { name: 'Layanan', key: 'solutions' },
                { name: 'Perusahaan', key: 'company' },
                { name: 'Kontak', key: 'contact', href: '/Contact' },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group h-[70px] flex items-center"
                  onMouseEnter={() => !item.href && handleMouseEnter(item.key)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.href ? (
                    <Link
                      to={item.href}
                      className={`text-[13px] font-bold tracking-[0.1em] uppercase transition-all duration-300 relative py-2 ${
                        isActive(item.href) ? 'text-[#0D1B3E]' : 'text-[#737373] hover:text-[#000000]'
                      }`}
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {item.name}
                      <motion.div 
                        className="absolute bottom-0 left-0 h-0.5 bg-[#0D1B3E] transition-all duration-300 group-hover:w-full"
                        animate={{ width: isActive(item.href) ? '100%' : '0%' }}
                      />
                    </Link>
                  ) : (
                    <button
                      className={`flex items-center gap-1.5 text-[13px] font-bold tracking-[0.1em] uppercase transition-all duration-300 py-2 ${
                        activeDropdown === item.key ? 'text-[#0D1B3E]' : 'text-[#737373] hover:text-[#000000]'
                      }`}
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {item.name}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === item.key ? 'rotate-180' : ''}`} />
                      <motion.div 
                        className="absolute bottom-0 left-0 h-0.5 bg-[#0D1B3E] transition-all duration-300 group-hover:w-full"
                        animate={{ width: activeDropdown === item.key ? '100%' : '0%' }}
                      />
                    </button>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Utility Icons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.dispatchEvent(new Event('openCommandPalette'))}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors"
                aria-label="Search Command Palette"
              >
                <Search className="w-[17px] h-[17px] text-[#525252] hover:text-[#0D1B3E]" />
              </button>
              <Link to="/Cart" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors group">
                <ShoppingBag className="w-[17px] h-[17px] text-[#525252] group-hover:text-[#0D1B3E]" />
                <AnimatePresence>
                  {localCartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-[#0D1B3E] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    >
                      {localCartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              <Link to="/Admin" className="hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors group">
                <User className="w-[17px] h-[17px] text-[#525252] group-hover:text-[#0D1B3E]" />
              </Link>

              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center text-[#525252] hover:text-[#0D1B3E] transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeDropdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 right-0 bg-white border-t border-[#e5e5e5] shadow-xl overflow-hidden"
              onMouseEnter={() => setActiveDropdown(activeDropdown)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
                {/* Shop Dropdown */}
                {activeDropdown === 'shop' && (
                  <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-4">
                      <div className="space-y-3">
                        {shopCategories.map((cat) => (
                          <Link
                            key={cat.name}
                            to={cat.href}
                            className="flex items-center gap-3 group"
                          >
                            <span className="text-[#525252] group-hover:text-[#0D1B3E] font-medium transition-colors">{cat.name}</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-[#0D1B3E]" />
                          </Link>
                        ))}
                      </div>
                      <div className="mt-8 pt-6 border-t border-[#e5e5e5]">
                        <Link to="/Shop" className="text-xl text-[#1a1a1a] hover:text-[#0D1B3E] transition-colors flex items-center gap-2 group font-semibold">
                          Lihat Semua Produk
                          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <div className="bg-[#f5f5f5] rounded-2xl p-6 h-full flex flex-col justify-between group">
                        <div>
                          <h4 className="text-xl text-[#1a1a1a] mb-2 font-semibold">Butuh yang lebih spesifik?</h4>
                          <p className="text-[#737373] text-sm mb-4">Kami bisa menyesuaikan packaging & cetakan sesuai kebutuhan Anda</p>
                          <div className="rounded-xl overflow-hidden mb-4">
                            <img src="https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=600&auto=format&fit=crop" alt="Custom" className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                        </div>
                        <Link to="/Contact" className="text-[#0D1B3E] font-semibold flex items-center gap-2 group-hover:opacity-80">
                          Konsultasi
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                    <div className="col-span-4 space-y-4">
                      <div className="rounded-2xl p-6 text-white" style={{ background: NAVY }}>
                        <h4 className="text-lg font-semibold mb-2">10+ Tahun Berpengalaman</h4>
                        <div className="h-px bg-white/20 my-4" />
                        <Link to="/About" className="flex items-center gap-2 group text-white hover:opacity-80">
                          Tentang Kami
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                      <div className="bg-[#f5f5f5] rounded-2xl p-6 hover:bg-[#eaeaea] transition-colors">
                        <h4 className="text-lg mb-2 text-[#1a1a1a] font-semibold">Mesin Heidelberg Terintegrasi</h4>
                        <p className="text-sm text-[#737373] mb-4">5 mesin cetak Heidelberg untuk hasil terbaik.</p>
                        <Link to="/About" className="flex items-center gap-2 group text-[#0D1B3E] font-semibold">
                          Pelajari lebih lanjut
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Layanan Solutions Dropdown */}
                {activeDropdown === 'solutions' && (
                  <div className="grid grid-cols-4 gap-6">
                    {serviceSolutions.map((solution) => (
                      <Link
                        key={solution.name}
                        to={solution.href}
                        className="group relative rounded-2xl overflow-hidden aspect-[3/4]"
                      >
                        <img 
                          src={solution.image} 
                          alt={solution.name} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h4 className="text-white text-xl font-semibold mb-2">{solution.name}</h4>
                          <div className="h-px bg-white/30 mb-3" />
                          <span className="text-white/80 text-sm flex items-center gap-2 font-medium group-hover:text-white">
                            Jelajahi
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Perusahaan Dropdown */}
                {activeDropdown === 'company' && (
                  <div className="grid grid-cols-2 gap-8 max-w-3xl">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-[#a3a3a3] uppercase tracking-wider mb-4">Perusahaan</h4>
                      {companyLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.href}
                          className="text-xl text-[#1a1a1a] hover:text-[#0D1B3E] font-medium transition-colors flex items-center gap-2 group"
                        >
                          {link.name}
                          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-[#a3a3a3] uppercase tracking-wider mb-4">Sumber Daya</h4>
                      {resourceLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.href}
                          className="text-xl text-[#1a1a1a] hover:text-[#0D1B3E] font-medium transition-colors flex items-center gap-2 group"
                        >
                          {link.name}
                          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Dropdown — Moved Outside Header to Fix Stacking/Transparency Issues */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex flex-col lg:hidden bg-white"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between px-6 h-[80px] border-b border-[#f5f5f5]">
              <Link to="/Home" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                <img 
                  src="/images/new_logo.png" 
                  alt="Printwork Logo" 
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary"
              >
                <X className="w-5 h-5 text-navy-900" />
              </button>
            </div>

            <div className="flex-1 overflow-auto py-10 px-8 flex flex-col justify-between">
              <nav className="space-y-8">
                {[
                  { name: 'Katalog Produk', href: '/Shop' },
                  { name: 'Layanan Kami', href: '/Services' },
                  { name: 'Portofolio', href: '/Portfolio' },
                  { name: 'Tentang Kami', href: '/About' },
                  { name: 'Hubungi Kami', href: '/Contact' }
                ].map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-3xl font-display font-medium text-navy-900 flex items-center justify-between group"
                    >
                      {link.name}
                      <ArrowRight className="w-6 h-6 text-navy-200 group-hover:text-navy-900 transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="pt-10 border-t border-[#f5f5f5] space-y-6">
                <div className="flex gap-4">
                  <Link 
                    to="/Admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-4 bg-navy-900 text-white rounded-full text-xs font-bold uppercase tracking-widest text-center"
                  >
                    Admin Portal
                  </Link>
                  <button className="w-14 h-14 border border-navy-100 rounded-full flex items-center justify-center">
                    <Search className="w-5 h-5 text-navy-900" />
                  </button>
                </div>
                <p className="text-center text-[10px] text-navy-300 tracking-widest uppercase">
                  Printwork Indonesia &copy; 2026
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
