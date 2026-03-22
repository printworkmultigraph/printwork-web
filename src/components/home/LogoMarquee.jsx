import { motion } from 'framer-motion';

const logos = [
  '/images/sponsors/Astra_International-Logo.wine.png',
  '/images/sponsors/Picsart_26-03-03_15-53-02-265.png',
  '/images/sponsors/Picsart_26-03-03_15-53-12-322.png',
  '/images/sponsors/Picsart_26-03-03_15-53-22-748.png',
  '/images/sponsors/Picsart_26-03-03_15-53-35-268.png',
  '/images/sponsors/Picsart_26-03-03_15-53-46-729.png',
  '/images/sponsors/Picsart_26-03-03_15-54-07-771.png',
  '/images/sponsors/jotun-official.png'
];

export default function LogoMarquee({ speed = 30 }) {
  // Triple the logos to ensure coverage and seamless looping
  const combinedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="relative py-16 bg-white overflow-hidden border-y border-navy-50">
      <div className="flex w-max overflow-hidden">
        <motion.div
          className="flex items-center gap-32 pr-32"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {combinedLogos.map((logo, index) => {
            const isAstra = logo.toLowerCase().includes('astra');
            const isMercu = logo.toLowerCase().includes('15-53-12-322') || logo.toLowerCase().includes('mercu');
            
            let customStyle = {};
            let containerClass = "h-8 md:h-10"; // Default height

            if (isAstra) {
              containerClass = "h-32 md:h-40 mx-20";
            } else if (isMercu) {
              containerClass = "h-20 md:h-28 mx-16";
            }

            return (
              <div 
                key={index} 
                className={`w-auto flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 ${containerClass}`}
              >
                <img
                  src={logo}
                  alt="Sponsor Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
