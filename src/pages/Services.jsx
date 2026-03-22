import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PenTool, Layers, Hexagon, Truck } from 'lucide-react';

const EASE = [0.76, 0, 0.24, 1];

const services = [
  {
    icon: PenTool,
    title: 'Desain & Inovasi',
    desc: 'Tim desain in-house kami siap membantu menerjemahkan visi brand Anda menjadi desain struktural dan grafis kemasan yang estetis, fungsional, dan aman untuk produk.',
    features: ['Custom dieline & structural design', 'Color matching (Pantone)', '3D Mockup Prototyping']
  },
  {
    icon: Hexagon,
    title: 'Manufaktur Presisi (Heidelberg)',
    desc: 'Menggunakan mesin offset Heidelberg dari Jerman, kami menjamin konsistensi warna, ketajaman cetak, dan kapasitas produksi masif untuk memenuhi kebutuhan harian franchise F&B nasional.',
    features: ['Kapasitas >10.000pcs/hari', 'Tinta Food Series Bersertifikat', 'Akurasi Warna Tinggi']
  },
  {
    icon: Layers,
    title: 'Finishing & Perakitan',
    desc: 'Kami menyediakan berbagai opsi finishing eksklusif untuk mendongkrak sensasi premium pada kemasan Anda, mulai dari laminasi food-grade hingga hot print emas.',
    features: ['Laminasi Dalam (Tahan Air/Minyak)', 'Hot Print Foil & Emboss', 'Die-cut & Window Patching']
  },
  {
    icon: Truck,
    title: 'Manajemen Logistik',
    desc: 'Dengan jaringan distribusi yang luas, kami memastikan kemasan Anda tiba tepat waktu di berbagai outlet cabang seluruh Indonesia dengan kondisi persis seperti saat keluar dari pabrik.',
    features: ['Pengemasan karton tebal', 'Quality Control akhir', 'Pengiriman seluruh Indonesia']
  }
];

export default function Services() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 min-h-screen bg-white">
        <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24">
          
          {/* Header */}
          <motion.div 
            className="mb-24 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="text-navy-400 text-xs tracking-[0.3em] uppercase mb-6">Layanan Kami</p>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium text-navy-900 leading-[1.1] mb-8">
              Solusi Kemasan <span className="italic text-navy-500">Terintegrasi.</span>
            </h1>
            <p className="text-lg text-navy-600 leading-relaxed font-light px-4">
              Dari sketsa awal hingga distribusi massal, infrastruktur kelas dunia kami dirancang untuk menghadirkan kemasan makanan berkualitas tanpa kompromi.
            </p>
          </motion.div>

          {/* Service Steps */}
          <div className="space-y-32">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <div className={`order-2 ${i % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="w-16 h-16 bg-navy-50 text-navy-900 rounded-2xl flex items-center justify-center mb-8">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-display font-medium text-navy-900 mb-6">{service.title}</h3>
                  <p className="text-navy-600 text-lg leading-relaxed mb-8">{service.desc}</p>
                  
                  <ul className="space-y-4">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-4 text-navy-900 font-medium">
                        <span className="w-2 h-2 bg-navy-300 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`order-1 ${i % 2 === 1 ? 'lg:order-2' : 'lg:order-1'} bg-secondary rounded-[3rem] aspect-square flex items-center justify-center relative overflow-hidden group`}>
                   {/* Abstract representation placeholders since we don't have dedicated service images yet, or we can use existing service images */}
                   <img 
                      src={`/images/service_${['design', 'manufacturing', 'packaging', 'distribution'][i]}.png`} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1616423405785-5a7c5553baca?q=80&w=800&auto=format&fit=crop';
                      }}
                   />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-32 border-t border-navy-100 pt-16 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
             <p className="text-navy-500 mb-6">Butuh detail teknis atau penawaran harga?</p>
             <a href="/Contact" className="px-10 py-4 bg-navy-900 text-white rounded-full font-semibold uppercase tracking-widest text-sm hover:bg-navy-800 transition-colors">
               Hubungi Tim Sales Sales
             </a>
          </motion.div>

        </div>
      </main>
      <Footer />
    </>
  );
}
