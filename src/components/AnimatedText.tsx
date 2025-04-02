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
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (displayedText !== newText) {
      setIsExiting(true);
    }
  }, [displayedText]);

  return (
    <motion.div
      style={{
        position: "relative",
        overflow: "visible",
        display: "flex",
        height: "100%",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          setNewText(displayedText);
          setIsExiting(false);
        }}
      >
        {!isExiting && (
          <motion.div
            key={newText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration }}
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
