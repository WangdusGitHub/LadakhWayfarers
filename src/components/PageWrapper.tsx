/* ==========================================================
   PageWrapper.tsx — Framer Motion page transition wrapper
   All pages must be wrapped by this for enter/exit animations
   ========================================================== */
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

/* Page-level enter/exit animation variants */
const variants = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -14 },
};

const transition = {
  duration: 0.38,
  /* Custom cubic-bezier cast to satisfy Framer Motion's Easing type */
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <motion.div
      className={`page-wrapper ${className}`}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
