import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CURTAIN_COLOR = '#152b1e';

/**
 * Barba.js-style page transition:
 * On route change → green curtain slides UP from bottom covering screen,
 * then slides UP off the top revealing new page.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const curtainRef = useRef(null);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    const curtain = curtainRef.current;
    if (!curtain) return;

    // Phase 1: slide curtain UP from bottom (cover screen)
    curtain.style.transition = 'none';
    curtain.style.transform = 'translateY(100%)';
    curtain.style.display = 'block';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        curtain.style.transition = 'transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)';
        curtain.style.transform = 'translateY(0%)';

        setTimeout(() => {
          // Scroll to top
          window.scrollTo(0, 0);

          // Phase 2: slide curtain UP off screen (reveal new page)
          curtain.style.transition = 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)';
          curtain.style.transform = 'translateY(-100%)';

          setTimeout(() => {
            curtain.style.display = 'none';
            curtain.style.transform = 'translateY(100%)';
          }, 700);
        }, 600);
      });
    });
  }, [location.pathname]);

  return (
    <>
      {children}
      {/* Curtain overlay */}
      <div
        ref={curtainRef}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: CURTAIN_COLOR,
          zIndex: 8000,
          transform: 'translateY(100%)',
          display: 'none',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}