"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ShieldCheck, QrCode, ExternalLink, X, Trash2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Link from "next/link";

export default function AdminWarrantiesPage() {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrModalUrl, setQrModalUrl] = useState(null);

  useEffect(() => {
    fetchWarranties();
  }, []);

  const fetchWarranties = async () => {
    setLoading(true);
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("warranties")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setWarranties(data || []);
    } catch (error) {
      console.error("Error fetching warranties:", error);
    } finally {
      setLoading(false);
    }
  };

  const showQrCode = (code) => {
    const url = `${window.location.origin}/warranty/${code}`;
    setQrModalUrl(url);
  };

  const deleteWarranty = async (id) => {
    if (!confirm("هل أنت متأكد من أنك تريد حذف هذا الضمان؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    
    try {
      const { error } = await supabase.from("warranties").delete().eq("id", id);
      if (error) throw error;
      fetchWarranties();
    } catch (error) {
      console.error("Error deleting warranty:", error);
      alert("حدث خطأ أثناء محاولة الحذف");
    }
  };

  return (
    <>
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">إدارة الضمانات</h1>
          <p className="text-white/50 text-sm font-medium">سجل الضمانات الإلكترونية الصادرة للعملاء (10 سنوات)</p>
        </div>
        <div className="w-14 h-14 rounded-[1.25rem] bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-[#c5a059] shadow-[inset_0_0_20px_rgba(197,160,89,0.1)] hidden sm:flex">
          <ShieldCheck size={24} strokeWidth={1.5} />
        </div>
      </div>

      <div className="p-1.5 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent">
        <div className="bg-[#050505] rounded-[2.375rem] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] min-h-[60vh]">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-white/80">
              <thead className="bg-[#0a0a0a] border-b border-white/5 text-white/60 text-sm font-medium">
                <tr>
                  <th className="p-6 font-normal">رمز الضمان</th>
                  <th className="p-6 font-normal">اسم العميل</th>
                  <th className="p-6 font-normal">السيارة واللوحة</th>
                  <th className="p-6 font-normal">الخدمات المشمولة</th>
                  <th className="p-6 font-normal">تاريخ الإصدار</th>
                  <th className="p-6 font-normal">تاريخ الانتهاء</th>
                  <th className="p-6 font-normal text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-20 text-center text-white/30">
                      <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      جاري التحميل...
                    </td>
                  </tr>
                ) : warranties.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-20 text-center text-white/30">لا توجد ضمانات صادرة حالياً</td>
                  </tr>
                ) : (
                  warranties.map((warranty) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={warranty.id} 
                      className="hover:bg-white/[0.02] transition-colors duration-300"
                    >
                      <td className="p-6 font-mono text-xs font-bold text-[#c5a059]">{warranty.warranty_code}</td>
                      <td className="p-6 font-bold text-white/90">
                        {warranty.customer_name}
                        <div className="text-white/40 text-xs font-normal mt-1" dir="ltr">{warranty.phone_number}</div>
                      </td>
                      <td className="p-6 text-sm text-white/70">
                        <div>{warranty.car_type}</div>
                        <div className="text-white/40 text-xs mt-1.5 font-mono bg-white/5 inline-block px-2 py-0.5 rounded-md">
                          لوحة: {warranty.car_plate}
                        </div>
                      </td>
                      <td className="p-6 text-sm font-medium text-white/80">{warranty.service_requested}</td>
                      <td className="p-6 text-sm text-white/70">{warranty.start_date}</td>
                      <td className="p-6 text-sm text-[#c5a059] font-bold">
                        <div className="flex items-center gap-2">
                          {warranty.expiry_date}
                          {(!warranty.is_active || new Date(warranty.expiry_date) < new Date()) && (
                            <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded border border-red-500/20">منتهي</span>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => showQrCode(warranty.warranty_code)} 
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white hover:text-black transition-all duration-300 relative group" 
                            title="عرض الباركود"
                          >
                            <QrCode size={18} />
                          </button>
                          <Link 
                            href={`/warranty/${warranty.warranty_code}`} 
                            target="_blank"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-[#c5a059] hover:text-black transition-all duration-300" 
                            title="معاينة بطاقة الضمان"
                          >
                            <ExternalLink size={18} strokeWidth={2} />
                          </Link>
                          <button 
                            onClick={() => deleteWarranty(warranty.id)} 
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/5 text-red-500/50 hover:bg-red-500 hover:text-white transition-all duration-300" 
                            title="حذف الضمان"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

      {/* QR Code Modal */}
      {qrModalUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setQrModalUrl(null)}
          ></div>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative z-10 w-full max-w-sm flex flex-col items-center">
            <button 
              onClick={() => setQrModalUrl(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white hover:text-black transition-colors"
            >
              <X size={16} />
            </button>
            <h3 className="text-xl font-bold text-white mb-6 text-center">امسح الباركود</h3>
            <div className="bg-white p-4 rounded-2xl w-full flex justify-center">
              <QRCodeCanvas 
                value={qrModalUrl} 
                size={220}
                level="H"
                fgColor="#000000"
                bgColor="#ffffff"
                style={{ width: "100%", height: "auto", maxWidth: "220px" }}
              />
            </div>
            <p className="text-white/40 text-sm mt-6 text-center">
              يمكن للعميل تصوير هذا الباركود بكاميرا هاتفه للاحتفاظ بشهادة الضمان الرقمية.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
