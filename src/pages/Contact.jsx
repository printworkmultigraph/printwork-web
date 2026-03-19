import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate send
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setSending(false);
  };

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-navy-400 text-xs tracking-[0.3em] uppercase mb-4">Get in touch</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-navy-900 mb-6">
                Let's work<br /><span className="italic text-navy-500">together.</span>
              </h1>
              <p className="text-navy-500 leading-relaxed mb-12 max-w-md">
                With your vision and our skills, we can reshape the future of packaging. Tell us about your project and we'll get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-navy-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Address</p>
                    <p className="text-sm text-navy-500">Paarl, Western Cape, South Africa</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-navy-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Phone</p>
                    <p className="text-sm text-navy-500">+27 (0) 21 863 0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-navy-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Email</p>
                    <p className="text-sm text-navy-500">info@yucca.co.za</p>
                  </div>
                </div>
              </div>
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
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-display font-medium text-navy-900 mb-3">Message Sent!</h2>
                  <p className="text-navy-500 max-w-sm">Thank you for getting in touch. We'll respond within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2 block">Name</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full px-5 py-3.5 bg-secondary rounded-xl text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2 block">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full px-5 py-3.5 bg-secondary rounded-xl text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2 block">Company</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={e => setForm({...form, company: e.target.value})}
                      className="w-full px-5 py-3.5 bg-secondary rounded-xl text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2 block">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      className="w-full px-5 py-3.5 bg-secondary rounded-xl text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 resize-none"
                      placeholder="Tell us about your project..."
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
                        Send Message
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