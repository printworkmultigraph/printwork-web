import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star, Leaf, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HeroLine, FadeUp, SplitCharacters } from '../components/SplitText';
import MagneticButton from '../components/MagneticButton';
import { products } from '../data/products';

const applications = [
  'Daging & Ayam', 'Seafood', 'Makanan Siap Saji', 'Makanan Beku',
  'Produk Susu', 'Makanan Olahan', 'Makanan Spesialis', 'Produk Ekspor',
];

const features = [
  {
    icon: Shield,
    title: 'Masa Simpan Diperpanjang',
    description: 'Solusi kemasan kami dirancang untuk menjaga kesegaran, memperpanjang masa simpan, dan menjaga kualitas produk di seluruh rantai pasokan.',
  },
  {
    icon: Star,
    title: 'Desain Anti Bocor',
    description: 'Minimalkan kebocoran dan kurangi limbah dengan kemasan yang dirancang khusus untuk aplikasi pemrosesan makanan.',
  },
  {
    icon: Leaf,
    title: 'Material Berkelanjutan',
    description: 'Pilih dari bahan yang dapat didaur ulang, kompos, dan bahan daur ulang yang memenuhi tujuan keberlanjutan Anda.',
  },
  {
    icon: Check,
    title: 'Kepatuhan Global',
    description: 'Semua kemasan kami memenuhi standar keamanan pangan internasional termasuk sertifikasi FDA, EU, dan FSSC 22000.',
  },
];

export default function FoodProcessing() {
  const featuredProducts = products.filter(p => 
    ['Lunch Box', 'Food Pail'].includes(p.category)
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Luxury Hero Section */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-white">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-left">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block text-[10px] font-jost font-bold tracking-[0.4em] uppercase mb-8 text-[#a3a3a3]"
              >
                Divisi Pemrosesan Makanan
              </motion.span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium leading-[0.9] tracking-tighter mb-10 text-navy-900">
                <HeroLine delay={0.1}>Presisi untuk</HeroLine> 
                <HeroLine delay={0.2}><span className="text-navy-400 italic">Kualitas.</span></HeroLine>
              </h1>
              <p className="text-lg md:text-xl text-navy-500 leading-relaxed mb-12 font-jost font-light max-w-xl">
                Solusi kemasan yang dirancang untuk memperpanjang masa simpan, meminimalkan kebocoran, dan menjaga kesegaran produk makanan olahan Anda.
              </p>
              
              <MagneticButton strength={30}>
                <Link to="/Contact" className="inline-flex items-center gap-4 px-10 py-5 bg-navy-900 text-white text-[10px] font-jost font-bold tracking-[0.2em] uppercase rounded-full shadow-2xl shadow-navy-900/20 hover:bg-black transition-all duration-500 group">
                  Hubungi Kami
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </MagneticButton>
            </div>
            
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="absolute -inset-4 bg-navy-900/5 rounded-[4rem] blur-3xl group-hover:bg-navy-900/10 transition-colors" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl">
                <img
                  src="/images/lunch box yamie food grade.png"
                  alt="Food Processing Packaging"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Applications Strip */}
      <section className="py-20 bg-secondary overflow-hidden">
        <div className="flex flex-col gap-10">
          <div className="flex whitespace-nowrap gap-10 animate-marquee hover:pause">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-10">
                {applications.map(app => (
                  <span key={app} className="text-2xl md:text-4xl font-display font-medium text-navy-900 opacity-60 hover:opacity-100 transition-opacity">
                    {app} —
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid — Luxury Aesthetic */}
      <section className="py-24 md:py-40 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <span className="inline-block text-[10px] font-jost font-bold tracking-[0.4em] uppercase mb-4 text-[#a3a3a3]">Keunggulan Utama</span>
            <h2 className="text-4xl md:text-6xl font-display font-medium tracking-tighter text-navy-900">
              Mengapa Memilih <span className="italic text-navy-400">Printwork.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <FadeUp key={feature.title} delay={index * 0.1}>
                <div className="group flex gap-10 p-10 bg-[#fcfcfc] rounded-[2.5rem] border border-transparent hover:border-navy-900/10 hover:bg-white hover:shadow-2xl transition-all duration-700">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border border-[#f0f0f0] group-hover:border-navy-900/50 transition-colors">
                    <feature.icon className="w-6 h-6 text-navy-900" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-medium mb-4 text-navy-900">{feature.title}</h3>
                    <p className="text-navy-500 text-sm font-jost font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
