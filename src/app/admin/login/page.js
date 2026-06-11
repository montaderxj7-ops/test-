"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { CarFront, Lock, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      // AdminGuard will automatically redirect to /admin on successful login
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.1)_0%,_transparent_50%)]"></div>
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10 w-full max-w-md"
      >


        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Inner Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a1a1a] to-black border border-white/5 flex items-center justify-center text-primary mb-4 shadow-[0_0_30px_rgba(197,160,89,0.2)]">
              <CarFront size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">تسجيل الدخول</h1>
            <p className="text-white/50 text-sm">مرحباً بك في لوحة تحكم إدارة GTA</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-white/70 text-sm mb-2 font-medium">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white/40">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                  placeholder="gtabasraadmin@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2 font-medium">كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white/40">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[#dfc07b] to-primary text-black hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "جاري الدخول..." : "دخول"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
