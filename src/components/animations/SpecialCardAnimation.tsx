import { Heading } from "@chakra-ui/react";
import { animated, easings, useSpring } from "@react-spring/web";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCardAnimations } from "../../providers/CardAnimationsProvider";

interface SpecialCardAnimationProps {
  specialId: string;
  bgPath?: string;
  animatedImgPath?: string;
  animation?: ReactNode;
}

export const SpecialCardAnimation = ({
  specialId,
  bgPath,
  animatedImgPath,
  animation,
}: SpecialCardAnimationProps) => {
  const { t } = useTranslation("cards");
  const { setAnimateSecondChanceCard } = useCardAnimations();
  const navigate = useNavigate();

  const [showAnimContent, setShowAnimContent] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/map");
      setAnimateSecondChanceCard(false);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  const overlayAndTitleProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
    onRest: () => setShowAnimContent(true),
  });

  const titleProps = useSpring({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: {
      duration: 1200,
      easing: easings.easeOutCubic,
    },
  });

  const bgProps = useSpring({
    from: { scale: 0.6, opacity: 0 },
    to: showAnimContent
      ? { scale: 0.8, opacity: 1 }
      : { scale: 0.6, opacity: 0 },
    config: {
      duration: 500,
      easing: easings.easeOutCubic,
    },
  });

  const animProps = useSpring({
    from: { scale: 0.2, opacity: 0 },
    to: showAnimContent
      ? { scale: 1.2, opacity: 1 }
      : { scale: 0.2, opacity: 0 },
    delay: showAnimContent ? 800 : 0,
    config: {
      duration: 800,
      easing: easings.easeOutCubic,
    },
  });

  const fadeWrapperProps = useSpring({
    from: { opacity: 0, scale: 0.95 },
    to: { opacity: 1, scale: 1 },
    delay: 1000,
    config: {
      duration: 800,
      easing: easings.easeOutCubic,
    },
  });

  return (
    <animated.div
      style={{
        ...overlayAndTitleProps,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1000,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        gap: 6,
      }}
    >
      <animated.div
        style={{
          ...titleProps,
          zIndex: 4,
          position: "absolute",
          top: "12%",
          width: "100%",
        }}
      >
        <Heading
          size="lg"
          zIndex={3}
          variant="italic"
          textTransform="uppercase"
          textAlign="center"
        >
          {t(`specials.${specialId}.name`)}
        </Heading>
        <Heading
          size="md"
          zIndex={3}
          variant="italic"
          textTransform="uppercase"
          textAlign="center"
        >
          - {t("activated")} -
        </Heading>
      </animated.div>

      {showAnimContent && (
        <animated.div
          style={{
            ...fadeWrapperProps,
            zIndex: 3,
            position: "absolute",
            height: "100%",
            width: "100%",
          }}
        >
          {animation ? (
            <animated.div
              style={{
                ...bgProps,
                zIndex: 3,
                position: "absolute",
                height: "100%",
                width: "100%",
              }}
            >
              {animation}
            </animated.div>
          ) : (
            <>
              <animated.img
                src={bgPath}
                style={{
                  height: "60%",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                  ...bgProps,
                }}
              />
              <animated.img
                src={animatedImgPath}
                style={{
                  height: "70%",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                  ...animProps,
                }}
              />
            </>
          )}
        </animated.div>
      )}
    </animated.div>
  );
};
