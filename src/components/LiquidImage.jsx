import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const EASE = [0.76, 0, 0.24, 1];

export default function LiquidImage({ src, alt, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* SVG Filter for Liquid Effect */}
      <svg className="absolute invisible">
        <defs>
          <filter id="liquid-filter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.01 0.05" 
              numOctaves="2" 
              result="noise"
              seed="1"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G"
            >
              <animate 
                attributeName="scale" 
                values="0; 60; 0" 
                dur="1.5s" 
                begin={inView ? `${delay}s` : "indefinite"}
                fill="freeze"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>

      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ filter: 'url(#liquid-filter)' }}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: EASE, delay }}
        whileHover={{ scale: 1.05 }}
      />
    </div>
  );
}
