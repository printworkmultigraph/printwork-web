import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SplitLines, FadeUp } from './SplitText';

const footerLinks = {
  Produk: [
    { label: 'Semua Produk', path: '/Shop' },
    { label: 'Lunch Box', path: '/Shop?category=Lunch Box' },
    { label: 'Food Pail', path: '/Shop?category=Food Pail' },
    { label: 'Fried Chicken', path: '/Shop?category=Fried Chicken' },
    { label: 'Dus Nasi', path: '/Shop?category=Dus Nasi' },
    { label: 'Kantong Kertas', path: '/Shop?category=Kantong Kertas' },
  ],
  Perusahaan: [
    { label: 'Tentang Kami', path: '/About' },
    { label: 'Hubungi Kami', path: '/Contact' },
  ],
  Layanan: [
    { label: 'Custom Packaging', path: '/Contact' },
    { label: 'Cetak Custom', path: '/Contact' },
  ],
};

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <footer className="bg-navy-900 text-white">
      {/* CTA */}
      <div ref={ref} className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24 pt-20 pb-16 border-b border-white/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div>
            <motion.p
              className="text-[10px] font-jost text-white/30 tracking-[0.3em] uppercase mb-4"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.1 }}
            >
              Hubungi Kami
            </motion.p>
            <SplitLines
              lines={['Mari bekerja', 'sama.']}
              className="text-3xl md:text-5xl font-display font-medium"
              delay={0.1}
            />
          </div>
          <FadeUp delay={0.4}>
            <a
              href="https://wa.me/6281113000966?text=Halo%20Printwork,%20saya%20ingin%20konsultasi%20tentang%20kemasan%20custom."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 text-sm font-jost font-semibold tracking-wide rounded-full hover:bg-white/90 transition-colors group"
            >
              Hubungi via WhatsApp
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </FadeUp>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-5">
              <img 
                src="/images/new_logo.png" 
                alt="Printwork Logo" 
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-white/30 text-xs font-jost leading-relaxed max-w-[220px]">
              Solusi kemasan makanan custom berkualitas untuk bisnis F&B di seluruh Indonesia. Bersertifikat ISO 9001:2015.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white/30 text-[10px] font-jost uppercase tracking-[0.25em] mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-xs font-jost text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24 py-5 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-[11px] font-jost">© {new Date().getFullYear()} PT Printwork Indonesia. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-white/20 text-[11px] font-jost cursor-pointer hover:text-white/50 transition-colors">Kebijakan Privasi</span>
            <span className="text-white/20 text-[11px] font-jost cursor-pointer hover:text-white/50 transition-colors">Syarat & Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
