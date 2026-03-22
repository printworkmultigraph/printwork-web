import { useState, useCallback } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MarqueeStrip from '../components/MarqueeStrip';
import HeroSection from '../components/home/HeroSection';
import CategorySlider from '../components/home/CategorySlider';
import NewProducts from '../components/home/NewProducts';
import MissionSection from '../components/home/MissionSection';
import CustomSolutionsBanner from '../components/home/CustomSolutionsBanner';
import FAQSection from '../components/home/FAQSection';
import InfiniteTextMarquee from '../components/InfiniteTextMarquee';
import LogoMarquee from '../components/home/LogoMarquee';

const marqueeItems = ['Printwork Indonesia', 'Custom Packaging', 'Food Grade', 'Eco-Kraft', 'ISO 9001:2015', 'FSSC 22000', 'Min. 500 Pcs', 'Cetak Premium'];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const onComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={onComplete} />}
      <div className={loaded ? 'opacity-100' : 'opacity-0'}>
        <Navbar />
        <main>
          <HeroSection />
          <MarqueeStrip items={marqueeItems} />
          <NewProducts />
          <MissionSection />
          <MarqueeStrip items={marqueeItems} dark />
          <CustomSolutionsBanner />
          <FAQSection />
          <LogoMarquee speed={40} />
        </main>
        <Footer />
      </div>
    </>
  );
}
