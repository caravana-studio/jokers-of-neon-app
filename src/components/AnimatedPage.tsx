import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export const AnimatedPage = ({ children }: PropsWithChildren) => {
  return (
    <motion.div
      style={{
        width: "100%",
        height: "100%",
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
