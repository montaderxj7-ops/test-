"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, CarFront, Calendar, Award, AlertCircle, ShieldAlert } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

import { supabase } from '@/lib/supabase';

// Simple pseudo-random barcode generator based on serial string length and chars
const generateBarcode = (serial) => {
  let bars = [];
  let seed = serial.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  for (let i = 0; i < 40; i++) {
    let width = (Math.sin(seed + i) * 100) % 4 > 2 ? 4 : 2;
    if (i % 7 === 0) width = 1; // some thin lines
    bars.push(<div key={i} className="bg-white" style={{ width: `${width}px`, height: '100%', margin: '0 1px' }}></div>);
  }
  return bars;
};

export default function WarrantySection() {
  const [plateNumber, setPlateNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!plateNumber.trim()) return;

    setIsLoading(true);
    setHasSearched(false);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('warranty_code', plateNumber.trim().toUpperCase())
        .single();

      if (error || !data) {
        setResult(null);
      } else {
        const today = new Date();
        const expiryDate = new Date(data.expiry_date);
        const isExpired = !data.is_active || expiryDate < today;

        setResult({
          plate: data.car_plate,
          car: data.car_type,
          service: data.service_requested,
          date: data.start_date,
          expiry: data.expiry_date,
          status: isExpired ? "منتهي" : "فعال",
          serial: data.warranty_code
        });
      }
    } catch (err) {
      console.error(err);
      setResult(null);
    } finally {
      setHasSearched(true);
      setIsLoading(false);
    }
  };

  return (
    <section id="warranty" className="py-32 bg-[#020202] relative overflow-hidden border-t border-white/5 min-h-screen flex items-center">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#00f2fe]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full border border-primary/30 bg-black/40 backdrop-blur-md">
              <ShieldCheck size={16} className="text-primary" />
              <span className="text-sm font-medium tracking-wider text-white/90">بوابة الحماية</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">التحقق من <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#dfc07b]">الضمان</span></h2>
            <p className="text-white/60 text-lg font-light">
              أدخل كود الضمان الخاص بك (أسفل الباركود) للتحقق من حالة الضمان واستعراض تفاصيل العناية الخاصة بالسيارة.
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSearch}
            className="relative mb-16"
          >
            <div className="relative p-[2px] rounded-full bg-gradient-to-r from-primary/50 via-white/10 to-primary/50 shadow-[0_0_30px_rgba(197,160,89,0.15)]">
              <div className="relative flex items-center bg-[#0a0a0a] rounded-full overflow-hidden">
                <input 
                  type="text" 
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="مثال: GTA-XXXXX-XXXX"
                  className="w-full bg-transparent text-white text-xl md:text-2xl px-8 py-6 focus:outline-none placeholder:text-white/20 uppercase"
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-primary text-black px-8 py-6 font-bold text-lg flex items-center gap-3 hover:bg-[#dfc07b] transition-colors disabled:opacity-50 h-full"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>
                      تحقق <Search size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {hasSearched && (
              <motion.div
                key={result ? 'found' : 'not-found'}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                {result ? (
                  <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="w-full">
                    {/* Digital Warranty Card */}
                    <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-primary via-white/10 to-primary/30 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                      {/* Card Background & Reflection */}
                      <div className="absolute inset-0 bg-[#050505] rounded-3xl"></div>
                      <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-3xl"></div>
                      
                      <div className="relative p-8 md:p-12">
                        {/* Card Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-white/10 pb-8">
                          <div>
                            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-white mb-2">GTA CAR CARE</h3>
                            <p className="text-white/50 tracking-[0.2em] text-sm uppercase">Official Warranty Certificate</p>
                          </div>
                          
                          <div className={`mt-6 md:mt-0 px-6 py-2 rounded-full border flex items-center gap-2 ${result.status === 'فعال' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                            {result.status === 'فعال' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                            <span className="font-bold tracking-wider">ضمان {result.status}</span>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                          <div className="space-y-6">
                            <div>
                              <p className="text-white/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-2"><CarFront size={14} /> نوع السيارة</p>
                              <p className="text-white text-xl font-bold">{result.car}</p>
                            </div>
                            <div>
                              <p className="text-white/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-2"><Award size={14} /> الخدمة المنجزة</p>
                              <p className="text-primary text-xl font-bold">{result.service}</p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <p className="text-white/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-2"><AlertCircle size={14} /> رقم اللوحة</p>
                              <p className="text-white text-xl font-bold tracking-widest">{result.plate}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-white/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-2"><Calendar size={14} /> تاريخ العمل</p>
                                <p className="text-white text-lg font-medium">{result.date}</p>
                              </div>
                              <div>
                                <p className="text-white/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-2"><Calendar size={14} /> انتهاء الضمان</p>
                                <p className="text-white text-lg font-medium">{result.expiry}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer / Barcode */}
                        <div className="bg-black/50 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="text-center md:text-right">
                            <p className="text-white/30 text-xs uppercase tracking-[0.3em] mb-2">رقم الشهادة التسلسلي</p>
                            <p className="text-white/80 font-mono tracking-[0.2em] text-sm">{result.serial}</p>
                          </div>
                          <div className="h-12 flex justify-center opacity-80">
                            {generateBarcode(result.serial)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tilt>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-4">
                      <AlertCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">لم يتم العثور على سجل!</h3>
                    <p className="text-white/60">عذراً، لم نتمكن من العثور على بيانات ضمان مطابقة للكود المُدخل. يرجى التأكد من الرمز المكتوب أسفل الباركود وإعادة المحاولة، أو التواصل مع الإدارة.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
