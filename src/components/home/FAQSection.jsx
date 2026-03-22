import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LineReveal, FadeUp } from '../SplitText';

const faqs = [
  { q: 'Jenis kemasan apa saja yang tersedia?', a: 'Kami menyediakan beragam kemasan makanan custom: lunch box, food pail, dus fried chicken, dus nasi, dus martabak, kantong kertas, food wrapping paper, standing pouch, sachet, gusset, dan gift wrap.' },
  { q: 'Berapa minimum order?', a: 'Minimum order mulai dari 500 pcs untuk sebagian besar produk. Untuk kertas nasi, food wrapping, dan kantong ayam, minimum order 1.000 pcs. Standing pouch dan gusset bisa mulai dari 100 pcs.' },
  { q: 'Apakah bisa custom branding?', a: 'Tentu! Kami menerima cetak custom 1 warna, 2 warna, hingga full color. Termasuk opsi laminasi dalam untuk ketahanan terhadap minyak dan air.' },
  { q: 'Material apa yang digunakan?', a: 'Kami menggunakan material Eco-Kraft, Food Grade (Foopak), Duplex, Ivory, Paper Metalized, Art Paper, dan Grease Paper. Semua material aman untuk makanan dan bersertifikat.' },
  { q: 'Bagaimana proses pemesanan?', a: 'Pilih produk, tentukan ukuran, material, jenis cetak, dan laminasi. Hubungi kami via WhatsApp untuk konsultasi desain gratis. Proses produksi 7-14 hari kerja setelah desain disetujui.' },
  { q: 'Apakah melayani pengiriman ke seluruh Indonesia?', a: 'Ya, kami melayani pengiriman ke seluruh Indonesia. Jabodetabek 1-3 hari kerja, luar Jawa 3-7 hari kerja.' },
];

export default function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-secondary">
      <div className="max-w-[1100px] mx-auto px-10 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <LineReveal>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900">
                Pertanyaan <em className="font-light text-navy-400 not-italic">Umum</em>
              </h2>
            </LineReveal>
          </div>

          <FadeUp delay={0.2}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white rounded-2xl px-6 border-none shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="text-left text-sm font-jost font-semibold text-navy-900 py-5 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm font-jost text-navy-400 leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
