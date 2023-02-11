import type { Cycle } from "framer-motion";
import { motion } from "framer-motion";
import Link from "next/link";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export const MenuItem = ({
  href,
  title,
  toggle,
}: {
  href: string;
  title: string;
  toggle: Cycle;
}) => {
  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        onClick={() => toggle()}
        className="my-16 block text-center text-3xl text-stone-300"
        href={href}
      >
        {title}
      </Link>
    </motion.li>
  );
};
