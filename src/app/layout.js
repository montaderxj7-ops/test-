import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import FloatingButton from "@/components/FloatingButton";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

export const metadata = {
  title: "GTA Car Care Center | مركز GTA للعناية بالسيارات",
  description: "Premium car detailing, PPF, Nano Ceramic, and VIP washing services.",
};

export default function RootLayout({children}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable}`} suppressHydrationWarning>
      <body className="bg-black text-white relative" suppressHydrationWarning>
        <AuthProvider>
          <CustomCursor />
          <Navbar />
          {children}
          <FloatingButton />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
