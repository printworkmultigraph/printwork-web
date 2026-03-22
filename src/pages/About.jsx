import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MarqueeStrip from '../components/MarqueeStrip';

const ABOUT_IMAGE = '/images/service_manufacturing.png';

const timeline = [
  { year: '2010', title: 'Awal mula perjalanan', desc: 'PT Printwork Indonesia didirikan dengan visi menjadi penyedia kemasan makanan custom terdepan di Indonesia.' },
  { year: '2014', title: 'Ekspansi kapasitas produksi', desc: 'Menambah lini produksi cetak dan finishing untuk memenuhi permintaan pasar yang terus berkembang.' },
  { year: '2018', title: 'Sertifikasi kualitas', desc: 'Meraih sertifikasi ISO 9001:2015 dan FSSC 22000 untuk menjamin standar kualitas dan keamanan pangan.' },
  { year: '2022', title: 'Inovasi material', desc: 'Menghadirkan material Food Grade (Foopak) dan Paper Metalized untuk jawab kebutuhan kemasan modern.' },
  { year: '2025', title: 'Mitra terpercaya', desc: 'Melayani ribuan pelaku usaha F&B dari skala UMKM hingga brand nasional di seluruh Indonesia.' },
];

const values = ['Kualitas Terjamin', 'Efisiensi Produksi', 'Fokus Pelanggan', 'Keamanan Pangan', 'Ramah Lingkungan', 'Kolaborasi', 'Integritas', 'Inovasi', 'Keandalan', 'Sertifikasi'];

const team = [
  { name: 'Direktur Utama', role: 'Pengelolaan strategis perusahaan' },
  { name: 'Manajer Produksi', role: 'Operasional & kontrol kualitas' },
  { name: 'Manajer Pemasaran', role: 'Pengembangan pasar & klien' },
  { name: 'Tim Desain', role: 'Desain kemasan custom' },
];

export default function About() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <motion.img
            src={ABOUT_IMAGE}
            alt="Tentang PT Printwork Indonesia"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-navy-900/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-white"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Terpercaya &<br /><span className="italic">Berkualitas</span>
            </motion.h1>
          </div>
        </section>

        {/* Intro */}
        <section className="py-20 lg:py-28">
          <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24">
            <div className="max-w-3xl">
              <motion.p
                className="text-lg md:text-xl text-navy-600 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                PT Printwork Indonesia adalah perusahaan spesialis kemasan makanan custom yang telah melayani ribuan pelaku usaha F&B di seluruh Indonesia. Kami menggabungkan teknologi cetak modern dengan material berkualitas tinggi untuk menghasilkan kemasan yang tidak hanya melindungi produk, tetapi juga memperkuat identitas brand Anda.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-secondary">
          <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Perjalanan <span className="italic text-navy-500">Kami</span>
            </motion.h2>

            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-navy-200" />
              <div className="space-y-12">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${
                      i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:text-right' : ''} pl-12 md:pl-0`}>
                      <span className="text-4xl font-display font-bold text-navy-200">{item.year}</span>
                      <h3 className="text-lg font-semibold text-navy-900 mt-2">{item.title}</h3>
                      <p className="text-sm text-navy-500 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="absolute left-4 md:left-1/2 top-2 w-3 h-3 bg-navy-900 rounded-full -translate-x-1/2 ring-4 ring-secondary" />
                    <div className="md:w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission/Vision */}
        <section className="py-20 lg:py-28">
          <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900">
                Berkomitmen pada <span className="italic text-navy-500">Keunggulan</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                className="p-10 bg-secondary rounded-3xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-navy-400 text-xs tracking-[0.3em] uppercase mb-4">Misi Kami</p>
                <p className="text-navy-700 leading-relaxed">
                  Menyediakan kemasan makanan custom berkualitas tinggi dengan harga terjangkau, mendukung pelaku usaha F&B dari skala UMKM hingga korporasi besar di seluruh Indonesia.
                </p>
              </motion.div>
              <motion.div
                className="p-10 bg-navy-900 rounded-3xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-4">Visi Kami</p>
                <p className="text-white/80 leading-relaxed">
                  Menjadi penyedia kemasan makanan terpercaya dan terdepan di Indonesia, dikenal karena kualitas cetak premium, pelayanan cepat, dan komitmen pada inovasi berkelanjutan.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-secondary">
          <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900 mb-12 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Tim <span className="italic text-navy-500">Kami</span>
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-navy-200 rounded-full flex items-center justify-center">
                    <span className="text-xl font-display text-navy-600">{member.name[0]}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-navy-900">{member.name}</h3>
                  <p className="text-xs text-navy-500 mt-1">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <MarqueeStrip items={values} />
      </main>
      <Footer />
    </>
  );
}
