"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Plus, Trash2, X, Upload, Video } from "lucide-react";
import Image from "next/image";

export default function AdminPortfolioPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    type: "image",
    file: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    if (!supabase) return;
    try {
      // Fetch services for categories
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("name")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      
      if (servicesError) throw servicesError;
      
      const fetchedCategories = servicesData ? servicesData.map(s => s.name) : [];
      setCategories(fetchedCategories);
      
      if (fetchedCategories.length > 0) {
        setFormData(prev => ({ ...prev, category: fetchedCategories[0] }));
      }

      // Fetch portfolio items
      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (portfolioError) throw portfolioError;
      setItems(portfolioData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    
    setFormData({
      ...formData,
      file,
      type: isVideo ? "video" : "image"
    });

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.title) return alert("يرجى إكمال جميع الحقول");

    setUploading(true);
    try {
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      // 3. Insert to DB
      const span = formData.type === 'video' ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1';
      
      const { data, error: dbError } = await supabase
        .from('portfolio_items')
        .insert([
          {
            title: formData.title,
            category: formData.category,
            type: formData.type,
            src: publicUrl,
            span: span
          }
        ])
        .select();

      if (dbError) throw dbError;

      // Success
      setItems([data[0], ...items]);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error uploading:", error);
      alert("حدث خطأ أثناء الرفع.");
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (id, src) => {
    if (!confirm("هل أنت متأكد من حذف هذا العمل؟")) return;
    
    try {
      // Extract filename from URL
      const fileName = src.split('/').pop();

      // Delete from storage
      await supabase.storage.from('portfolio').remove([fileName]);

      // Delete from DB
      const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
      if (error) throw error;

      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", category: categories.length > 0 ? categories[0] : "", type: "image", file: null });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-12" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">إدارة معرض الأعمال</h1>
          <p className="text-white/50 text-sm font-medium">إضافة وتعديل وحذف الصور والفيديوهات في قسم أعمالنا</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative flex items-center gap-3 pl-2 pr-6 py-2 rounded-full bg-white text-black font-bold hover:bg-gray-100 transition-all duration-300 active:scale-95"
        >
          <span>إضافة عمل جديد</span>
          <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-[-4px] transition-transform">
            <Plus size={20} strokeWidth={2} />
          </div>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-[4/3] bg-white/5 animate-pulse rounded-[2rem] border border-white/5"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-32 bg-[#050505] rounded-[2.5rem] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <ImageIcon size={48} strokeWidth={1} className="mx-auto text-white/20 mb-6" />
          <p className="text-white/40 text-lg">لا يوجد أعمال حالياً. أضف عملك الأول!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="group relative rounded-[2rem] p-1.5 bg-gradient-to-b from-white/10 to-transparent"
              >
                <div className="relative rounded-[1.625rem] overflow-hidden bg-[#050505] aspect-[4/3] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] h-full">
                  {item.type === 'image' ? (
                    <Image src={item.src} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]" />
                  ) : (
                    <video src={item.src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]" muted loop playsInline onMouseOver={e => e.target.play()} onMouseOut={e => {e.target.pause(); e.target.currentTime = 0;}} />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-6">
                    <div className="flex justify-end transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      <button 
                        onClick={() => deleteItem(item.id, item.src)}
                        className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 backdrop-blur-md"
                        title="حذف"
                      >
                        <Trash2 size={20} strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      <span className="inline-block px-3 py-1 bg-white/10 text-white backdrop-blur-md rounded-full text-[10px] uppercase tracking-wider font-bold mb-3 border border-white/20">
                        {item.category}
                      </span>
                      <h3 className="text-white font-bold text-lg truncate drop-shadow-md">{item.title}</h3>
                    </div>
                  </div>

                  {item.type === 'video' && (
                    <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 z-10">
                      <Video size={16} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative"
            >
              <div className="flex items-center justify-between p-8 border-b border-white/5">
                <h3 className="text-2xl font-bold text-white tracking-tight">إضافة عمل جديد</h3>
                <button 
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-8 space-y-8">
                
                {/* Media Upload */}
                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-3">الملف (صورة أو فيديو)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-56 rounded-[2rem] bg-[#050505] flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-colors relative overflow-hidden group border border-white/5"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*,video/*" 
                      className="hidden" 
                    />
                    
                    {previewUrl ? (
                      formData.type === 'image' ? (
                        <Image src={previewUrl} alt="Preview" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <video src={previewUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" autoPlay muted loop />
                      )
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 ease-out">
                          <Upload size={24} className="text-white/40" strokeWidth={1.5} />
                        </div>
                        <p className="text-white/40 text-sm font-medium">انقر لاختيار ملف من جهازك</p>
                      </div>
                    )}

                    {previewUrl && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <span className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold shadow-xl">تغيير الملف</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-3">عنوان العمل</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20 font-medium"
                    placeholder="مثال: حماية كاملة - مرسيدس G-Class"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-3">القسم / التصنيف</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-white/20 transition-all appearance-none font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-8 flex gap-4">
                  <button
                    type="submit"
                    disabled={uploading || !formData.file || !formData.title}
                    className="flex-1 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        جاري الرفع...
                      </>
                    ) : "حفظ العمل"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
