"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { User, Lock, Mail, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Fetch current user email
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email);
      }
    };
    getUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const updates = {};
      if (email) updates.email = email;
      if (password) updates.password = password;

      if (Object.keys(updates).length === 0) {
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      setMessage({ type: "success", text: "تم تحديث بيانات الدخول بنجاح!" });
      setPassword(""); // Clear password field after update
    } catch (error) {
      console.error("Update error:", error);
      setMessage({ type: "error", text: error.message || "حدث خطأ أثناء تحديث البيانات" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">إعدادات الحساب</h1>
          <p className="text-white/50 text-sm">تغيير البريد الإلكتروني وكلمة المرور الخاصة بلوحة التحكم</p>
        </div>
      </div>

      <div className="bg-[#050505] border border-white/5 rounded-2xl p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          
          {message.text && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <div>
            <label className="block text-white/70 text-sm mb-2 font-medium">البريد الإلكتروني الجديد</label>
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
                placeholder="example@gmail.com"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2 font-medium">كلمة المرور الجديدة (اتركها فارغة إذا لم ترد تغييرها)</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white/40">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-primary text-black hover:bg-[#dfc07b] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
