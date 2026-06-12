"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Briefcase, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, CreditCard, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ bookings: 0, portfolio: 0, pendingBookings: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { count: bookingsCount } = await supabase.from("bookings").select("*", { count: "exact", head: true }).neq("status", "مكتمل");
        const { count: pendingCount } = await supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "قيد الانتظار");
        const { count: portfolioCount } = await supabase.from("portfolio_items").select("*", { count: "exact", head: true });

        // Fetch all bookings for analytics
        const { data: allBookings } = await supabase.from("bookings").select("created_at, service_requested");
        
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let currentMonthCount = 0;
        let lastMonthCount = 0;
        const serviceCounts = {};

        allBookings?.forEach(b => {
          const d = new Date(b.created_at);
          if (d.getFullYear() === currentYear) {
            if (d.getMonth() === currentMonth) currentMonthCount++;
            if (d.getMonth() === currentMonth - 1) lastMonthCount++;
          } else if (currentMonth === 0 && d.getFullYear() === currentYear - 1 && d.getMonth() === 11) {
            lastMonthCount++;
          }

          if (b.service_requested) {
            const services = b.service_requested.split(" + ");
            services.forEach(s => {
              const trimmed = s.trim();
              if (trimmed) serviceCounts[trimmed] = (serviceCounts[trimmed] || 0) + 1;
            });
          }
        });

        let growth = 100;
        if (lastMonthCount > 0) {
          growth = Math.round(((currentMonthCount - lastMonthCount) / lastMonthCount) * 100);
        } else if (currentMonthCount === 0 && lastMonthCount === 0) {
          growth = 0;
        }

        const sortedServices = Object.entries(serviceCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 7);

        const maxCount = sortedServices.length > 0 ? sortedServices[0][1] : 1;
        const serviceChartData = sortedServices.map(([name, count]) => ({
          name: name.split(" ")[0], // First word for brevity
          height: Math.max((count / maxCount) * 100, 15), // min height
          count
        }));
        
        while (serviceChartData.length < 7) {
          serviceChartData.push({ name: "-", height: 5, count: 0 });
        }

        setStats({
          bookings: bookingsCount || 0,
          pendingBookings: pendingCount || 0,
          portfolio: portfolioCount || 0,
          growth,
          serviceChartData
        });

        const { data: recent } = await supabase.from("bookings").select("*").neq("status", "مكتمل").order("created_at", { ascending: false }).limit(4);
        setRecentBookings(recent || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (supabase) {
      fetchData();
      
      const handleNewBooking = () => {
        fetchData();
      };
      
      window.addEventListener('new_booking', handleNewBooking);

      return () => {
        window.removeEventListener('new_booking', handleNewBooking);
      };
    }
  }, []);

  const topCards = [
    { title: "إجمالي الحجوزات", value: stats.bookings, icon: <Briefcase size={20} />, dark: true },
    { title: "حجوزات قيد الانتظار", value: stats.pendingBookings, icon: <Clock size={20} />, dark: false },
    { title: "أعمال المعرض", value: stats.portfolio, icon: <ShieldCheck size={20} />, dark: false },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full" dir="rtl">
      
      {/* Main Stats & Charts */}
      <div className="flex flex-col gap-8">
        
        {/* Top Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className={`p-1.5 rounded-[2rem] ${card.dark ? 'bg-gradient-to-b from-white/10 to-transparent' : 'bg-[#0a0a0a] border border-white/5'}`}
            >
              <div className={`h-full rounded-[1.625rem] p-6 flex flex-col justify-between ${card.dark ? 'bg-[#050505] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'bg-[#0a0a0a]'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.dark ? 'bg-primary text-black' : 'bg-white/5 text-white/70 border border-white/10'}`}>
                    {card.icon}
                  </div>
                  <button className="text-white/30 hover:text-white transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                </div>
                <div>
                  <p className="text-white/50 text-sm font-medium mb-1">{card.title}</p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-3xl font-bold text-white">{card.value}</h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Middle Charts Row (Aesthetic Dummy Charts matching the layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h4 className="font-bold text-white/90">مؤشر النمو</h4>
              <span className="text-xs text-white/40 flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full">آخر 30 يوم <ChevronDown size={14} /></span>
            </div>
            <div className="mb-4 relative z-10">
              <h3 className="text-3xl font-bold text-white">{stats.growth > 0 ? '+' : ''}{stats.growth || 0}%</h3>
              <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full mt-2 ${stats.growth >= 0 ? 'text-primary bg-primary/10' : 'text-red-500 bg-red-500/10'}`}>
                {stats.growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} 
                {stats.growth >= 0 ? 'نمو إيجابي' : 'تراجع'}
              </div>
            </div>
            {/* Aesthetic SVG Chart */}
            <div className="absolute bottom-0 left-0 right-0 h-32 opacity-50 pointer-events-none">
              <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full stroke-primary fill-none" strokeWidth="1.5">
                <path d="M0,50 Q10,40 20,45 T40,30 T60,35 T80,15 T100,5" />
                <path d="M0,50 Q10,40 20,45 T40,30 T60,35 T80,15 T100,5 L100,50 L0,50 Z" className="fill-primary/10 stroke-none" />
              </svg>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-bold text-white/90">أداء الخدمات</h4>
              <span className="text-xs text-white/40 flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full">2026 <ChevronDown size={14} /></span>
            </div>
            <div className="flex items-end gap-2 h-32 mt-auto">
              {stats.serviceChartData?.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group relative">
                  {/* Tooltip */}
                  {item.count > 0 && (
                    <div className="absolute -top-8 bg-black border border-white/10 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {item.count} حجز
                    </div>
                  )}
                  <div className={`w-full rounded-t-lg transition-all duration-500 ease-out group-hover:bg-primary/80 ${i === 0 && item.count > 0 ? 'bg-primary shadow-[0_0_15px_rgba(197,160,89,0.5)]' : 'bg-white/10'}`} style={{ height: `${item.height}%` }}></div>
                  <span className="text-[10px] text-white/50 truncate w-full text-center">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom List - Recent Bookings */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-white/90">أحدث الحجوزات</h4>
            <span className="text-xs text-white/40 cursor-pointer hover:text-white transition-colors">عرض الكل</span>
          </div>
          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <p className="text-white/40 text-center py-4 text-sm">لا يوجد حجوزات حديثة</p>
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      {b.car_type.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-white/90 text-sm">{b.customer_name}</h5>
                      <p className="text-xs text-white/40">{b.booking_date} • {b.car_type}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white/90 text-sm">{b.service_requested}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${b.status === 'مؤكد' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{b.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
