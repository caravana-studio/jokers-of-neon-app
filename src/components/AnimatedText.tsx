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
    <div style={{ position: "relative", overflow: "hidden", display: "block" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration }}
          style={{ display: "inline-block" }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
