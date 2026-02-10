import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode } from 'react';

type AppearProps = {
  children: ReactNode;
  className?: string;
  isAppear?: boolean;
};

function Appear({ children, className, isAppear = true }: AppearProps) {
  return (
    <AnimatePresence>
      {isAppear ? (
        <motion.div
          className={className}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export const Animation = {
  Appear,
};
