import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MarqueeStrip from '../components/MarqueeStrip';

const ABOUT_IMAGE = '/__generating__/img_3e4e8357bae2.png';

const timeline = [
  { year: '2002', title: 'Entering the packaging world', desc: 'Started with a vision to become a diversified independent packaging supplier, driving quality and sustainability.' },
  { year: '2008', title: 'Expanding global partners', desc: 'Refined processes with technology and automation to accelerate high-volume delivery to meet global standards.' },
  { year: '2015', title: 'Partnership milestones', desc: 'Expanded automation within agriculture and delivered products adhering to the highest global standards.' },
  { year: '2020', title: 'Rapid growth period', desc: 'As demand surged, more businesses turned to us for scalable solutions to preserve and protect products in transit.' },
  { year: '2025', title: 'Trusted packaging supplier', desc: 'Upholding a reputation for quality and reliability, supplying packaging to some of the world\'s biggest brands.' },
];

const values = ['Quality Assurance', 'Efficiency', 'Customer Focus', 'Safety', 'Sustainability', 'Collaboration', 'Integrity', 'Compliance', 'Innovation', 'Reliability'];

const team = [
  { name: 'Dirk Theart', role: 'Managing Director' },
  { name: 'Reynardt Bester', role: 'General Manager' },
  { name: 'Byron Clarke', role: 'Operations Manager' },
  { name: 'Keith Hesketh', role: 'Marketing Manager' },
];

export default function About() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <motion.img
            src={ABOUT_IMAGE}
            alt="About Yucca"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-navy-900/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-white"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Adaptable and<br /><span className="italic">Resilient</span>
            </motion.h1>
          </div>
        </section>

        {/* Intro */}
        <section className="py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="max-w-3xl">
              <motion.p
                className="text-lg md:text-xl text-navy-600 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Packaging is universal, and we use it every day. No matter who or where we are, exceptional food is something we all appreciate. To buy, preserve, and transport product that maintains its quality, appearance and taste, we need high-performance packaging in a range of designs and materials.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-secondary">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              The <span className="italic text-navy-500">Journey</span>
            </motion.h2>

            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-navy-200" />
              <div className="space-y-12">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${
                      i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:text-right' : ''} pl-12 md:pl-0`}>
                      <span className="text-4xl font-display font-bold text-navy-200">{item.year}</span>
                      <h3 className="text-lg font-semibold text-navy-900 mt-2">{item.title}</h3>
                      <p className="text-sm text-navy-500 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="absolute left-4 md:left-1/2 top-2 w-3 h-3 bg-navy-900 rounded-full -translate-x-1/2 ring-4 ring-secondary" />
                    <div className="md:w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission/Vision */}
        <section className="py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900">
                Committed to <span className="italic text-navy-500">Excellence</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                className="p-10 bg-secondary rounded-3xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-navy-400 text-xs tracking-[0.3em] uppercase mb-4">Our Mission</p>
                <p className="text-navy-700 leading-relaxed">
                  We provide world-class, compliant packaging from trusted global partners to food service, food processing, and agricultural businesses across the globe.
                </p>
              </motion.div>
              <motion.div
                className="p-10 bg-navy-900 rounded-3xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-4">Our Vision</p>
                <p className="text-white/80 leading-relaxed">
                  To be the trusted, industry-leading packaging supplier, known for ethical practices, reliable supply and dedication to sustainable innovation.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-secondary">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-navy-900 mb-12 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Meet the <span className="italic text-navy-500">Team</span>
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-navy-200 rounded-full flex items-center justify-center">
                    <span className="text-xl font-display text-navy-600">{member.name[0]}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-navy-900">{member.name}</h3>
                  <p className="text-xs text-navy-500 mt-1">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <MarqueeStrip items={values} />
      </main>
      <Footer />
    </>
  );
}