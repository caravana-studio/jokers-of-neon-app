import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

interface HighlightAnimationProps {
  start: boolean;
  onAnimationComplete: () => void;
  children: React.ReactNode;
  borderRadius: string;
  shadowLightColor?: string;
  shadowColor?: string;
}

export const HighlightAnimation = ({
  start,
  onAnimationComplete,
  children,
  borderRadius,
  shadowColor,
  shadowLightColor,
}: HighlightAnimationProps) => {
  const [isScaled, setIsScaled] = useState(false);
  const [showBorder, setShowBorder] = useState(false);

  useEffect(() => {
    let scaleTimeout: NodeJS.Timeout;
    let borderTimeout: NodeJS.Timeout;

    if (start) {
      setIsScaled(true);

      scaleTimeout = setTimeout(() => {
        setShowBorder(true);
      }, 250);

      borderTimeout = setTimeout(() => {
        onAnimationComplete();
      }, 500);
    } else {
      setIsScaled(false);
      setShowBorder(false);
    }

    return () => {
      clearTimeout(scaleTimeout);
      clearTimeout(borderTimeout);
    };
  }, [start, onAnimationComplete]);

  return (
    <Box
      transform={isScaled ? "scale(1.1)" : "scale(1)"}
      transition="transform 0.5s ease-in-out, border 0.2s ease-in-out, box-shadow 0.6s ease-in-out"
      {...(showBorder && {
        border: "solid 1px white",
        borderRadius: borderRadius,
        boxShadow: `
          0 0 20px ${shadowLightColor},     
          0 0 40px ${shadowColor},      
          inset 0 0 10px ${shadowColor} 
        `,
      })}
    >
      {children}
    </Box>
  );
};
