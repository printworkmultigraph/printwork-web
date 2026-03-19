import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

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
  return (
    <footer className="bg-navy-900 text-white">
      {/* CTA Section */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-16 border-b border-white/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div>
            <p className="text-white/40 text-sm tracking-widest uppercase mb-3">Get in touch</p>
            <h2 className="text-3xl md:text-5xl font-display font-medium leading-tight">
              Let's work<br />together.
            </h2>
          </div>
          <Link
            to="/Contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 text-sm font-semibold tracking-wide rounded-full hover:bg-white/90 transition-colors group"
          >
            Contact Us
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 border-2 border-white/60 rounded-md flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white/60 rounded-sm" />
              </div>
              <span className="text-white font-bold tracking-tight">YUCCA</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-[240px]">
              Premium packaging solutions for food service, processing, and agriculture.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white/50 text-xs uppercase tracking-[0.2em] mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/70 hover:text-white transition-colors"
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
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">© {new Date().getFullYear()} Yucca Packaging. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-white/30 text-xs">Privacy Policy</span>
            <span className="text-white/30 text-xs">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}