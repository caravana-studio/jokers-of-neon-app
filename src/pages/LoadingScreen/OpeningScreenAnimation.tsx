import { chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SEASON_NUMBER } from "../../constants/season";
import { LegacyLogoPresentation } from "./LegacyLogoPresentation";
import { LogoPresentation } from "./LogoPresentation";
import { PoweredByPresentation } from "./PoweredBy";

const MotionBox = chakra(motion.div);

interface OpeningScreenAnimationProps {
  onAnimationEnd: () => void;
  skipAnimation?: boolean;
}

const OpeningScreenAnimation: React.FC<OpeningScreenAnimationProps> = ({
  onAnimationEnd,
  skipAnimation = false,
}) => {
  const isSeason2 = SEASON_NUMBER === 2;
  const hasFinishedRef = useRef(false);
  const [stage, setStage] = useState<"logo" | "poweredBy" | "end">("logo");
  const [logoVisibility, setLogoVisibility] = useState({
    text: false,
    logo: false,
  });
  const [poweredByVisibility, setPoweredByVisibility] = useState({
    text: false,
    logo1: false,
    logo2: false,
    logo3: false,
  });

  useEffect(() => {
    if (isSeason2) {
      const timer = setTimeout(() => {
        if (hasFinishedRef.current) return;
        hasFinishedRef.current = true;
        onAnimationEnd();
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (skipAnimation) {
      setStage("end");
      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        onAnimationEnd();
      }
      return;
    }

    if (stage === "logo") {
      const t1 = setTimeout(
        () => setLogoVisibility((prev) => ({ ...prev, logo: true })),
        500
      );
      const t2 = setTimeout(
        () => setLogoVisibility((prev) => ({ ...prev, text: true })),
        2000
      );
      const t3 = setTimeout(() => {
        setLogoVisibility({
          text: false,
          logo: false,
        });
      }, 4000);
      const t4 = setTimeout(() => {
        setStage("poweredBy");
      }, 5000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    if (stage === "poweredBy") {
      const t1 = setTimeout(
        () => setPoweredByVisibility((prev) => ({ ...prev, text: true })),
        500
      );
      const t2 = setTimeout(
        () => setPoweredByVisibility((prev) => ({ ...prev, logo1: true })),
        1000
      );
      const t3 = setTimeout(
        () => setPoweredByVisibility((prev) => ({ ...prev, logo2: true })),
        1500
      );
      const t4 = setTimeout(
        () => setPoweredByVisibility((prev) => ({ ...prev, logo3: true })),
        2000
      );
      const t5 = setTimeout(() => {
        setPoweredByVisibility({
          text: false,
          logo1: false,
          logo2: false,
          logo3: false,
        });
      }, 4000);
      const t6 = setTimeout(() => {
        setStage("end");
        if (!hasFinishedRef.current) {
          hasFinishedRef.current = true;
          onAnimationEnd();
        }
      }, 5000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        clearTimeout(t6);
      };
    }
  }, [isSeason2, onAnimationEnd, skipAnimation, stage]);

  return (
    <MotionBox
      display={stage === "end" ? "none" : "flex"}
      alignItems="center"
      justifyContent="center"
      h="100vh"
      w="100vw"
      position="fixed"
      top={0}
      left={0}
      zIndex={20}
      pointerEvents="none"
      overflow="hidden"
    >
      {isSeason2 && <LogoPresentation />}
      {!isSeason2 && stage === "logo" && (
        <LegacyLogoPresentation visibleElements={logoVisibility} />
      )}
      {!isSeason2 && stage === "poweredBy" && (
        <PoweredByPresentation visibleElements={poweredByVisibility} />
      )}
    </MotionBox>
  );
};

export default OpeningScreenAnimation;
