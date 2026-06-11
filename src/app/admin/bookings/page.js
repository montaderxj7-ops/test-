"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, CheckCircle, Clock, Trash2, Edit2, X, Save, Loader2, AlertCircle, Plus, ChevronDown } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingBooking, setEditingBooking] = useState(null);

  // Services State
  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchServices();

    if (supabase) {
      const channel = supabase
        .channel('admin_bookings_page')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
          fetchBookings();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const fetchServices = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setAvailableServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .neq("status", "مكتمل")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (booking, newStatus) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", booking.id);
      
      if (error) throw error;
      
      // Auto-create warranty if completed and eligible
      if (newStatus === 'مكتمل') {
        const servicesRequested = booking.service_requested ? booking.service_requested.split(" + ") : [];
        const hasWarranty = servicesRequested.some(serviceName => {
          const s = availableServices.find(as => as.name.trim() === serviceName.trim());
          return s && s.has_warranty !== false;
        });

        if (hasWarranty) {
          const { data: existingWarranties } = await supabase
            .from("warranties")
            .select("id")
            .eq("booking_id", booking.id);
            
          if (!existingWarranties || existingWarranties.length === 0) {
            const warrantyCode = 'GTA-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + new Date().getFullYear();
            const startDate = new Date();
            const expiryDate = new Date();
            expiryDate.setFullYear(startDate.getFullYear() + 10);
            
            await supabase.from("warranties").insert([{
              booking_id: booking.id,
              customer_name: booking.customer_name,
              phone_number: booking.phone_number,
              car_type: booking.car_type,
              car_plate: booking.car_plate || 'غير محدد',
              service_requested: booking.service_requested,
              warranty_code: warrantyCode,
              start_date: startDate.toISOString().split('T')[0],
              expiry_date: expiryDate.toISOString().split('T')[0]
            }]);
          }
        }
      }

      if (newStatus === 'مكتمل') {
        setBookings(bookings.filter(b => b.id !== booking.id));
      } else {
        setBookings(bookings.map(b => b.id === booking.id ? { ...b, status: newStatus } : b));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("حدث خطأ أثناء تحديث الحالة");
    }
  };

  const deleteBooking = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الحجز؟")) return;
    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      setBookings(bookings.filter(b => b.id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const openEditModal = (booking) => {
    setErrorMsg("");
    setEditingBooking({ ...booking });
    setIsModalOpen(true);
  };

  const handleServiceToggle = (serviceName, servicePrice) => {
    const currentServices = editingBooking.service_requested ? editingBooking.service_requested.split(" + ") : [];
    let newServices = [];
    let priceDiff = 0;

    if (currentServices.includes(serviceName)) {
      newServices = currentServices.filter(s => s !== serviceName);
      priceDiff = -servicePrice;
    } else {
      newServices = [...currentServices, serviceName];
      priceDiff = servicePrice;
    }

    setEditingBooking({
      ...editingBooking,
      service_requested: newServices.join(" + "),
      total_price: Math.max(0, (parseFloat(editingBooking.total_price) || 0) + priceDiff)
    });
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingBooking(null), 300);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");

    try {
      if (editingBooking.id) {
        const { error } = await supabase
          .from("bookings")
          .update({
            customer_name: editingBooking.customer_name,
            phone_number: editingBooking.phone_number,
            car_type: editingBooking.car_type,
            car_plate: editingBooking.car_plate,
            service_requested: editingBooking.service_requested,
            total_price: editingBooking.total_price,
            booking_date: editingBooking.booking_date,
            status: editingBooking.status
          })
          .eq("id", editingBooking.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("bookings")
          .insert([{
            customer_name: editingBooking.customer_name,
            phone_number: editingBooking.phone_number,
            car_type: editingBooking.car_type,
            car_plate: editingBooking.car_plate,
            service_requested: editingBooking.service_requested,
            total_price: editingBooking.total_price,
            booking_date: editingBooking.booking_date,
            status: editingBooking.status
          }]);
          
        if (error) throw error;
      }
      
      await fetchBookings();
      closeEditModal();
    } catch (error) {
      console.error("Error saving booking:", error);
      setErrorMsg("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const openAddModal = () => {
    setErrorMsg("");
    setEditingBooking({
      customer_name: "",
      phone_number: "",
      car_type: "",
      car_plate: "",
      service_requested: "",
      booking_date: new Date().toISOString().split('T')[0],
      total_price: 0,
      status: "قيد الانتظار"
    });
    setIsModalOpen(true);
  };

  const getStatusBadge = (booking) => {
    const statusColors = {
      "مؤكد": "bg-green-500/10 text-green-500 border-green-500/20",
      "مكتمل": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "قيد الانتظار": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    };

    return (
      <div className="relative inline-block">
        <select
          value={booking.status}
          onChange={(e) => updateStatus(booking, e.target.value)}
          className={`appearance-none outline-none cursor-pointer pl-8 pr-3 py-1 rounded-full text-xs font-bold border transition-colors ${statusColors[booking.status] || statusColors["قيد الانتظار"]}`}
          dir="rtl"
        >
          <option value="قيد الانتظار">قيد الانتظار</option>
          <option value="مؤكد">مؤكد</option>
          <option value="مكتمل">مكتمل</option>
          <option value="ملغى">ملغى</option>
        </select>
        <ChevronDown size={12} className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${booking.status === 'مؤكد' ? 'text-green-500' : booking.status === 'مكتمل' ? 'text-blue-500' : 'text-yellow-500'}`} />
      </div>
    );
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">إدارة الحجوزات</h1>
          <p className="text-white/50 text-sm font-medium">عرض وتحديث طلبات الحجز من العملاء</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={openAddModal}
            className="btn-3d px-6 py-2.5 flex items-center gap-2 interactive text-sm"
          >
            <Plus size={18} />
            إضافة حجز
          </button>
          <div className="w-14 h-14 rounded-[1.25rem] bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-primary shadow-[inset_0_0_20px_rgba(197,160,89,0.1)] hidden sm:flex">
            <CalendarDays size={24} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="p-1.5 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent">
        <div className="bg-[#050505] rounded-[2.375rem] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] min-h-[60vh]">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-white/80">
              <thead className="bg-[#0a0a0a] border-b border-white/5 text-white/60 text-sm font-medium">
                <tr>
                  <th className="p-6 font-normal">اسم العميل</th>
                  <th className="p-6 font-normal">رقم الهاتف</th>
                  <th className="p-6 font-normal">نوع السيارة</th>
                  <th className="p-6 font-normal">الخدمة المطلوبة</th>
                  <th className="p-6 font-normal">المجموع الإجمالي</th>
                  <th className="p-6 font-normal">التاريخ المفضل</th>
                  <th className="p-6 font-normal">الحالة</th>
                  <th className="p-6 font-normal text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-20 text-center text-white/30">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      جاري التحميل...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-20 text-center text-white/30">لا يوجد حجوزات حالياً</td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={booking.id} 
                      className="hover:bg-white/[0.02] transition-colors duration-300"
                    >
                      <td className="p-6 font-bold text-white/90">{booking.customer_name}</td>
                      <td className="p-6 text-sm" dir="ltr"><span className="float-right text-white/70">{booking.phone_number}</span></td>
                      <td className="p-6 text-sm text-white/70">
                        <div>{booking.car_type}</div>
                        {booking.car_plate && (
                          <div className="text-white/40 text-xs mt-1.5 font-mono bg-white/5 inline-block px-2 py-0.5 rounded-md">
                            لوحة: {booking.car_plate}
                          </div>
                        )}
                      </td>
                      <td className="p-6 text-sm font-medium text-white/80">{booking.service_requested}</td>
                      <td className="p-6 text-sm font-bold text-primary">{Number(booking.total_price).toLocaleString('en-US')} د.ع</td>
                      <td className="p-6 text-sm text-white/70">{booking.booking_date}</td>
                      <td className="p-6">{getStatusBadge(booking)}</td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => deleteBooking(booking.id)} className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300" title="حذف">
                            <Trash2 size={18} strokeWidth={2} />
                          </button>
                          <button onClick={() => openEditModal(booking)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white hover:text-black transition-all duration-300" title="تعديل">
                            <Edit2 size={18} strokeWidth={2} />
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

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingBooking && (
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
              className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[2rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="flex items-center justify-between mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-white">
                  {editingBooking.id ? "تعديل الحجز" : "إضافة حجز جديد"}
                </h2>
                <button 
                  onClick={closeEditModal}
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

              <form onSubmit={handleSaveEdit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">اسم العميل</label>
                    <input 
                      type="text" 
                      value={editingBooking.customer_name || ''}
                      onChange={(e) => setEditingBooking({...editingBooking, customer_name: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">رقم الهاتف</label>
                    <input 
                      type="text" 
                      value={editingBooking.phone_number || ''}
                      onChange={(e) => setEditingBooking({...editingBooking, phone_number: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-left"
                      dir="ltr"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">نوع السيارة والموديل</label>
                    <input 
                      type="text" 
                      value={editingBooking.car_type || ''}
                      onChange={(e) => setEditingBooking({...editingBooking, car_type: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">رقم لوحة السيارة</label>
                    <input 
                      type="text" 
                      value={editingBooking.car_plate || ''}
                      onChange={(e) => setEditingBooking({...editingBooking, car_plate: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-left"
                      dir="auto"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white/70 text-sm font-medium mb-3">الخدمات المطلوبة</label>
                    {availableServices.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availableServices.map((service) => {
                          const isSelected = editingBooking.service_requested && editingBooking.service_requested.split(" + ").includes(service.name);
                          return (
                            <label 
                              key={service.id} 
                              onClick={() => handleServiceToggle(service.name, service.price)}
                              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-primary/10 border-primary' : 'bg-[#111] border-white/5 hover:border-white/20'}`}
                            >
                              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-primary border-primary text-black' : 'border-white/20 bg-black'}`}>
                                {isSelected && <CheckCircle size={14} strokeWidth={3} />}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-white'}`}>{service.name}</p>
                                <p className="text-white/50 text-xs mt-0.5">{Number(service.price).toLocaleString('en-US')} د.ع</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-white/50 text-sm py-4">لا توجد خدمات متاحة حالياً. يرجى إضافتها من صفحة الخدمات.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">تاريخ الحجز المفضل</label>
                    <input 
                      type="date" 
                      value={editingBooking.booking_date || ''}
                      onChange={(e) => setEditingBooking({...editingBooking, booking_date: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-left"
                      dir="ltr"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">المجموع الإجمالي (د.ع)</label>
                    <input 
                      type="number" 
                      value={editingBooking.total_price || 0}
                      onChange={(e) => setEditingBooking({...editingBooking, total_price: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-left"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">الحالة</label>
                    <select 
                      value={editingBooking.status || 'قيد الانتظار'}
                      onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="قيد الانتظار">قيد الانتظار</option>
                      <option value="مؤكد">مؤكد</option>
                      <option value="مكتمل">مكتمل</option>
                      <option value="ملغى">ملغى</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 btn-3d py-3 flex items-center justify-center gap-2 interactive text-sm disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin text-black" /> : <Save size={18} />}
                    {editingBooking.id ? "حفظ التعديلات" : "إضافة الحجز"}
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
