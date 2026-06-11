"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, EyeOff, Eye, LogIn, X, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleAuthenticate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (!supabase) {
        throw new Error("يجب توفير مفاتيح Supabase في ملف .env.local لتعمل العملية بشكل حقيقي.");
      }

      const email = e.target.email.value;
      const password = e.target.password.value;
      
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Ensure a session was actually created
        if (!data?.session) {
          throw new Error("Invalid login credentials");
        }
      } else {
        const fullName = e.target.fullName.value;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
      }

      onClose();
      router.push('/booking');
    } catch (error) {
      if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
        setErrorMsg("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      } else if (error.message.includes('already registered')) {
        setErrorMsg("البريد الإلكتروني مستخدم بالفعل.");
      } else if (error.message.includes('Email not confirmed')) {
        setErrorMsg("يرجى تأكيد بريدك الإلكتروني عبر الرابط المرسل إليك.");
      } else {
        setErrorMsg(error.message || "حدث خطأ غير متوقع.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      if (!supabase) {
        throw new Error("يجب توفير مفاتيح Supabase في ملف .env.local لتعمل العملية بشكل حقيقي.");
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/booking`
        }
      });
      
      if (error) throw error;
      
      // Supabase OAuth redirects the page, so we don't need to push manually.
    } catch (error) {
      console.error(error);
      setErrorMsg("تم إلغاء أو فشل تسجيل الدخول بحساب Google.");
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          onClick={!isLoading ? onClose : undefined}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>

            <button 
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-6 left-6 text-white/40 hover:text-white transition-colors z-10 disabled:opacity-50"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 flex flex-col items-center">
              {/* Top Icon Area */}
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-6 shadow-lg">
                {isLogin ? <LogIn size={24} /> : <LogOut size={24} />}
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </h2>
              <p className="text-white/50 text-sm mb-6 text-center">
                {isLogin 
                  ? 'قم بإدخال بياناتك للمتابعة وحجز موعدك' 
                  : 'انضم إلينا لتحصل على أفضل تجربة عناية بسيارتك'}
              </p>

              {/* Error Message */}
              {errorMsg && (
                <div className="w-full bg-red-500/10 border border-red-500/30 text-red-500 text-sm px-4 py-3 rounded-xl mb-6 flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form className="w-full space-y-4" onSubmit={handleAuthenticate}>
                {!isLogin && (
                  <div className="relative">
                    <input 
                      type="text" 
                      name="fullName"
                      disabled={isLoading}
                      placeholder="الاسم الكامل"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder:text-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm disabled:opacity-50"
                      required={!isLogin}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input 
                    type="email" 
                    name="email"
                    disabled={isLoading}
                    placeholder="البريد الإلكتروني"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder:text-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-left disabled:opacity-50"
                    dir="ltr"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password"
                    disabled={isLoading}
                    placeholder="كلمة المرور"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 pr-11 text-white placeholder:text-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-left disabled:opacity-50"
                    dir="ltr"
                    required
                    minLength="6"
                  />
                  <button 
                    type="button"
                    disabled={isLoading}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {isLogin && (
                  <div className="flex justify-end w-full">
                    <button type="button" className="text-sm text-white/50 hover:text-primary transition-colors disabled:opacity-50">
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black font-bold py-3.5 rounded-xl mt-4 hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] flex justify-center items-center disabled:opacity-70 disabled:cursor-wait interactive"
                >
                  {isLoading ? <Loader2 className="animate-spin text-black" size={20} /> : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
                </button>
              </form>

              {/* Divider */}
              <div className="w-full flex items-center justify-between my-8">
                <div className="h-[1px] bg-white/10 flex-1"></div>
                <span className="px-4 text-xs text-white/30 uppercase tracking-widest">أو عبر</span>
                <div className="h-[1px] bg-white/10 flex-1"></div>
              </div>

              {/* Social Logins */}
              <div className="flex gap-4 w-full justify-center">
                <button 
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-3 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white disabled:opacity-50 interactive"
                >
                  <GoogleIcon />
                  <span className="font-medium text-sm">المتابعة باستخدام Google</span>
                </button>
              </div>

              {/* Toggle Mode */}
              <p className="mt-8 text-sm text-white/50">
                {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrorMsg("");
                  }}
                  disabled={isLoading}
                  className="text-primary font-bold hover:underline disabled:opacity-50"
                >
                  {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                </button>
              </p>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
