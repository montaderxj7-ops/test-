"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Plus, Edit2, Trash2, X, Save, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: 0, has_warranty: true });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    setErrorMsg("");
    if (service) {
      setEditingId(service.id);
      setFormData({ name: service.name, price: service.price, has_warranty: service.has_warranty !== false });
    } else {
      setEditingId(null);
      setFormData({ name: "", price: 0, has_warranty: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData({ name: "", price: 0, has_warranty: true });
    }, 300);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg("الرجاء إدخال اسم الخدمة");
      return;
    }
    
    setIsSaving(true);
    setErrorMsg("");

    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from("services")
          .update({ name: formData.name, price: formData.price, has_warranty: formData.has_warranty })
          .eq("id", editingId);
        
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("services")
          .insert([{ name: formData.name, price: formData.price, has_warranty: formData.has_warranty, is_active: true }]);
          
        if (error) throw error;
      }
      
      await fetchServices();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving service:", error);
      setErrorMsg("حدث خطأ أثناء حفظ الخدمة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟ لن تظهر للعملاء بعد الآن.")) return;
    
    try {
      // Instead of hard delete, we can delete or set is_active = false
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">إدارة الخدمات</h1>
          <p className="text-white/50 text-sm font-medium">التحكم بالخدمات وأسعارها المعروضة للعملاء</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-3d px-6 py-2.5 flex items-center gap-2 interactive text-sm"
        >
          <Plus size={18} />
          إضافة خدمة جديدة
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-white/30">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          جاري تحميل الخدمات...
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-white/30 bg-[#050505] rounded-[2.5rem] border border-white/5">
          <Wrench size={48} className="mb-4 opacity-20" />
          <p className="text-xl">لا توجد خدمات مضافة حتى الآن</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gradient-to-b from-[#111] to-[#050505] border border-white/10 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-primary/30 transition-colors"
            >
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-[1rem] bg-black border border-white/5 flex items-center justify-center text-primary shadow-inner">
                  <Wrench size={20} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(service)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    title="تعديل"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/5 text-red-500 hover:text-white hover:bg-red-500 transition-colors"
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#dfc07b]">
                    {Number(service.price).toLocaleString('en-US')}
                  </span>
                  <span className="text-white/40 font-medium mb-1">د.ع</span>
                </div>
                {service.has_warranty !== false && (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20 text-xs font-bold">
                    <ShieldCheck size={14} /> مشمول بضمان 10 سنوات
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[2rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="flex items-center justify-between mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm mb-6 flex items-start gap-2 relative z-10">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">اسم الخدمة</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="مثال: حماية نانو سيراميك"
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">سعر الخدمة (د.ع)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0"
                    min="0"
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left"
                    dir="ltr"
                    required
                  />
                </div>

                <div className="pt-2 border-t border-white/5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={formData.has_warranty}
                        onChange={(e) => setFormData({...formData, has_warranty: e.target.checked})}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded border transition-colors flex items-center justify-center ${formData.has_warranty ? 'bg-primary border-primary text-black' : 'border-white/20 bg-black group-hover:border-white/40'}`}>
                        {formData.has_warranty && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                    </div>
                    <div>
                      <span className="block text-white/90 text-sm font-bold">مشمول بضمان 10 سنوات</span>
                      <span className="block text-white/50 text-xs mt-0.5">عند اختيار هذه الخدمة، سيتم إصدار بطاقة ضمان للعميل تلقائياً عند إكمال الحجز.</span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 btn-3d py-3 flex items-center justify-center gap-2 interactive text-sm disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin text-black" /> : <Save size={18} />}
                    {editingId ? "تحديث الخدمة" : "حفظ الخدمة"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
