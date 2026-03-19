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

export default function Navbar({ cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/Home" className="flex items-center gap-2 group">
              <div className="w-8 h-8 border-2 border-navy-900 rounded-md flex items-center justify-center group-hover:bg-navy-900 transition-colors duration-300">
                <div className="w-3 h-3 bg-navy-900 rounded-sm group-hover:bg-white transition-colors duration-300" />
              </div>
              <div>
                <span className="text-navy-900 text-lg font-bold tracking-tight">YUCCA</span>
                <span className="hidden sm:inline text-navy-500 text-[10px] ml-1 tracking-[0.2em] uppercase">Packaging</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 relative group ${
                    location.pathname === link.path ? 'text-navy-900' : 'text-navy-600 hover:text-navy-900'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-navy-900 transition-all duration-300 ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              <Link to="/Shop" className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-navy-50 transition-colors">
                <Search className="w-[18px] h-[18px] text-navy-700" />
              </Link>
              <Link to="/Cart" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-navy-50 transition-colors">
                <ShoppingBag className="w-[18px] h-[18px] text-navy-700" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-navy-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden w-9 h-9 flex items-center justify-center"
              >
                <Menu className="w-5 h-5 text-navy-900" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-[60]"
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
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <span className="text-lg font-bold text-navy-900">Menu</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5 text-navy-700" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <div className="space-y-1 mb-8">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className="flex items-center justify-between py-3 text-lg font-medium text-navy-900 border-b border-border"
                      >
                        {link.label}
                        <ChevronRight className="w-4 h-4 text-navy-400" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-navy-400 uppercase tracking-widest mb-4">Categories</p>
                <div className="space-y-1">
                  {categories.map((cat, i) => (
                    <motion.div
                      key={cat.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.03 }}
                    >
                      <Link
                        to={cat.path}
                        className="block py-2 text-sm text-navy-600 hover:text-navy-900 transition-colors"
                      >
                        {cat.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}