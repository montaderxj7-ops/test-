"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    // Check if device supports hover (not a touch device)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setIsMobile(false);
    }

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      // Check if hovering over interactive elements
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (isMobile || pathname?.startsWith('/admin')) return null;

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
      backgroundColor: "transparent",
      border: "2px solid rgba(197, 160, 89, 0.5)", // primary color
    },
    hover: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1.5,
      backgroundColor: "rgba(197, 160, 89, 0.1)",
      border: "1px solid rgba(197, 160, 89, 1)",
    }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[999999]"
        variants={variants}
        animate={isHovering ? "hover" : "default"}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999999] shadow-[0_0_10px_#C5A059]"
        style={{ 
          transform: `translate(${mousePosition.x - 4}px, ${mousePosition.y - 4}px)`,
          transition: 'transform 0.05s linear'
        }}
      />
    </>
  );
}
