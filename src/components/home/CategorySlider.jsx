import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import HorizontalSlider from '../HorizontalSlider';
import { LineReveal, FadeUp, SplitCharacters } from '../SplitText';
import TiltCard from '../TiltCard';
import MagneticButton from '../MagneticButton';
import LiquidImage from '../LiquidImage';

const EASE = [0.76, 0, 0.24, 1];

const categories = [
  {
    title: 'Lunch Box',
    description: 'Custom lunch box dengan model selip dan yamie. Material Eco-Kraft & Food Grade.',
    path: '/Shop?category=Lunch Box',
    image: '/images/lunch box eco-kraft 1.png',
  },
  {
    title: 'Food Pail',
    description: 'Food pail model tekuk untuk rice box dan nasi kotak. Tahan minyak dan air.',
    path: '/Shop?category=Food Pail',
    image: '/images/food pail eco-kraft.png',
  },
  {
    title: 'Fried Chicken',
    description: 'Dus ayam goreng, ayam geprek, dan fried chicken. Branding custom untuk bisnis Anda.',
    path: '/Shop?category=Fried Chicken',
    image: '/images/dus fried chicken eco-kraft 275 gr.png',
  },
  {
    title: 'Kantong Kertas',
    description: 'Kertas nasi, food wrapping, standing pouch, dan sachet metalized custom cetak.',
    path: '/Shop?category=Kantong Kertas',
    image: '/images/standing pouch paper metalized.png',
  },
];

function CategoryCard({ cat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <Link ref={ref} to={cat.path} className="flex-shrink-0 w-[290px] sm:w-[350px] lg:w-[390px] group block">
      <TiltCard>
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-5 bg-secondary shadow-xl shadow-navy-900/5 group-hover:shadow-2xl transition-shadow duration-500">
          <LiquidImage 
            src={cat.image} 
            alt={cat.title} 
            className="absolute inset-0 w-full h-full"
            delay={index * 0.1}
          />
          
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
            >
              <SplitCharacters delay={index * 0.1 + 0.5} className="text-white text-3xl font-display font-medium block leading-tight mb-2">
                {cat.title}
              </SplitCharacters>
              <div className="h-0.5 w-10 bg-white/40 mb-4 group-hover:w-16 transition-all duration-500" />
              
              <MagneticButton strength={15}>
                <div className="flex items-center gap-2 text-white/70 text-xs font-jost font-semibold uppercase tracking-widest group-hover:text-white transition-colors">
                  Lihat Koleksi <span className="text-lg">→</span>
                </div>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </TiltCard>
      <FadeUp delay={index * 0.08 + 0.2}>
        <p className="text-sm font-jost text-navy-400 group-hover:text-navy-900 transition-colors duration-300 leading-relaxed">{cat.description}</p>
      </FadeUp>
    </Link>
  );
}

export default function CategorySlider() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-24 lg:py-36 bg-white overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-8 md:px-12 lg:px-16">
        <div ref={ref} className="flex items-end justify-between mb-20">
          <div>
            <LineReveal delay={0}>
              <span className="text-[10px] font-jost text-navy-300 tracking-[0.4em] uppercase block mb-4">Pilihan Terbaik</span>
            </LineReveal>
            <LineReveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-navy-900 leading-tight">
                Kategori <em className="font-light text-navy-300 not-italic">Produk</em>
              </h2>
            </LineReveal>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.4 }}>
            <MagneticButton strength={20}>
              <Link to="/Shop" className="hidden md:flex flex-col group overflow-hidden h-6">
                <span className="text-sm font-jost text-navy-400 group-hover:-translate-y-full transition-transform duration-500 ease-expo">Eksplorasi Semua →</span>
                <span className="text-sm font-jost text-navy-900 group-hover:-translate-y-full transition-transform duration-500 ease-expo">Eksplorasi Semua →</span>
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        <HorizontalSlider>
          {categories.map((cat, i) => (
            <CategoryCard key={cat.title} cat={cat} index={i} />
          ))}
        </HorizontalSlider>
      </div>
    </section>
  );
}
