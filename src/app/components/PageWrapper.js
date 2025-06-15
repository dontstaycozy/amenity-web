'use client';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -100, y: 0 },
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ type: 'tween', duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;