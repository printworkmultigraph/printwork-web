import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Search, ChevronRight } from 'lucide-react';

const navLinks = [
  { label: 'Shop', path: '/Shop' },
  { label: 'About', path: '/About' },
  { label: 'Contact', path: '/Contact' },
];

const categories = [
  { label: 'Coffee', path: '/Shop?category=Coffee' },
  { label: 'Smoothies', path: '/Shop?category=Smoothies' },
  { label: 'Deli', path: '/Shop?category=Deli' },
  { label: 'Takeout', path: '/Shop?category=Takeout' },
  { label: 'Cutlery', path: '/Shop?category=Cutlery' },
  { label: 'Bags', path: '/Shop?category=Bags' },
  { label: 'Extras', path: '/Shop?category=Extras' },
];

// Hover text swap — two lines, clip on hover
function NavLink({ link, active }) {
  return (
    <Link
      to={link.path}
      className="relative overflow-hidden group flex flex-col h-5"
      style={{ lineHeight: '1.25rem' }}
    >
      {/* normal line */}
      <span
        className={`block text-sm font-jost font-medium tracking-wide transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full ${active ? 'text-navy-900' : 'text-navy-500'}`}
      >
        {link.label}
      </span>
      {/* hover line (slides up from below) */}
      <span
        className="absolute top-full block text-sm font-jost font-medium tracking-wide text-navy-900 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
      >
        {link.label}
      </span>
    </Link>
  );
}

export default function Navbar({ cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/96 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]' : 'bg-transparent'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <Link to="/Home" className="flex items-center gap-2.5 group">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
                <rect width="28" height="28" rx="5" fill="#0f1b2d"/>
                <path d="M17 8L8 17M8 17H16M8 17V9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="overflow-hidden h-5">
                <span className="block text-navy-900 text-sm font-jost font-bold tracking-[0.15em] uppercase transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                  YUCCA
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map(link => (
                <NavLink key={link.path} link={link} active={location.pathname === link.path} />
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-3">
              <Link to="/Shop" className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-secondary transition-colors">
                <Search className="w-[17px] h-[17px] text-navy-600" />
              </Link>
              <Link to="/Cart" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
                <ShoppingBag className="w-[17px] h-[17px] text-navy-600" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-navy-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              <button onClick={() => setMobileOpen(true)} className="md:hidden w-9 h-9 flex items-center justify-center">
                <Menu className="w-5 h-5 text-navy-900" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/25 z-[60] backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <span className="text-sm font-jost font-semibold tracking-widest uppercase text-navy-900">Menu</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5 text-navy-600" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.path}
                      className="flex items-center justify-between py-4 text-xl font-display text-navy-900 border-b border-border"
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 text-navy-300" />
                    </Link>
                  </motion.div>
                ))}
                <p className="text-[10px] font-jost text-navy-300 uppercase tracking-[0.25em] pt-8 pb-3">Categories</p>
                {categories.map((cat, i) => (
                  <motion.div key={cat.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 + i * 0.04 }}>
                    <Link to={cat.path} className="block py-2.5 text-sm font-jost text-navy-500 hover:text-navy-900 transition-colors">
                      {cat.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}