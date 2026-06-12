"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, CarFront, ShieldCheck, Sparkles, Star, Award, CheckCircle2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import Tilt from 'react-parallax-tilt';
import { useRef, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PortfolioSection from '@/components/PortfolioSection';
import WarrantySection from '@/components/WarrantySection';
import ContactSection from '@/components/ContactSection';
import { useAuth } from '@/context/AuthContext';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

// Advanced Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export default function HomePage() {
  const { handleBookingClick } = useAuth();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax values
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [dbServices, setDbServices] = useState([]);

  useEffect(() => {
    async function fetchServices() {
      if (!supabase) return;
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });
      if (data) setDbServices(data);
    }
    fetchServices();
  }, []);

  // Predefined styles and fallback values for dynamically loaded services
  const serviceStyles = [
    { match: 'ppf', icon: <ShieldCheck size={36} />, desc: 'حماية متكاملة لطلاء السيارة من الخدوش والعوامل الجوية.', bgClass: 'from-[#ff0055]/20 to-black', borderClass: 'border-[#ff0055]' },
    { match: 'نانو', icon: <Sparkles size={36} />, desc: 'طبقة زجاجية صلبة تمنح سيارتك لمعاناً دائماً.', bgClass: 'from-[#00f2fe]/20 to-black', borderClass: 'border-[#00f2fe]' },
    { match: 'غسيل', icon: <CarFront size={36} />, desc: 'عناية فائقة بأدق التفاصيل لتعود سيارتك وكأنها جديدة.', bgClass: 'from-[#f5d792]/20 to-black', borderClass: 'border-[#f5d792]' },
    { match: 'تلميع', icon: <Star size={36} />, desc: 'إزالة الخدوش الدقيقة واستعادة لمعان السيارة الأصلي.', bgClass: 'from-[#8e2de2]/20 to-black', borderClass: 'border-[#8e2de2]' },
    { match: 'عازل', icon: <Sparkles size={36} />, desc: 'حماية من أشعة الشمس وتقليل حرارة المقصورة.', bgClass: 'from-[#ff8c00]/20 to-black', borderClass: 'border-[#ff8c00]' }
  ];

  const getStyleForService = (name) => {
    const style = serviceStyles.find(s => name.toLowerCase().includes(s.match.toLowerCase()));
    if (style) return style;
    // Fallback for new unknown services
    return { 
      icon: <Award size={36} />, 
      desc: 'خدمة احترافية للعناية بسيارتك مقدمة من خبراء مركزنا.', 
      bgClass: 'from-[#c5a059]/20 to-black', 
      borderClass: 'border-[#c5a059]' 
    };
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
      
      {/* 1. Hero Section with Parallax */}
      <section id="hero" className="relative h-screen flex items-center justify-center bg-black">
        <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-full flex items-center justify-center z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50 scale-105">
            <source src="/اريدك_ان_تقوم_بتعديل_فيديو_الس.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Cinematic Lighting Overlays */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.15)_0%,_transparent_70%)] mix-blend-screen pointer-events-none"></div>
        
        {/* Animated Glow Orbs */}
        <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-[120px] mix-blend-color-dodge animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[25rem] h-[25rem] bg-[#f5d792]/10 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none" style={{animationDelay: '2s'}}></div>

        <motion.div 
          style={{ y: yText, opacity: opacityHero }}
          variants={staggerContainer} 
          initial="hidden" 
          animate="show" 
          className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full max-w-5xl mt-24"
        >
          <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-black/40 backdrop-blur-md">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium tracking-wider text-white/90">الوجهة الأولى للعناية الفائقة</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight leading-tight text-white drop-shadow-2xl">
            عناية <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d792] via-primary to-[#8c6d32] animate-gradient-x">ملكية</span> لسيارتك
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-white/80 font-light mb-12 max-w-3xl drop-shadow-md leading-relaxed px-2">
            ارتقِ بسيارتك إلى مستوى جديد من الفخامة مع أفضل خدمات الحماية وتقنية النانو سيراميك بأيدي خبراء معتمدين.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            {/* Magnetic effect simulated via Framer Motion whileHover */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#services" className="btn-3d text-lg px-10 py-4 w-full sm:w-auto text-center flex items-center justify-center gap-3 interactive shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:shadow-[0_0_50px_rgba(197,160,89,0.5)] transition-shadow">
                <span className="btn-icon"><Sparkles size={20} /></span>
                اكتشف خدماتنا
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#portfolio" className="btn-3d-glass text-lg px-10 py-4 w-full sm:w-auto text-center flex items-center justify-center gap-3 interactive">
                معرض الأعمال <ArrowLeft size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Advanced About Section (Asymmetric Grid) */}
      <section id="about" className="py-32 bg-[#050505] relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-transparent via-primary/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Image Side (Interactive Tilt) */}
            <motion.div 
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={scaleUp}
              className="lg:col-span-5 relative"
            >
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} transitionSpeed={2000} className="relative z-10 rounded-[2rem] overflow-hidden aspect-[4/5] border border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                <Image src="/1p.jpg" alt="GTA Car Care Facility" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Floating Badge inside image */}
                <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-md border border-primary/30 rounded-2xl p-4 flex items-center gap-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Award size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">خبرة تفوق التوقعات</p>
                    <p className="text-primary text-sm">معدات وتقنيات عالمية</p>
                  </div>
                </div>
              </Tilt>
              
              {/* Background decorative blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-[80px] -z-10"></div>
            </motion.div>

            {/* Right Text Side */}
            <motion.div 
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className="lg:col-span-7 lg:pr-12"
            >
              <motion.div variants={slideInRight} className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] bg-primary"></div>
                <span className="text-primary font-bold tracking-wider text-sm">عن المركز</span>
              </motion.div>
              
              <motion.h2 variants={slideInRight} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                لماذا تختار <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#dfc07b]">GTA</span>؟
              </motion.h2>
              
              <motion.p variants={slideInRight} className="text-white/70 text-lg md:text-xl mb-10 leading-relaxed font-light">
                في مركز GTA، نحن لا نغسل السيارات فحسب، بل نعيد لها الروح. فريقنا يتكون من خبراء معتمدين في العناية الفائقة، نستخدم أحدث التقنيات وأفضل المواد العالمية لضمان نتيجة تخطف الأنظار.
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {[
                  { title: 'مواد أصلية 100%', desc: 'نستخدم فقط العلامات التجارية المعتمدة عالمياً' },
                  { title: 'طاقم محترف', desc: 'خبراء مدربون على أعلى معايير الجودة' },
                  { title: 'ضمان حقيقي', desc: 'كفالة معتمدة على خدمات النانو والحماية' },
                  { title: 'عناية بالتفاصيل', desc: 'نصل إلى أصغر الزوايا التي لا ترى بالعين' }
                ].map((item, i) => (
                  <motion.div key={i} variants={slideInRight} className="flex items-start gap-4 group">
                    <div className="mt-1 min-w-[32px] h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-white/50 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div variants={slideInRight}>
                <button onClick={handleBookingClick} className="btn-3d text-lg px-8 py-3 interactive inline-flex">
                  <span className="btn-icon"><Star size={18} /></span>
                  احجز موعدك الآن
                </button>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Services Preview Section (3D Interactive Cards) */}
      <section id="services" className="py-32 bg-[#020202] relative z-10 border-t border-white/5 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-[#00f2fe]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, type: "spring" }} 
            className="text-center mb-20"
          >
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Sparkles size={20} className="text-primary" />
              <span className="text-primary font-bold tracking-wider text-sm">عناية فائقة</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">خدماتنا <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">المميزة</span></h2>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-light">
              نقدم مجموعة متكاملة من خدمات العناية بالسيارات. اسحب الكروت يميناً ويساراً لاستكشافها.
            </p>
          </motion.div>

          <div className="w-full flex justify-center perspective-[2000px]">
            <Swiper 
              effect={'coverflow'} 
              grabCursor={true} 
              centeredSlides={true} 
              slidesPerView={'auto'} 
              loop={true}
              coverflowEffect={{ 
                rotate: 0, 
                stretch: -50, 
                depth: 300, 
                modifier: 1, 
                slideShadows: false 
              }} 
              modules={[EffectCoverflow]} 
              className="w-full max-w-6xl py-10"
              style={{ overflow: 'visible' }}
            >
              {dbServices.length > 0 ? dbServices.map((srv, idx) => {
                const style = getStyleForService(srv.name);
                return (
                  <SwiperSlide key={srv.id || idx} className="swiper-slide-custom interactive" style={{ width: '350px' }}>
                    <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000} transitionSpeed={1000} scale={1.05} className="h-full">
                      <div className="h-[450px] rounded-3xl p-8 border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500 group shadow-2xl">
                        {/* Inner Glow */}
                        <div className={`absolute top-0 w-full h-1 bg-gradient-to-r ${style.bgClass} group-hover:h-full group-hover:opacity-10 transition-all duration-700`}></div>
                        
                        {/* Icon */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1a1a1a] to-black border border-white/5 flex items-center justify-center text-primary mb-6 shadow-[0_0_30px_rgba(197,160,89,0.15)] group-hover:shadow-[0_0_50px_rgba(197,160,89,0.4)] group-hover:scale-110 transition-all duration-500 z-10">
                          {style.icon}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-3 z-10 group-hover:text-primary transition-colors">{srv.name}</h3>
                        <div className="text-[#c5a059] font-bold text-xl mb-4 z-10 flex items-center gap-1">
                          {srv.price.toLocaleString()} <span className="text-xs text-white/50">د.ع</span>
                        </div>
                        <p className="text-white/60 leading-relaxed font-light text-sm mb-6 max-w-[250px] z-10">{style.desc}</p>
                        
                        {srv.has_warranty && (
                           <div className="z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5a059]/10 text-[#c5a059] text-xs font-bold border border-[#c5a059]/20">
                             <ShieldCheck size={12} /> مشمول بضمان 10 سنوات
                           </div>
                        )}
                      </div>
                    </Tilt>
                  </SwiperSlide>
                );
              }) : (
                <div className="text-center text-white/50 py-20">جاري تحميل الخدمات...</div>
              )}
            </Swiper>
          </div>
        </div>
      </section>

      {/* 4. Portfolio Section */}
      <PortfolioSection />

      {/* 5. Warranty Check Section */}
      <WarrantySection />

      {/* 6. Contact Section */}
      <ContactSection />
    </main>
  );
}
