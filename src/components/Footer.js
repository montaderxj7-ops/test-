"use client";

import Link from 'next/link';
import { MapPin, Phone, Sparkles, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

export default function Footer() {
  const { handleBookingClick } = useAuth();
  const mapLink = "https://maps.app.goo.gl/KfGqYfQ4oZSbPhZx6";
  const facebookLink = "https://www.facebook.com/people/gtabasra/61554675607343/?ref=xav_pl_fb_external_link_android";
  const instagramLink = "https://www.instagram.com/gtabasra?igsh=czZ5bjNpenQxYW9z";
  const pathname = usePathname();

  if (pathname?.startsWith('/booking') || pathname?.startsWith('/admin') || pathname?.startsWith('/warranty')) return null;

  return (
    <footer id="contact" className="bg-[#050505] pt-24 pb-12 relative z-10 overflow-hidden border-t border-white/5">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/3 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#00f2fe]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top CTA */}
        <div className="mb-20 pb-12 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">هل سيارتك جاهزة <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#dfc07b]">للتألق؟</span></h2>
            <p className="text-white/50 text-lg font-light">دعنا نمنحها العناية الملكية التي تستحقها على أيدي خبرائنا.</p>
          </div>
          <button onClick={handleBookingClick} className="btn-3d text-lg px-8 py-4 flex items-center gap-3 interactive shrink-0">
            احجز موعدك الآن <ArrowUpRight size={20} />
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <h3 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#f5d792] to-[#8c6d32]">GTA</h3>
            </Link>
            <p className="text-white/60 leading-relaxed font-light mb-8 pr-4 border-r-2 border-primary/30 text-sm">
              الوجهة الأولى للعناية الفائقة بالسيارات في البصرة. نقدم خدمات النانو سيراميك وحماية PPF بأعلى المعايير العالمية.
            </p>
            <div className="flex items-center gap-4">
              <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:-translate-y-1 transition-all duration-300 shadow-lg group">
                <FacebookIcon size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:text-white hover:border-transparent hover:-translate-y-1 transition-all duration-300 shadow-lg group">
                <InstagramIcon size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-xl mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(197,160,89,0.8)]"></span> خدماتنا
            </h4>
            <ul className="space-y-4">
              {['حماية PPF', 'نانو سيراميك', 'تلميع ساطع', 'غسيل VIP', 'عازل حراري'].map((item, i) => (
                <li key={i}>
                  <Link href="/#services" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-primary opacity-0 group-hover:opacity-100">←</span> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xl mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(197,160,89,0.8)]"></span> روابط سريعة
            </h4>
            <ul className="space-y-4">
              <li><Link href="/#hero" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-primary opacity-0 group-hover:opacity-100">←</span> الرئيسية</Link></li>
              <li><Link href="/#about" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-primary opacity-0 group-hover:opacity-100">←</span> من نحن</Link></li>
              <li><Link href="/#portfolio" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-primary opacity-0 group-hover:opacity-100">←</span> معرض الأعمال</Link></li>
              <li><Link href="/#warranty" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-primary opacity-0 group-hover:opacity-100">←</span> التحقق من الضمان</Link></li>
              <li><Link href="/#contact" className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-primary opacity-0 group-hover:opacity-100">←</span> تواصل معنا</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-xl mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(197,160,89,0.8)]"></span> تواصل معنا
            </h4>
            <ul className="space-y-6">
              <li>
                <a href={mapLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 text-white/60 hover:text-primary transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors border border-white/5 group-hover:border-primary/30">
                    <MapPin size={20} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="pt-1">
                    <span className="block text-white font-bold mb-1">البصرة - العراق</span>
                    <span className="text-sm opacity-70 font-light">احصل على الاتجاهات من الخرائط</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+9647716771113" className="flex items-center gap-4 text-white/60 hover:text-primary transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors border border-white/5 group-hover:border-primary/30">
                    <Phone size={20} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <span dir="ltr" className="font-bold tracking-wider text-lg">+964 771 677 1113</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm font-light">© {new Date().getFullYear()} GTA Car Care. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-2 text-white/40 text-sm font-light">
            <span>صمم بشغف للفخامة</span>
            <Sparkles size={14} className="text-primary animate-pulse" />
          </div>
        </div>

      </div>
    </footer>
  );
}
