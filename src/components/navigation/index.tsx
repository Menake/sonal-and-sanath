import * as React from "react";
import { motion } from "framer-motion";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const Navigation = ({ children }: { children: React.ReactNode }) => (
  <motion.ul
    className="flex h-screen w-full flex-col justify-center"
    variants={variants}
  >
    {children}
  </motion.ul>
);
