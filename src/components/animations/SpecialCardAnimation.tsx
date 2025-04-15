import { Flex, Heading } from "@chakra-ui/react";
import { animated, easings, useSpring } from "@react-spring/web";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCardAnimations } from "../../providers/CardAnimationsProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";

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

  useEffect(() => {
    setTimeout(() => {
      navigate("/redirect/store");
      setAnimateSecondChanceCard(false);
    }, 3000);
  }, []);

  const bgProps = useSpring({
    from: { scale: 0.6, opacity: 0 },
    to: { scale: 0.8, opacity: 1 },
    config: {
      duration: 1500,
      easing: easings.easeOutCubic,
    },
  });

  const headingProps = useSpring({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    delay: 1000,
    config: {
      duration: 2000,
      easing: easings.easeOutCubic,
    },
  });

  const animProps = useSpring({
    from: { scale: 0.2, opacity: 0 },
    to: { scale: 1.2, opacity: 1 },
    config: {
      duration: 3500,
      easing: easings.easeOutCubic,
    },
  });

  return (
    <Flex
      position={"absolute"}
      top={0}
      left={0}
      width={"100%"}
      height={"100%"}
      zIndex={1000}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      backdropFilter="blur(5px)"
      backgroundColor="rgba(0, 0, 0, 0.5)"
      gap={6}
    >
      <animated.div
        style={{
          ...headingProps,
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

      {animation ? (
        animation
      ) : (
        <>
          <animated.img
            src={bgPath}
            style={{
              height: "60%",
              position: "absolute",
              zIndex: 1,
              ...bgProps,
            }}
          />
          <animated.img
            src={animatedImgPath}
            style={{
              height: "70%",
              position: "absolute",
              zIndex: 2,
              ...animProps,
            }}
          />
        </>
      )}
    </Flex>
  );
};
