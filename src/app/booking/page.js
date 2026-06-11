"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CarFront, User, Phone, Calendar, Settings, ChevronRight, CheckCircle2, CheckSquare, Square, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function BookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]); // array of service objects
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    carMake: '',
    carModel: '',
    carPlate: '',
    carYear: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        const { supabase } = await import('@/lib/supabase');
        if (!supabase) return;
        
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        setAvailableServices(data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, service) => sum + Number(service.price), 0);
  }, [selectedServices]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      alert("الرجاء اختيار خدمة واحدة على الأقل.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      if (!supabase) {
        throw new Error("Supabase is not configured.");
      }

      const car_type_combined = `${formData.carMake} ${formData.carModel} (${formData.carYear})`;
      const services_string = selectedServices.map(s => s.name).join(' + ');
      
      const { error } = await supabase.from('bookings').insert([{
        customer_name: formData.fullName,
        phone_number: formData.phone,
        car_type: car_type_combined,
        car_plate: formData.carPlate, // hidden from admin UI, but saved
        service_requested: services_string,
        total_price: totalPrice,
        booking_date: formData.date || new Date().toISOString().split('T')[0],
        status: 'قيد الانتظار'
      }]);

      if (error) throw error;
      
      setIsSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert("حدث خطأ أثناء تأكيد الحجز. يرجى المحاولة لاحقاً.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#020202] pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-green-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-lg w-full bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-500 mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">تم تأكيد حجزك بنجاح!</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            شكراً لثقتك بمركز GTA Car Care. سيقوم أحد خبرائنا بالتواصل معك قريباً لتأكيد الموعد وتقديم الاستشارة المجانية لسيارتك.
          </p>
          <Link href="/" className="btn-3d w-full py-4 text-lg interactive inline-block">
            العودة للرئيسية
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020202] pt-32 pb-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#00f2fe]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors mb-6 text-sm">
            <ChevronRight size={16} /> العودة للرئيسية
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">أكمل بيانات <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#dfc07b]">الحجز</span></h1>
          <p className="text-white/50 text-lg">الخطوة الأخيرة للحصول على العناية الملكية لسيارتك.</p>
        </motion.div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Fields Container */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-10 shadow-xl space-y-12"
          >
            
            {/* Section 1: Personal Info */}
            <div>
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">معلومات التواصل</h2>
                  <p className="text-white/40 text-sm">كيف يمكننا الوصول إليك؟</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">الاسم الكامل</label>
                  <div className="relative">
                    <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input 
                      type="text" 
                      required 
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 pr-11 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                      placeholder="أحمد محمد" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">رقم الهاتف</label>
                  <div className="relative">
                    <Phone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input 
                      type="tel" 
                      required 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 pr-11 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left" 
                      dir="ltr" 
                      placeholder="0771 677 1113" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Car Info */}
            <div>
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <CarFront size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">تفاصيل السيارة</h2>
                  <p className="text-white/40 text-sm">دعنا نجهز المعدات المناسبة لسيارتك</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">نوع السيارة (الماركة)</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.carMake}
                    onChange={e => setFormData({...formData, carMake: e.target.value})}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                    placeholder="مثال: Mercedes, BMW, Toyota" 
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">الموديل (الفئة)</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.carModel}
                    onChange={e => setFormData({...formData, carModel: e.target.value})}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                    placeholder="مثال: G-Class, X6, Land Cruiser" 
                  />
                </div>
                
                {/* Hidden from admin display, used only here */}
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm font-medium mb-2">رقم لوحة السيارة</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.carPlate}
                    onChange={e => setFormData({...formData, carPlate: e.target.value})}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left" 
                    dir="auto" 
                    placeholder="مثال: البصرة 12345 أ" 
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">التاريخ المفضل</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input 
                      type="date" 
                      required 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 pr-11 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left" 
                      dir="ltr" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">سنة الصنع</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                    <ChevronDown size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                    <select
                      required
                      value={formData.carYear}
                      onChange={e => setFormData({...formData, carYear: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 pr-11 pl-11 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                      dir="rtl"
                    >
                      <option value="" disabled className="bg-[#111] text-white/50">اختر سنة الصنع</option>
                      {Array.from({ length: new Date().getFullYear() + 2 - 1990 }, (_, i) => new Date().getFullYear() + 1 - i).map(year => (
                        <option key={year} value={year} className="bg-[#111] text-white">{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Services Select */}
            <div>
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Settings size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">الخدمات المتاحة</h2>
                  <p className="text-white/40 text-sm">يمكنك اختيار أكثر من خدمة في نفس الطلب</p>
                </div>
              </div>

              {isLoadingServices ? (
                <div className="flex flex-col items-center justify-center py-10 text-white/30">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  جاري تحميل الخدمات...
                </div>
              ) : availableServices.length === 0 ? (
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center text-white/50">
                  نأسف، لا توجد خدمات متاحة حالياً.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableServices.map((service) => {
                    const isSelected = selectedServices.some(s => s.id === service.id);
                    return (
                      <div 
                        key={service.id}
                        onClick={() => toggleService(service)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4
                          ${isSelected 
                            ? 'bg-primary/10 border-primary shadow-[inset_0_0_15px_rgba(197,160,89,0.1)]' 
                            : 'bg-[#111] border-white/5 hover:border-white/20'}`}
                      >
                        <div className={`shrink-0 ${isSelected ? 'text-primary' : 'text-white/20'}`}>
                          {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold ${isSelected ? 'text-white' : 'text-white/70'}`}>
                            {service.name}
                          </h4>
                        </div>
                        <div className="shrink-0 text-left">
                          <div className="text-primary font-bold">
                            {Number(service.price).toLocaleString('en-US')}
                            <span className="text-sm font-normal text-white/50 ml-1">د.ع</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </motion.div>

          {/* Sticky Summary & Submit Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 lg:sticky lg:top-32"
          >
            <div className="bg-gradient-to-b from-[#111] to-[#050505] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
              {/* Subtle accent line */}
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-primary to-transparent"></div>
              
              <h3 className="text-xl font-bold text-white mb-6">ملخص الطلب</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">تاريخ الحجز:</span>
                  <span className="text-white font-medium">{formData.date || 'سيتم التحديد هاتفياً'}</span>
                </div>
                
                <div className="h-[1px] bg-white/5 my-4"></div>
                
                <h4 className="text-sm text-white/50 mb-2">الخدمات المختارة:</h4>
                <div className="space-y-2 min-h-[60px]">
                  {selectedServices.length === 0 ? (
                    <p className="text-xs text-white/20 italic">لم يتم اختيار أي خدمة</p>
                  ) : (
                    selectedServices.map((service, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-white/90">{service.name}</span>
                        <span className="text-white/60">{Number(service.price).toLocaleString('en-US')} د.ع</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="h-[1px] bg-white/5 my-4"></div>
                
                <div className="flex justify-between items-end">
                  <span className="text-white/70 font-bold">المجموع الإجمالي:</span>
                  <div className="text-left">
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#dfc07b]">
                      {Number(totalPrice).toLocaleString('en-US')}
                    </span>
                    <span className="text-sm text-primary/70 mr-1">د.ع</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || selectedServices.length === 0}
                className="w-full btn-3d py-4 text-lg flex justify-center items-center gap-2 interactive disabled:opacity-50 disabled:grayscale transition-all"
              >
                {isSubmitting ? (
                  <>جاري التأكيد <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span></>
                ) : (
                  'تأكيد الحجز النهائي'
                )}
              </button>
              
              <p className="text-center text-white/30 text-xs mt-6">
                بالضغط على "تأكيد الحجز"، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بمركزنا.
              </p>
            </div>
          </motion.div>

        </form>
      </div>
    </main>
  );
}
