"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';

export default function FloatingButton() {
  const pathname = usePathname();

  if (pathname?.startsWith('/booking') || pathname?.startsWith('/admin')) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, type: "spring" }}
      className="fixed bottom-8 right-8 z-[90] flex flex-col items-center group"
    >
      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 backdrop-blur-md text-white text-sm py-1 px-3 rounded-full border border-primary/30 whitespace-nowrap">
        تواصل معنا
      </div>
      <button 
        onClick={() => window.open('https://wa.me/1234567890', '_blank')}
        className="w-16 h-16 bg-gradient-to-br from-[#dfc07b] to-primary rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(197,160,89,0.4)] hover:shadow-[0_0_50px_rgba(197,160,89,0.8)] hover:scale-110 transition-all duration-300 relative overflow-hidden"
      >
        {/* Radar Ping Animation */}
        <div className="absolute inset-0 rounded-full animate-ping bg-primary opacity-20"></div>
        <MessageCircle size={28} className="relative z-10" />
      </button>
    </motion.div>
  );
}
