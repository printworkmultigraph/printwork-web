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
  { q: 'What types of packaging do you offer?', a: 'We supply a wide range of food, produce, and custom packaging — from ready-to-order items to fully bespoke branded solutions and custom moulds.' },
  { q: 'Do you deliver nationwide?', a: 'Yes. We offer reliable nationwide delivery. Free delivery applies for orders over R2000 incl. vat.' },
  { q: 'Can I order custom-branded packaging?', a: 'Absolutely. We can customise your packaging to fit your needs — from printed logos to completely bespoke designs.' },
  { q: 'What materials do you use?', a: 'We offer PET, kraft paper, bagasse (sugarcane fibre), bamboo, paper pulp, and more. Many products are recyclable or compostable.' },
  { q: 'Is there a minimum order quantity?', a: 'Standard products are available in standard pack sizes. For custom solutions, minimums may apply depending on product type and customisation.' },
];

export default function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-secondary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <LineReveal>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900">
                Frequently asked <em className="font-light text-navy-400 not-italic">questions</em>
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