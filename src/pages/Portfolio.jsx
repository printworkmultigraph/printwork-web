import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TiltCard from '../components/TiltCard';

const EASE = [0.76, 0, 0.24, 1];

// Portfolio data mock
// Portfolio data refined for better narrative and layout
const portfolioItems = [
  { 
    id: 3, 
    client: 'Mercu Buana', 
    title: 'Map & Box Custom', 
    description: 'Pengembangan identitas visual kampus melalui map eksklusif dan box arsip custom dengan finishing laminasi doff premium yang elegan.',
    image: '/images/pdf_image_401.jpeg', 
    colSpan: 'col-span-12 md:col-span-4', 
    aspect: 'aspect-[4/5]' 
  },
  { 
    id: 4, 
    client: 'Jotun Indonesia', 
    title: 'Display & Promotion', 
    description: 'Produksi display promosi berskala besar dengan akurasi warna brand yang presisi menggunakan teknologi cetak Heidelberg 5 warna.',
    image: '/images/pdf_image_424.jpeg', 
    colSpan: 'col-span-12 md:col-span-4', 
    aspect: 'aspect-[4/5]' 
  },
  { 
    id: 5, 
    client: 'Astra International', 
    title: 'Cetak Buku Eksklusif', 
    description: 'Cetak buku laporan tahunan premium dengan teknik binding hardcover dan detail gold foil untuk kesan korporat yang mewah.',
    image: '/images/pdf_image_316.jpeg', 
    colSpan: 'col-span-12 md:col-span-4', 
    aspect: 'aspect-[4/5]' 
  },
];

const clients = [
  '/images/sponsors/Astra_International-Logo.wine.png',
  '/images/sponsors/Picsart_26-03-03_15-53-02-265.png',
  '/images/sponsors/Picsart_26-03-03_15-53-12-322.png',
  '/images/sponsors/Picsart_26-03-03_15-53-22-748.png',
  '/images/sponsors/Picsart_26-03-03_15-53-35-268.png',
  '/images/sponsors/Picsart_26-03-03_15-53-46-729.png',
  '/images/sponsors/Picsart_26-03-03_15-54-07-771.png',
  '/images/sponsors/jotun-official.png'
];

export default function Portfolio() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 min-h-screen bg-white transition-all duration-300">
        <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24">
          
          {/* Header */}
          <motion.div 
            className="mb-20 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="text-navy-400 text-xs tracking-[0.3em] uppercase mb-6">Pekerjaan Kami</p>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium text-navy-900 leading-[1.1] mb-8">
              Karya Kemasan <span className="italic text-navy-500">Terbaik.</span>
            </h1>
            <p className="text-lg text-navy-600 leading-relaxed font-light">
              Menjadi mitra strategis di balik kemasan brand F&B ternama di Indonesia. Dari konsep hingga produksi berskala besar, kualitas adalah komitmen utama kami.
            </p>
          </motion.div>

          {/* Client Logo Grid */}
          <motion.div 
            className="mb-32 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {clients.map((client, i) => {
              const isAstra = client.toLowerCase().includes('astra');
              const isMercu = client.toLowerCase().includes('15-53-12-322');
              
              const scaleClass = isAstra ? 'scale-[2.8]' : (isMercu ? 'scale-[2.0]' : '');

              return (
                <div key={i} className="flex items-center justify-center p-6 border border-navy-100 rounded-2xl grayscale hover:grayscale-0 transition-all duration-500">
                  <img 
                    src={client} 
                    alt="Sponsor Logo" 
                    className={`h-10 md:h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-all duration-300 ${scaleClass}`} 
                  />
                </div>
              );
            })}
          </motion.div>

          {/* Portfolio Grid Masonry-style */}
          <div className="grid grid-cols-12 gap-8 md:gap-10">
            {portfolioItems.map((item, i) => (
              <motion.div 
                key={item.id}
                className={`${item.colSpan} group relative`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
              >
                <TiltCard className="w-full h-full">
                  <div className={`${item.aspect} w-full relative overflow-hidden rounded-[2rem] bg-navy-50 border border-navy-100/50`}>
                    <img 
                      src={item.image} 
                      alt={item.client}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    
                    {/* Light gradient for readability on white/light backgrounds */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 z-10 transition-all duration-500 text-left">
                      <div className="overflow-hidden">
                        <motion.h3 
                          className="text-2xl md:text-3xl font-display font-medium text-navy-900 mb-3"
                          initial={{ y: 30, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + (i * 0.1) }}
                        >
                          {item.title}
                        </motion.h3>
                      </div>
                      <div className="overflow-hidden">
                        <motion.p 
                          className="text-navy-700 text-sm leading-relaxed mb-6 line-clamp-3 font-medium"
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + (i * 0.1) }}
                        >
                          {item.description}
                        </motion.p>
                      </div>
                      <div className="overflow-hidden mt-auto pt-4 border-t border-navy-900/10">
                        <motion.p 
                          className="text-navy-400 text-[10px] md:text-xs tracking-widest uppercase font-bold"
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + (i * 0.1) }}
                        >
                          Client: {item.client}
                        </motion.p>
                      </div>
                    </div>

                    {/* Reveal hover interaction strip */}
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                       <div className="w-12 h-12 rounded-full border border-navy-900/10 flex items-center justify-center text-navy-900 backdrop-blur-sm">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-45 transition-transform duration-500">
                            <path d="M1 14L14 1M14 1H5M14 1V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                       </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div 
            className="mt-32 p-12 md:p-24 bg-navy-900 rounded-[3rem] text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-8">
              Siap Meningkatkan Nilai <br/>Brand Anda?
            </h2>
            <a href="/Contact" className="inline-flex items-center justify-center px-10 py-5 bg-white text-navy-900 font-semibold tracking-widest uppercase text-sm rounded-full hover:bg-navy-50 transition-colors">
              Mulai Konsultasi
            </a>
          </motion.div>

        </div>
      </main>
      <Footer />
    </>
  );
}
