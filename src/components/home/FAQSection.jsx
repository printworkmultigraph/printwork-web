import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: 'What types of packaging do you offer?',
    a: 'We supply a wide range of food, produce, and custom packaging — from ready-to-order items to fully bespoke branded solutions and custom moulds.',
  },
  {
    q: 'Do you deliver nationwide?',
    a: 'Yes. We offer reliable nationwide delivery. Free delivery applies for orders over R2000 incl. vat.',
  },
  {
    q: 'Can I order custom-branded packaging?',
    a: 'Absolutely. We can customise your packaging to fit your needs — from printed logos to completely bespoke designs.',
  },
  {
    q: 'What materials do you use?',
    a: 'We offer a variety of materials including PET, kraft paper, bagasse (sugarcane fibre), bamboo, paper pulp, and more. Many of our products are recyclable or compostable.',
  },
  {
    q: 'Is there a minimum order quantity?',
    a: 'Standard products are available in standard pack sizes. For custom solutions, minimum order quantities may apply depending on the product type and customisation required.',
  },
];

export default function FAQSection() {
  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-medium text-navy-900">
              Frequently asked <span className="italic text-navy-500">questions</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white rounded-2xl px-6 border-none shadow-sm"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold text-navy-900 py-5 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-navy-500 leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}