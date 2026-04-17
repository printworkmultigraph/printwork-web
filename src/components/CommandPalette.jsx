import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Info, Phone, Command as CmdIcon, ArrowRight, Settings } from 'lucide-react';
import { products } from '../data/products';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Listen for custom event from Navbar search button
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('openCommandPalette', handleOpen);
    return () => window.removeEventListener('openCommandPalette', handleOpen);
  }, []);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-full max-w-[640px] px-4 relative"
          >
            <Command
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
              label="Global Command Menu"
            >
              <div className="flex items-center px-4 border-b border-gray-100" cmdk-input-wrapper="">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <Command.Input 
                  autoFocus
                  placeholder="Cari produk, layanan, atau tekan enter..." 
                  className="flex-1 h-14 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-[15px]" 
                />
                <div className="hidden sm:flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-semibold">esc</kbd>
                </div>
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                <Command.Empty className="py-12 px-4 text-center text-sm text-gray-500">
                  Tidak ada hasil ditemukan.
                </Command.Empty>

                <Command.Group heading="Halaman">
                  <Command.Item onSelect={() => runCommand(() => navigate('/Shop'))} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 aria-[selected=true]:bg-gray-100 aria-[selected=true]:text-gray-900">
                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                    Belanja Packaging
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => navigate('/Portfolio'))} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 aria-[selected=true]:bg-gray-100 aria-[selected=true]:text-gray-900">
                    <Info className="w-4 h-4 text-gray-400" />
                    Portfolio Kami
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => navigate('/Contact'))} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 aria-[selected=true]:bg-gray-100 aria-[selected=true]:text-gray-900">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Hubungi Printwork
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Produk Best Seller">
                  {products.slice(0, 4).map(product => (
                    <Command.Item 
                      key={product.id}
                      onSelect={() => runCommand(() => navigate(`/ProductDetail?id=${product.id}`))} 
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 aria-[selected=true]:bg-gray-100 aria-[selected=true]:text-gray-900"
                    >
                      <img src={product.image} alt={product.name} className="w-6 h-6 object-cover rounded-md" />
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-xs text-gray-400">{product.category}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-gray-400" />
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Admin">
                  <Command.Item onSelect={() => runCommand(() => navigate('/Admin'))} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 aria-[selected=true]:bg-gray-100 aria-[selected=true]:text-gray-900">
                    <Settings className="w-4 h-4 text-gray-400" />
                    Admin Dashboard
                  </Command.Item>
                </Command.Group>
                
              </Command.List>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                  <CmdIcon className="w-3.5 h-3.5" />
                  Printwork Command
                </span>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1">Pilih <kbd className="bg-white border rounded px-1.5 py-0.5 ml-1">↵</kbd></span>
                  <span className="flex items-center gap-1">Navigasi <kbd className="bg-white border rounded px-1.5 py-0.5 ml-1">↑↓</kbd></span>
                </div>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
