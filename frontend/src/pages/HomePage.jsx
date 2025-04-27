import React, { useEffect } from 'react';
import Navbar from '../components/HomePage/Navbar';
import Hero from '../components/HomePage/Hero';
import About from '../components/HomePage/About';
import Services from '../components/HomePage/Services';
import '../components/HomePage/CursorMagic.css';

const HomePage = () => {
  useEffect(() => {
    const cursorMagic = document.querySelector('.cursor-magic');
    const pointerWrap = document.querySelector('.pointer-wrap');

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { width, height } = cursorMagic.getBoundingClientRect();

      const x = (clientX / width) * 100;
      const y = (clientY / height) * 100;

      pointerWrap.style.transform = `translate(${x - 50}%, ${y - 50}%)`;
    };

    const handleMouseEnter = () => {
      pointerWrap.style.transition = 'opacity 0.3s';
      pointerWrap.style.opacity = 1;
    };

    const handleMouseLeave = () => {
      pointerWrap.style.transition = 'opacity 0.3s';
      pointerWrap.style.opacity = 0;
    };

    cursorMagic.addEventListener('mousemove', handleMouseMove);
    cursorMagic.addEventListener('mouseenter', handleMouseEnter);
    cursorMagic.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cursorMagic.removeEventListener('mousemove', handleMouseMove);
      cursorMagic.removeEventListener('mouseenter', handleMouseEnter);
      cursorMagic.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="cursor-magic">
      {/* Pointer Layer */}
      <div className="pointer-wrap">
        <div className="pointer-gradient"></div>
      </div>


      {/* Content Layer */}
      <div className="content">
        <Navbar />
        <Hero />
        <About />
        <Services />
      </div>
    </div>
  );
};

export default HomePage;
