import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HeroLine, FadeUp } from '../components/SplitText';

export default function TermsConditions() {
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
              <HeroLine delay={0.1}>Syarat &</HeroLine>
              <HeroLine delay={0.2}><span className="text-navy-400 italic">Ketentuan.</span></HeroLine>
            </h1>
          </div>
        </div>
      </section>

      {/* Content — Modern Minimalist Container */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-4xl mx-auto bg-[#fcfcfc] rounded-[3rem] p-8 md:p-20 border border-[#f0f0f0] shadow-sm">
            <FadeUp>
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-display font-medium mb-6 text-navy-900">1. PENDAHULUAN</h2>
                  <p className="text-sm font-jost text-navy-500 leading-relaxed">
                    Dengan menggunakan situs ini dan melakukan pemesanan, Anda menyetujui Syarat dan Ketentuan berikut. Harap baca dengan saksama sebelum melanjutkan transaksi.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-medium mb-6 text-navy-900">2. PEMESANAN CUSTOM</h2>
                  <p className="text-sm font-jost text-navy-500 leading-relaxed mb-4">
                    Pemesanan produk custom memerlukan persetujuan desain final dari pelanggan sebelum produksi dimulai. PRINTWORK tidak bertanggung jawab atas kesalahan desain yang telah disetujui.
                  </p>
                  <ul className="list-disc list-inside space-y-3 text-sm font-jost text-navy-500 leading-relaxed">
                    <li>Minimum order (MOQ) berlaku untuk setiap produk.</li>
                    <li>Waktu produksi adalah 7-14 hari kerja setelah persetujuan desain.</li>
                    <li>Warna cetakan mungkin sedikit berbeda dari layar karena perbedaan kalibrasi.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-medium mb-6 text-navy-900">3. PEMBAYARAN</h2>
                  <p className="text-sm font-jost text-navy-500 leading-relaxed">
                    Pembayaran penuh atau uang muka (DP) sesuai kesepakatan diperlukan untuk memulai produksi. PRINTWORK berhak menunda pengiriman hingga pembayaran dilunasi.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-medium mb-6 text-navy-900">4. PENGIRIMAN</h2>
                  <p className="text-sm font-jost text-navy-500 leading-relaxed">
                    Risiko kerusakan selama pengiriman oleh pihak ketiga (ekspedisi) berada di luar kendali PRINTWORK, namun kami akan membantu proses klaim asuransi jika tersedia.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-medium mb-6 text-navy-900">5. PEMBATALAN</h2>
                  <p className="text-sm font-jost text-navy-500 leading-relaxed">
                    Pemesanan custom yang sudah masuk tahap produksi tidak dapat dibatalkan atau direfund.
                  </p>
                </div>

                <div className="pt-12 border-t border-[#f0f0f0]">
                  <p className="text-[10px] font-jost text-[#a3a3a3] italic uppercase tracking-widest">
                    Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
