import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedTextProps {
  children: ReactNode;
  duration: number;
  key: string;
}

export const AnimatedText = ({
  children,
  duration,
  key,
}: AnimatedTextProps) => {
  return (
    <div
      style={{ position: "relative", overflow: "visible", display: "block" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={key}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration }}
          style={{ display: "inline-block" }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
