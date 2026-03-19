import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SplitLines, FadeUp } from './SplitText';

const footerLinks = {
  Shop: [
    { label: 'All Products', path: '/Shop' },
    { label: 'Coffee', path: '/Shop?category=Coffee' },
    { label: 'Takeout', path: '/Shop?category=Takeout' },
    { label: 'Deli', path: '/Shop?category=Deli' },
  ],
  Company: [
    { label: 'About Us', path: '/About' },
    { label: 'Contact', path: '/Contact' },
  ],
  Resources: [
    { label: 'FAQs', path: '/About' },
    { label: 'Custom Solutions', path: '/Contact' },
  ],
};

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <footer className="bg-navy-900 text-white">
      {/* CTA */}
      <div ref={ref} className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-16 border-b border-white/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div>
            <motion.p
              className="text-[10px] font-jost text-white/30 tracking-[0.3em] uppercase mb-4"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.1 }}
            >
              Get in touch
            </motion.p>
            <SplitLines
              lines={["Let's work", 'together.']}
              className="text-3xl md:text-5xl font-display font-medium"
              delay={0.1}
            />
          </div>
          <FadeUp delay={0.4}>
            <Link
              to="/Contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 text-sm font-jost font-semibold tracking-wide rounded-full hover:bg-white/90 transition-colors group"
            >
              Contact Us
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </FadeUp>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 19L19 5M19 5H7M19 5V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
              </svg>
              <span className="text-white text-sm font-jost font-bold tracking-[0.2em] uppercase">YUCCA</span>
            </div>
            <p className="text-white/30 text-xs font-jost leading-relaxed max-w-[220px]">
              Premium packaging solutions for food service, processing, and agriculture.
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
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-[11px] font-jost">© {new Date().getFullYear()} Yucca Packaging. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-white/20 text-[11px] font-jost cursor-pointer hover:text-white/50 transition-colors">Privacy Policy</span>
            <span className="text-white/20 text-[11px] font-jost cursor-pointer hover:text-white/50 transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}