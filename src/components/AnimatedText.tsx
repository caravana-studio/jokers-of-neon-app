import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface AnimatedTextProps {
  children: ReactNode;
  duration: number;
  displayedText: string;
}

export const AnimatedText = ({
  children,
  duration,
  displayedText,
}: AnimatedTextProps) => {
  const [newText, setNewText] = useState(displayedText);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (newText != displayedText) {
      setKey((prev) => prev + 1);
      setNewText(displayedText);
    }
  }, [children]);

  return (
    <motion.div
      style={{
        position: "relative",
        overflow: "visible",
        display: "flex",
        height: "100%",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration }}
          style={{ display: "flex", flex: 1 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
