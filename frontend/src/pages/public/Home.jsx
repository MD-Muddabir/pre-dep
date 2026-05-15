import { useState, useEffect } from 'react';
import Navbar from '../../components/landing/Navbar';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import Pricing from '../../components/landing/Pricing';
import Testimonials from '../../components/landing/Testimonials';
import FAQ from '../../components/landing/FAQ';
import Contact from '../../components/landing/Contact';
import Footer from '../../components/landing/Footer';
import { useCursor } from '../../hooks/useCursor';
import '../../styles/landing.css';

export default function Home() {
  useCursor(); // Custom lag cursor effect

  // Scroll progress bar
  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = (scrolled / total) * 100;
      const bar = document.getElementById('progress-bar');
      if (bar) bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // Scroll to the right section based on the URL path or hash
  useEffect(() => {
    const p = window.location.pathname;
    const hash = window.location.hash.replace('#', '');
    const sectionMap = {
      '/pricing': 'pricing',
      '/renew-plan': 'pricing',
      '/features': 'features',
      '/terms': 'terms',
      '/privacy': 'privacy',
    };

    const sectionId = hash || sectionMap[p];
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
      }, 400);
    }
  }, []);

  return (
    <div className='landing-root'>
      <div id='progress-bar' />
      <div id='cursor' />
      <div id='cursor-ring' />
      <div id='mobile-drawer-root' />

      <Navbar />

      <main>
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />

      </main>

      <Footer />
    </div>
  );
}
