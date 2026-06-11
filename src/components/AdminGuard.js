"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({ children }) {
  const { user, loadingUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loadingUser) {
      const isLoginRoute = pathname === "/admin/login";
      if (!user && !isLoginRoute) {
        router.push("/admin/login");
      } else if (user && isLoginRoute) {
        router.push("/admin");
      }
    }
  }, [user, loadingUser, pathname, router]);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isLoginRoute = pathname === "/admin/login";
  if (!user && !isLoginRoute) return null;
  
  return children;
}
