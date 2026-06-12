"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { handleBookingClick } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = ['الرئيسية', 'من نحن', 'خدماتنا', 'معرض الأعمال', 'التحقق من الضمان'];
  const paths = ['/#hero', '/#about', '/#services', '/#portfolio', '/#warranty'];

  if (pathname?.startsWith('/booking') || pathname?.startsWith('/admin') || pathname?.startsWith('/warranty')) return null;

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-xl border-b border-primary/20 py-2 shadow-lg shadow-black/50' 
            : 'bg-gradient-to-b from-black/80 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0 animate-neon-pulse hover:scale-105 transition-transform duration-300">
              <Link href="/">
                <Image src="/logo.png" alt="GTA Car Care" width={140} height={80} className="object-contain drop-shadow-xl" priority />
              </Link>
            </div>
            
            {/* Desktop Links */}
            <ul className="hidden md:flex gap-8 items-center justify-center flex-1">
              {navItems.map((item, idx) => {
                const isActive = pathname === paths[idx];
                return (
                  <li key={idx}>
                    <Link href={paths[idx]} className={`relative text-base tracking-wide transition-colors font-bold group px-2 py-1 ${isActive ? 'text-primary' : 'text-white/90 hover:text-primary'}`}>
                      {item}
                      <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <button onClick={handleBookingClick} className="btn-3d px-6 py-2.5 text-sm interactive">
                <span className="btn-icon"><Star size={16} /></span>
                احجز موعدك
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-24 px-4 md:hidden flex flex-col items-center gap-8"
          >
            {navItems.map((item, idx) => {
                const isActive = pathname === paths[idx];
                return (
                  <Link key={idx} href={paths[idx]} className={`text-2xl font-bold transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-primary'}`}>
                    {item}
                  </Link>
                );
            })}
            <button onClick={() => { setMobileMenuOpen(false); handleBookingClick(); }} className="btn-3d mt-8 w-full py-4 text-xl">احجز موعدك الآن</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
