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

const marqueeItems = ['Yucca Rewards', 'Direct (B2B)', 'Quality', 'Branding', 'Custom Packaging', 'Sustainable', 'Innovation', 'Partnerships'];

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
          <CategorySlider />
          <NewProducts />
          <MissionSection />
          <MarqueeStrip items={marqueeItems} dark />
          <CustomSolutionsBanner />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </>
  );
}