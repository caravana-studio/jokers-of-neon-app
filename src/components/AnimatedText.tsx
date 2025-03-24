import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string | null | undefined;
}

export const AnimatedText = ({ text }: AnimatedTextProps) => {
  return (
    <motion.span
      key={text}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {text}
    </motion.span>
  );
};
