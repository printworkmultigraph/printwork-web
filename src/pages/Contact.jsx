import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Check, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setSending(false);
  };

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 min-h-screen">
        <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-navy-400 text-xs tracking-[0.3em] uppercase mb-4">Hubungi Kami</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-navy-900 mb-6">
                Mari Bekerja<br /><span className="italic text-navy-500">Sama.</span>
              </h1>
              <p className="text-navy-500 leading-relaxed mb-12 max-w-md">
                Dengan visi Anda dan keahlian kami, kami bisa mewujudkan kemasan terbaik untuk bisnis Anda. Ceritakan kebutuhan Anda dan kami akan merespons dalam waktu 24 jam.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-navy-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Alamat</p>
                    <p className="text-sm text-navy-500">Jl. Cempaka Putih Timur 17 Komp. Taman Lagura Indah No. 24, Cempaka Putih, Jakarta 10510</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-navy-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Telepon / WhatsApp</p>
                    <p className="text-sm text-navy-500">+62 21 4204 170 / +62 811-1300-0966</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-navy-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Email</p>
                    <p className="text-sm text-navy-500">info@printwork.co.id</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/6281113000966?text=Halo%20Printwork,%20saya%20ingin%20konsultasi%20tentang%20kemasan%20custom."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-navy-900 text-white text-sm font-semibold tracking-wide rounded-full hover:bg-navy-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat via WhatsApp
              </a>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {sent ? (
                <motion.div
                  className="h-full flex flex-col items-center justify-center text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 bg-[#e8f0fe] rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-navy-700" />
                  </div>
                  <h2 className="text-2xl font-display font-medium text-navy-900 mb-3">Pesan Terkirim!</h2>
                  <p className="text-navy-500 max-w-sm">Terima kasih telah menghubungi kami. Kami akan merespons dalam waktu 24 jam.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2 block">Nama</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full px-5 py-4 bg-secondary rounded-xl text-base text-navy-900 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                      placeholder="Nama lengkap Anda"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2 block">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full px-5 py-4 bg-secondary rounded-xl text-base text-navy-900 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                      placeholder="email@perusahaan.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2 block">Nama Usaha</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={e => setForm({...form, company: e.target.value})}
                      className="w-full px-5 py-4 bg-secondary rounded-xl text-base text-navy-900 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                      placeholder="Nama brand/usaha Anda"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2 block">Pesan</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      className="w-full px-5 py-4 bg-secondary rounded-xl text-base text-navy-900 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 resize-none"
                      placeholder="Ceritakan kebutuhan kemasan Anda..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-navy-900 text-white text-sm font-semibold tracking-wide rounded-full hover:bg-navy-800 transition-colors disabled:opacity-60"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kirim Pesan
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
