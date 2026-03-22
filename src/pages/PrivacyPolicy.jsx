import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HeroLine, FadeUp } from '../components/SplitText';

const tabs = ['Kebijakan Privasi', 'Manual PAIA'];

export default function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState('Kebijakan Privasi');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Luxury Hero Section */}
      <section className="relative pt-40 pb-12 md:pt-48 md:pb-16 overflow-hidden bg-white">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          <div className="text-left">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block text-[10px] font-jost font-bold tracking-[0.4em] uppercase mb-8 text-[#a3a3a3]"
            >
              Legal & Kepatuhan
            </motion.span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium leading-[0.85] tracking-tighter mb-10 text-navy-900">
              <HeroLine delay={0.1}>Kebijakan</HeroLine>
              <HeroLine delay={0.2}><span className="text-navy-400 italic">Privasi.</span></HeroLine>
            </h1>
          </div>
        </div>
      </section>

      {/* Tabs — Sleek Luxury Navigation */}
      <section className="sticky top-[70px] z-30 bg-white/80 backdrop-blur-2xl border-b border-[#f0f0f0]">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex gap-4 py-6 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-full text-[10px] font-jost font-bold tracking-[0.2em] uppercase transition-all duration-500 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-navy-900 text-white shadow-xl shadow-navy-900/20'
                    : 'bg-[#fcfcfc] text-[#737373] hover:bg-[#f0f0f0] border border-[#f0f0f0]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content — Modern Minimalist Container */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-4xl mx-auto bg-[#fcfcfc] rounded-[3rem] p-8 md:p-20 border border-[#f0f0f0] shadow-sm">
            {activeTab === 'Kebijakan Privasi' ? (
              <FadeUp>
                <div className="space-y-12">
                  <div>
                    <h2 className="text-2xl font-display font-medium mb-6 text-navy-900">1. DEFINISI & SINGKATAN</h2>
                    <div className="space-y-4 text-sm font-jost text-navy-500 leading-relaxed">
                      <p><strong className="text-navy-900">1.1. "B2B"</strong> berarti setiap transaksi antara PRINTWORK dan entitas hukum lainnya untuk pasokan barang dan/atau jasa;</p>
                      <p><strong className="text-navy-900">1.2. "Subjek Data"</strong> berarti setiap orang pribadi atau badan hukum yang Informasi Pribadinya diproses oleh PRINTWORK;</p>
                      <p><strong className="text-navy-900">1.3. "Informasi Pribadi"</strong> berarti informasi pribadi sebagaimana didefinisikan dalam undang-undang yang berlaku;</p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-display font-medium mb-6 text-navy-900">2. TUJUAN KEBIJAKAN</h2>
                    <p className="text-sm font-jost text-navy-500 leading-relaxed">
                      Kebijakan Privasi ini menetapkan bagaimana Printwork Indonesia mengumpulkan, menggunakan, mengungkapkan, dan melindungi Informasi Pribadi Anda sesuai dengan hukum perlindungan data yang berlaku.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-display font-medium mb-6 text-navy-900">3. INFORMASI YANG KAMI KUMPULKAN</h2>
                    <ul className="list-disc list-inside space-y-3 text-sm font-jost text-navy-500 leading-relaxed">
                      <li>Informasi kontak (nama, email, nomor telepon, alamat fisik)</li>
                      <li>Informasi bisnis (nama perusahaan, nomor registrasi, NPWP)</li>
                      <li>Informasi pembayaran dan penagihan</li>
                      <li>Riwayat pesanan dan preferensi</li>
                      <li>Data penggunaan situs web dan cookies</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-display font-medium mb-6 text-navy-900">4. PENGGUNAAN INFORMASI</h2>
                    <ul className="list-disc list-inside space-y-3 text-sm font-jost text-navy-500 leading-relaxed">
                      <li>Memproses dan memenuhi pesanan Anda</li>
                      <li>Berkomunikasi tentang pesanan dan akun Anda</li>
                      <li>Memberikan dukungan pelanggan</li>
                      <li>Meningkatkan produk dan layanan kami</li>
                      <li>Kepatuhan hukum dan peraturan</li>
                    </ul>
                  </div>

                  <div className="pt-12 border-t border-[#f0f0f0]">
                    <p className="text-[10px] font-jost text-[#a3a3a3] italic uppercase tracking-widest">
                      Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ) : (
              <FadeUp>
                <div className="space-y-12">
                  <h2 className="text-2xl font-display font-medium mb-6 text-navy-900">MANUAL PAIA</h2>
                  <p className="text-sm font-jost text-navy-500 leading-relaxed">
                    Sesuai dengan peraturan yang berlaku, Printwork Indonesia telah menyiapkan Manual ini untuk membantu orang yang ingin meminta akses ke informasi.
                  </p>

                  <div>
                    <h3 className="text-xl font-display font-medium mb-4 text-navy-900">DETAIL KONTAK</h3>
                    <div className="space-y-2 text-sm font-jost text-navy-500">
                      <p><strong className="text-navy-900">Email:</strong> info@printwork.id</p>
                      <p><strong className="text-navy-900">Alamat:</strong> Jakarta, Indonesia</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
