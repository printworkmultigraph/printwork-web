import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppFAB() {
  const [isHovered, setIsHovered] = useState(false);
  const waNumber = '6281234567890'; // Replace with actual
  const message = encodeURIComponent('Halo Printwork! Saya tertarik untuk konsultasi packaging dan cetak.');

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-sm font-semibold text-gray-800 pointer-events-auto"
          >
            Tanya Sales Kami 👋
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.a
        href={`https://wa.me/${waNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 bg-gradient-to-tr from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all pointer-events-auto cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Pulse effect */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-0" />
        
        <MessageCircle className="w-7 h-7 text-white fill-white" />
      </motion.a>
    </div>
  );
}
