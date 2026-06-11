"use client";

import { motion } from 'framer-motion';

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
