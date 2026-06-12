"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminGuard from "@/components/AdminGuard";
import { LayoutDashboard, CalendarDays, Image as ImageIcon, LogOut, CarFront, Settings, Bell, Wrench, ShieldCheck, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isLoginRoute = pathname === "/admin/login";

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const notifRef = useRef(null);

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio play failed:", e);
    }
  };

  useEffect(() => {
    if (isLoginRoute) return; // Don't subscribe on login page
    
    let lastChecked = new Date().toISOString();

    const checkNewBookings = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .gt('created_at', lastChecked)
          .order('created_at', { ascending: true });
        
        if (error) throw error;

        if (data && data.length > 0) {
          lastChecked = data[data.length - 1].created_at;

          data.forEach(newBooking => {
            setNotifications(prev => [{
              id: newBooking.id,
              message: `حجز جديد من ${newBooking.customer_name}`,
              time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
              read: false
            }, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show visual toast
            setToast({
              id: Date.now() + Math.random(),
              title: 'حجز جديد! 🎉',
              message: `تم استلام حجز من ${newBooking.customer_name} لخدمة ${newBooking.service_requested}`
            });

            // Hide toast after 5 seconds
            setTimeout(() => setToast(null), 5000);
            
            if (Notification.permission === "granted") {
              new Notification("حجز جديد!", {
                body: `حجز جديد للخدمة: ${newBooking.service_requested}\nالعميل: ${newBooking.customer_name}`,
                icon: "/favicon.ico"
              });
            }
          });

          // Play sound once per batch
          playNotificationSound();
          
          // Dispatch global event for other components to refresh
          window.dispatchEvent(new Event('new_booking'));
        }
      } catch (err) {
        console.error("Error polling bookings:", err);
      }
    };

    const intervalId = setInterval(checkNewBookings, 5000);

    if ("Notification" in window) {
      Notification.requestPermission();
    }

    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLoginRoute]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  if (isLoginRoute) {
    return (
      <AdminGuard>
        <style>{`
          * { cursor: auto !important; }
          a, button, [role="button"], label, .cursor-pointer { cursor: pointer !important; }
          input, textarea { cursor: text !important; }
        `}</style>
        {children}
      </AdminGuard>
    );
  }



  const navLinks = [
    { href: "/admin", icon: <LayoutDashboard size={20} strokeWidth={1.5} />, label: "الرئيسية" },
    { href: "/admin/bookings", icon: <CalendarDays size={20} strokeWidth={1.5} />, label: "الحجوزات" },
    { href: "/admin/services", icon: <Wrench size={20} strokeWidth={1.5} />, label: "الخدمات" },
    { href: "/admin/warranties", icon: <ShieldCheck size={20} strokeWidth={1.5} />, label: "الضمانات" },
    { href: "/admin/portfolio", icon: <ImageIcon size={20} strokeWidth={1.5} />, label: "الأعمال" },
  ];

  const bottomLinks = [
    { href: "/admin/settings", icon: <Settings size={20} strokeWidth={1.5} />, label: "الإعدادات" },
    { action: logout, icon: <LogOut size={20} strokeWidth={1.5} className="text-red-400" />, label: "خروج" },
  ];

  return (
    <AdminGuard>
      <style>{`
        * { cursor: auto !important; }
        a, button, [role="button"], label, .cursor-pointer { cursor: pointer !important; }
        input, textarea { cursor: text !important; }
      `}</style>
      <div className="min-h-[100dvh] bg-[#020202] text-white flex overflow-hidden font-sans selection:bg-primary/30" dir="ltr">
        
        {/* Deep Ambient Glow */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(223,192,123,0.05),transparent)]"></div>

        {/* Slim Sidebar (Icons Only on Desktop) */}
        <aside className="w-[80px] sm:w-[90px] border-r border-white/5 flex flex-col items-center py-8 shrink-0 relative z-20 bg-[#050505]">
          <Link href="/admin" className="mb-12 group relative">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 flex items-center justify-center text-primary group-hover:scale-[0.95] group-active:scale-90 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_0_20px_rgba(197,160,89,0.1)]">
              <CarFront size={22} strokeWidth={1.5} />
            </div>
            {/* Tooltip */}
            <span className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">GTA</span>
          </Link>

          <nav className="flex flex-col gap-6 w-full items-center flex-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative flex items-center justify-center w-full"
                >
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-[1rem] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[0.95] group-active:scale-90
                    ${isActive 
                      ? 'bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(197,160,89,0.15)] border border-primary/20' 
                      : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div layoutId="active-indicator" className="absolute -left-[17px] w-1 h-6 rounded-r-full bg-primary" />
                    )}
                    {link.icon}
                  </div>
                  {/* Tooltip */}
                  <span className="absolute left-[70px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#111] border border-white/10 text-white/90 text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 whitespace-nowrap z-50">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-6 w-full items-center mt-auto">
            {bottomLinks.map((link, idx) => {
              if (link.href) {
                return (
                  <Link
                    key={idx}
                    href={link.href}
                    className="group relative flex items-center justify-center w-full"
                  >
                    <div className={`relative flex items-center justify-center w-12 h-12 rounded-[1rem] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[0.95] group-active:scale-90 text-white/40 hover:bg-white/5 hover:text-white/80 ${pathname === link.href ? 'bg-white/10 text-white' : ''}`}>
                      {link.icon}
                    </div>
                    <span className="absolute left-[70px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#111] border border-white/10 text-white/90 text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 whitespace-nowrap z-50">
                      {link.label}
                    </span>
                  </Link>
                );
              }
              return (
                <button
                  key={idx}
                  onClick={link.action}
                  className="group relative flex items-center justify-center w-full"
                >
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-[1rem] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[0.95] group-active:scale-90 text-white/40 hover:bg-white/5 ${link.label === 'خروج' ? 'hover:text-red-400 hover:bg-red-400/10' : 'hover:text-white/80'}`}>
                    {link.icon}
                  </div>
                  <span className="absolute left-[70px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#111] border border-white/10 text-white/90 text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 whitespace-nowrap z-50">
                    {link.label}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 flex flex-col relative z-10 w-[calc(100%-90px)] h-[100dvh]">
          
          {/* Header */}
          <header className="h-24 px-8 flex items-center justify-between shrink-0" dir="rtl">
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold tracking-tight">مرحباً بك!</h2>
              <p className="text-white/40 text-sm font-medium tracking-wide">لوحة القيادة</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-colors ${showNotifications ? 'bg-white/10 text-white' : 'bg-[#0a0a0a] text-white/60 hover:text-white hover:border-white/20'}`}
                >
                  <Bell size={20} strokeWidth={1.5} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-3 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-4 ring-[#0a0a0a]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-14 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
                    >
                      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                        <h3 className="font-bold text-white">الإشعارات</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                            <Check size={14} /> تحديد كـ مقروء
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-white/40 text-sm">
                            لا توجد إشعارات حالياً
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            {notifications.map((notif, idx) => (
                              <div key={idx} className={`p-4 border-b border-white/5 last:border-0 flex flex-col gap-1 transition-colors ${notif.read ? 'bg-transparent' : 'bg-primary/5'}`}>
                                <div className="flex items-start justify-between gap-4">
                                  <p className={`text-sm ${notif.read ? 'text-white/70' : 'text-white font-medium'}`}>
                                    {notif.message}
                                  </p>
                                  <span className="text-[10px] text-white/40 shrink-0 mt-1">{notif.time}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex items-center justify-center mr-4">
                <Image src="/logo.png" alt="GTA Basra Logo" width={180} height={70} className="object-contain h-16 w-auto drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]" />
              </div>
            </div>
          </header>

          {/* Content Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 pb-8 sm:px-8">
            {/* Wrap children with initial mount animation */}
            <motion.div 
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="h-full"
            >
              {children}
            </motion.div>
          </div>
        </main>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-8 left-8 z-[99999] bg-[#111] border border-primary/30 shadow-[0_0_30px_rgba(197,160,89,0.2)] rounded-2xl p-5 flex items-start gap-4 max-w-sm"
              dir="rtl"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary border border-primary/30">
                <Bell size={20} strokeWidth={2} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">{toast.title}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToast(null)}
                className="absolute top-4 left-4 text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminGuard>
  );
}
