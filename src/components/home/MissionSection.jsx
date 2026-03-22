import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SplitLines, FadeUp, SplitCharacters } from '../SplitText';
import TiltCard from '../TiltCard';
import MagneticButton from '../MagneticButton';

export default function MissionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 lg:py-36 bg-white overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24">

        {/* Heading */}
        <div className="text-center mb-28">
          <div className="flex flex-col items-center gap-1 mb-8">
            <SplitCharacters
              delay={0}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-navy-900 leading-[1.1]"
            >
              Berkomitmen pada Kualitas,
            </SplitCharacters>
            <SplitLines
              lines={['Selalu Berinovasi']}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-navy-900 leading-[1.1]"
              delay={0.4}
            />
          </div>
          <FadeUp delay={0.6}>
            <p className="text-base font-jost text-navy-400 max-w-lg mx-auto leading-relaxed">
              Kemasan luar biasa adalah janji kami. Kami menggabungkan presisi teknis dengan kreativitas visual untuk membangun brand Anda. Sertifikasi ISO 9001:2015 & FSSC 22000.
            </p>
          </FadeUp>
        </div>
        
        {/* ... existing mission cards ... */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Mission Card 1 */}
          <TiltCard className="h-full">
            <motion.div
              className="relative h-[450px] lg:h-[500px] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-navy-900/10"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            >
              <img 
                src="/images/service_printing.png" 
                alt="Printing Mission" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
              <div className="absolute inset-0 p-10 lg:p-14 flex flex-col justify-end">
                <span className="text-[11px] font-jost text-white/50 tracking-[0.4em] uppercase mb-4 block">Misi Kami</span>
                <h3 className="font-display text-3xl lg:text-4xl text-white font-medium leading-tight mb-6">
                  Memberdayakan <em className="italic font-light opacity-80">Bisnis Lokal</em> Melalui Kualitas.
                </h3>
                <p className="font-jost text-sm text-white/70 leading-relaxed max-w-sm">
                  Menyediakan kemasan makanan custom berkualitas tinggi dengan harga terjangkau bagi UMKM hingga korporasi besar.
                </p>
              </div>
            </motion.div>
          </TiltCard>

          {/* Mission Card 2 */}
          <TiltCard className="h-full">
            <motion.div
              className="relative h-[450px] lg:h-[500px] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-navy-900/10"
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            >
              <img 
                src="/images/service_packaging.png" 
                alt="Packaging Vision" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
              <div className="absolute inset-0 p-10 lg:p-14 flex flex-col justify-end">
                <span className="text-[11px] font-jost text-white/50 tracking-[0.4em] uppercase mb-4 block">Visi Kami</span>
                <h3 className="font-display text-3xl lg:text-4xl text-white font-medium leading-tight mb-6">
                  Menjadi Standar <em className="italic font-light opacity-80">Inovasi</em> Kemasan.
                </h3>
                <p className="font-jost text-sm text-white/70 leading-relaxed max-w-sm">
                  Dikenal karena kualitas cetak premium, pelayanan cepat, dan komitmen pada solusi kemasan berkelanjutan.
                </p>
              </div>
            </motion.div>
          </TiltCard>
        </div>

        <FadeUp delay={0.4} className="flex justify-center mt-20">
          <MagneticButton strength={20}>
            <Link
              to="/About"
              className="group relative inline-flex items-center gap-4 px-10 py-5 bg-navy-900 text-white rounded-full overflow-hidden transition-all duration-300 hover:bg-black shadow-xl shadow-navy-900/20"
            >
              <span className="relative z-10 font-jost font-semibold text-sm tracking-widest uppercase">Pelajari Filosofi Kami</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-transform duration-300 group-hover:translate-x-2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </MagneticButton>
        </FadeUp>
      </div>
    </section>
  );
}
