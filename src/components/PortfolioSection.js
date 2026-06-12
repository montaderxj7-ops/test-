"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Maximize2, Sparkles } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { supabase } from '@/lib/supabase';


export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [selectedItem, setSelectedItem] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [categories, setCategories] = useState(['الكل']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) { setLoading(false); return; }
      try {
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("name")
          .eq("is_active", true)
          .order("created_at", { ascending: true });
        
        if (servicesError) throw servicesError;

        if (servicesData) {
          setCategories(['الكل', ...servicesData.map(s => s.name)]);
        }

        const { data: portfolioData, error: portfolioError } = await supabase
          .from('portfolio_items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (portfolioError) throw portfolioError;
        setPortfolioItems(portfolioData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredItems = portfolioItems.filter(item => 
    activeCategory === 'الكل' ? true : item.category === activeCategory
  );

  return (
    <section id="portfolio" className="py-32 bg-black relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(197,160,89,0.1)_0%,_transparent_50%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full border border-primary/30 bg-black/40 backdrop-blur-md">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium tracking-wider text-white/90">معرضنا المرئي</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">معرض <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#dfc07b]">الأعمال</span></h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            استعرض جودة العمل والتفاصيل الدقيقة التي نقدمها في كل سيارة تدخل مركزنا.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat 
                  ? 'text-black bg-gradient-to-r from-[#dfc07b] to-primary shadow-[0_0_20px_rgba(197,160,89,0.4)]' 
                  : 'text-white/70 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {loading ? (
              <div className="col-span-full py-20 text-center text-white/50 w-full">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>جاري تحميل الأعمال...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full py-20 text-center w-full">
                <p className="text-white/50 text-lg">لا توجد أعمال في هذا القسم حالياً.</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-[#050505] shadow-lg"
                  onClick={() => setSelectedItem(item)}
                >
                  <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="w-full h-full">
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: item.type === 'video' ? '9/16' : '4/3' }}>
                      {item.type === 'image' ? (
                        <Image 
                          src={item.src} 
                          alt={item.title} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <>
                          <video 
                            src={item.src} 
                            muted 
                            loop 
                            playsInline
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onMouseOver={e => e.target.play()}
                            onMouseOut={e => {e.target.pause(); e.target.currentTime = 0;}}
                          />
                          <div className="absolute top-4 right-4 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 z-10">
                            <Play size={14} className="ml-0.5" />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-primary text-xs font-bold tracking-wider uppercase mb-2 block">{item.category}</span>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-4 border border-primary/30">
                          <Maximize2 size={14} />
                        </div>
                      </div>
                    </div>
                  </Tilt>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Empty State handled inside the motion div above */}

      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedItem(null)}
          >
            <button 
              className="absolute top-6 left-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors z-50"
              onClick={() => setSelectedItem(null)}
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} 
            >
              {selectedItem.type === 'image' ? (
                <div className="relative w-full h-[85vh]">
                  <Image 
                    src={selectedItem.src} 
                    alt={selectedItem.title} 
                    fill 
                    className="object-contain" 
                  />
                </div>
              ) : (
                <video 
                  src={selectedItem.src} 
                  autoPlay 
                  controls 
                  playsInline
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
              )}

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-8 text-right pointer-events-none">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold mb-3">{selectedItem.category}</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedItem.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
