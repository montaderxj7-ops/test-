"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, Car, Phone, User, CalendarClock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function WarrantyCertificate() {
  const params = useParams();
  const code = params.code;
  const [warranty, setWarranty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarranty = async () => {
      if (!code || !supabase) return;
      try {
        const { data, error } = await supabase
          .from('warranties')
          .select('*')
          .eq('warranty_code', code)
          .single();
        
        if (error) throw error;
        setWarranty(data);
      } catch (err) {
        console.error('Error fetching warranty:', err);
        setWarranty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWarranty();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!warranty) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-4 text-center">
        <ShieldCheck size={64} className="text-white/20 mb-6" />
        <h1 className="text-2xl font-bold mb-2">بطاقة الضمان غير صالحة</h1>
        <p className="text-white/50">تعذر العثور على معلومات الضمان المطابقة لهذا الرمز.</p>
      </div>
    );
  }

  const isExpired = new Date(warranty.expiry_date) < new Date();

  return (
    <div className="min-h-screen bg-[#050505] bg-[url('/bg-texture.png')] bg-cover bg-center py-12 px-4 sm:px-6 relative flex items-center justify-center font-sans" dir="rtl">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#c5a059]/10 to-transparent pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-gradient-to-b from-white/10 to-white/5 p-[1px] rounded-[2.5rem]">
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden relative shadow-[0_0_100px_rgba(197,160,89,0.05)]">
            
            {/* Top Pattern */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-50"></div>
            
            <div className="p-8 sm:p-12 border-b border-white/5 relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck size={120} />
              </div>
              
              <div className="flex flex-col items-center justify-center text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#c5a059] to-[#ebd7a0] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(197,160,89,0.3)]">
                  <ShieldCheck size={40} className="text-black" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ebd7a0] via-[#c5a059] to-[#ebd7a0] mb-2">
                  شهادة ضمان معتمدة
                </h1>
                <p className="text-white/60 font-medium tracking-wider">GTA PASS OFFICIAL WARRANTY</p>
                
                <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border backdrop-blur-md ${isExpired ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                  <div className={`w-2 h-2 rounded-full ${isExpired ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                  {isExpired ? 'منتهي الصلاحية' : 'ساري المفعول'}
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-12 flex flex-col md:flex-row gap-12 items-center">
              
              {/* QR Code Section */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="bg-white p-4 rounded-3xl shadow-xl relative group">
                  <div className="absolute inset-0 border-2 border-[#c5a059] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity scale-105 pointer-events-none"></div>
                  <QRCodeSVG 
                    value={typeof window !== 'undefined' ? window.location.href : ''} 
                    size={160} 
                    level={"H"}
                    includeMargin={false}
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                </div>
                <p className="mt-4 font-mono text-[#c5a059] font-bold tracking-widest text-lg">
                  {warranty.warranty_code}
                </p>
                <p className="text-white/40 text-xs mt-1">رمز التحقق الإلكتروني</p>
              </div>

              {/* Details Section */}
              <div className="flex-1 w-full space-y-6">
                
                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                  <p className="text-white/40 text-xs font-bold mb-1 uppercase tracking-widest">الخدمات المشمولة بالضمان</p>
                  <p className="text-lg font-bold text-white leading-relaxed">{warranty.service_requested}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white/40 mb-1">
                      <User size={14} />
                      <span className="text-xs">اسم العميل</span>
                    </div>
                    <p className="font-bold text-white/90 truncate">{warranty.customer_name}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white/40 mb-1">
                      <Car size={14} />
                      <span className="text-xs">المركبة</span>
                    </div>
                    <p className="font-bold text-white/90 truncate">{warranty.car_type}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white/40 mb-1">
                      <Phone size={14} />
                      <span className="text-xs">رقم الهاتف</span>
                    </div>
                    <p className="font-bold text-white/90 truncate" dir="ltr">{warranty.phone_number}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white/40 mb-1">
                      <Car size={14} />
                      <span className="text-xs">رقم اللوحة</span>
                    </div>
                    <p className="font-bold text-white/90 truncate">{warranty.car_plate}</p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[#c5a059]/70 mb-1">
                      <Calendar size={14} />
                      <span className="text-xs">تاريخ الإصدار</span>
                    </div>
                    <p className="font-bold text-white/90">{warranty.start_date}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[#c5a059] mb-1">
                      <CalendarClock size={14} />
                      <span className="text-xs font-bold">تاريخ الانتهاء</span>
                    </div>
                    <p className="font-black text-[#c5a059]">{warranty.expiry_date}</p>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="bg-black/50 p-6 text-center border-t border-white/5">
              <p className="text-white/30 text-xs leading-relaxed max-w-lg mx-auto">
                هذه الوثيقة تعتبر شهادة ضمان رسمية إلكترونية من GTA PASS. في حال وجود أي استفسار يرجى التواصل مع خدمة العملاء. مدة الضمان تخضع للشروط والأحكام.
              </p>
            </div>
            
          </div>
        </div>
      </motion.div>
    </div>
  );
}
