"use client";

import { motion } from 'framer-motion';
import { MapPin, Phone, Sparkles, Navigation } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import Link from 'next/link';

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

export default function ContactSection() {
  const mapLink = "https://maps.app.goo.gl/KfGqYfQ4oZSbPhZx6";
  const facebookLink = "https://www.facebook.com/people/gtabasra/61554675607343/?ref=xav_pl_fb_external_link_android";
  const instagramLink = "https://www.instagram.com/gtabasra?igsh=czZ5bjNpenQxYW9z";

  return (
    <section id="contact" className="py-32 bg-[#020202] relative overflow-hidden border-t border-white/5">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full border border-primary/30 bg-black/40 backdrop-blur-md">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium tracking-wider text-white/90">نحن في خدمتك</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">تواصل <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#dfc07b]">معنا</span></h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            احجز موعدك الآن أو تفضل بزيارة مركزنا للحصول على استشارة مجانية لسيارتك.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} className="relative p-[1px] rounded-2xl bg-gradient-to-r from-white/10 to-primary/20 h-full">
                <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl h-full">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(197,160,89,0.2)] mb-2">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="text-white/50 text-sm mb-2 font-bold">موقع المركز</h4>
                    <p className="text-white text-xl font-medium mb-6">البصرة - العراق</p>
                  </div>
                  <Link href={mapLink} target="_blank" rel="noopener noreferrer" className="btn-3d-glass px-6 py-3 mt-auto text-sm flex items-center gap-2">
                    <Navigation size={16} /> الاتجاهات
                  </Link>
                </div>
              </Tilt>

              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} className="relative p-[1px] rounded-2xl bg-gradient-to-r from-white/10 to-primary/20 h-full">
                <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl h-full">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(197,160,89,0.2)] mb-2">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="text-white/50 text-sm mb-2 font-bold">اتصل بنا للحجز</h4>
                    <p className="text-white text-2xl font-medium tracking-wider" dir="ltr">+964 771 677 1113</p>
                  </div>
                  <a href="tel:+9647716771113" className="btn-3d px-6 py-3 mt-auto text-sm flex items-center gap-2 interactive">
                    <Phone size={16} /> اتصل الآن
                  </a>
                </div>
              </Tilt>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-col items-center text-center">
              <h4 className="text-white font-bold text-xl mb-8 flex items-center gap-4">
                <div className="w-12 h-[2px] bg-gradient-to-l from-primary to-transparent"></div>
                تابعنا على منصات التواصل
                <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-transparent"></div>
              </h4>
              <div className="flex gap-6">
                <motion.a 
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  href={facebookLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/30 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(24,119,242,0.2)]"
                >
                  <FacebookIcon size={28} />
                </motion.a>
                
                <motion.a 
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  href={instagramLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-[#E4405F]/10 border border-[#E4405F]/30 flex items-center justify-center text-[#E4405F] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:text-white hover:border-transparent transition-all duration-300 shadow-[0_0_20px_rgba(228,64,95,0.2)]"
                >
                  <InstagramIcon size={28} />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
