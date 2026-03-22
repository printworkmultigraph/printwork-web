import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const promos = [
  {
    id: 1,
    title: 'Solusi Kemasan UMKM',
    subtitle: 'Mulai dari 500 Pcs',
    description: 'Cetak logo brand Anda dengan harga terjangkau.',
    bg: 'bg-[#F4F4F4]',
    color: 'text-navy-900',
    tag: 'Best Seller',
    image: '/images/promo_umkm_poster.png',
    format: 'poster',
    badge: 'Min. 500 Pcs'
  },
  {
    id: 2,
    title: 'Ramadan Berkah',
    subtitle: 'Diskon s.d 20%',
    description: 'Bikin hampers makin premium.',
    bg: 'bg-[#0F172A]',
    color: 'text-white',
    tag: 'Special',
    image: '/images/pdf_image_509.png',
    format: 'poster',
    badge: 'DISKON 20%',
    accentColor: 'text-yellow-400'
  },
  {
    id: 3,
    title: 'Super Brand Day',
    subtitle: 'Free Ongkir*',
    description: 'Upgrade kualitas ke Food Grade.',
    bg: 'bg-[#EAEAEA]',
    color: 'text-navy-900',
    tag: 'Offer',
    image: '/images/pdf_image_528.jpeg',
    format: 'poster',
    badge: 'FREE ONGKIR*',
    accentColor: 'text-navy-600'
  }
];

export default function PromoSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % promos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((current + 1) % promos.length);
  const prev = () => setCurrent((current - 1 + promos.length) % promos.length);

  return (
    <div className="relative w-full overflow-hidden mb-4 group">
      <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24">
        <div className="relative h-[160px] md:h-[220px] w-full rounded-[1.5rem] overflow-hidden shadow-xl shadow-navy-900/5 transition-all duration-700">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className={`absolute inset-0 ${promos[current].bg} flex items-center`}
            >
              <motion.div 
                 className="absolute inset-0 w-full h-full"
                 initial={{ scale: 1.1 }}
                 animate={{ scale: 1 }}
                 transition={{ duration: 6, ease: "linear" }}
              >
                <img src={promos[current].image} alt="" className="w-full h-full object-cover" />
                <div className={`absolute inset-0 ${
                  promos[current].id === 2 ? 'bg-navy-900/60' : 'bg-white/10'
                }`} />
              </motion.div>

              <div className="relative z-10 w-full h-full p-6 md:p-10 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-sm"
                >
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[8px] font-bold uppercase tracking-wider mb-2 border border-white/20 text-current">
                    {promos[current].tag}
                  </span>
                  <h2 className={`text-xl md:text-2xl font-display font-semibold mb-1 leading-tight ${promos[current].color}`}>
                    {promos[current].title}
                  </h2>
                  <p className={`text-sm md:text-base font-display italic opacity-80 ${promos[current].color}`}>
                    {promos[current].subtitle}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-6 md:top-8 md:right-10 z-20"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center text-center shadow-lg ${
                  promos[current].id === 2 ? 'bg-yellow-400 text-navy-900' : 'bg-navy-900 text-white'
                }`}>
                  <span className="text-[9px] font-black leading-none">{promos[current].badge}</span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 right-8 flex items-center gap-3 z-20">
            <button onClick={prev} className="w-6 h-6 rounded-full border border-current opacity-20 hover:opacity-100 flex items-center justify-center"><ChevronLeft size={14} /></button>
            <div className="flex gap-1">
              {promos.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`h-1 rounded-full transition-all ${current === i ? 'w-4 bg-current' : 'w-1 bg-current opacity-20'}`} />
              ))}
            </div>
            <button onClick={next} className="w-6 h-6 rounded-full border border-current opacity-20 hover:opacity-100 flex items-center justify-center"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
