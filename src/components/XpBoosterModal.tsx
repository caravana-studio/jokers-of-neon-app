import {
  Flex,
  Heading,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Trans, useTranslation } from "react-i18next";
import { useSeason } from "../queries/useSeason";
import { VIOLET_LIGHT } from "../theme/colors";
import { Clock } from "./Clock";

const coinPulse = keyframes`
  0% {
    transform: scale(1.5) rotate(0deg);
  }
  50% {
    transform: scale(1.6) rotate(3deg);
  }
  100% {
    transform: scale(1.5) rotate(0deg);
  }
`;
const coinPulseBack = keyframes`
  0% {
    transform: scale(1.3) rotate(0deg);
  }
  50% {
    transform: scale(1.4) rotate(-3deg);
  }
  100% {
    transform: scale(1.3) rotate(0deg);
  }
`;

interface XpBoosterProps {
  fullScreen?: boolean;
  finishDate: Date;
}

export const XpBoosterModal = () => {
  const [open, setOpen] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const { season } = useSeason();

  const xpEvent = season?.xpEvent;
  const eventStart = xpEvent?.startDate;
  const eventFinish = xpEvent?.finishDate;

  const isWithinWindow =
    !!eventStart &&
    !!eventFinish &&
    now >= eventStart.getTime() &&
    now < eventFinish.getTime();

  const isOpen = open && isWithinWindow;

  useEffect(() => {
    if (!eventStart || !eventFinish) return;

    const interval = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(interval);
  }, [eventFinish, eventStart]);

  if (!eventFinish || !eventStart) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      size="4xl"
      trapFocus={false}
      autoFocus={false}
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
      <ModalContent p={3} overflow="visible">
        <ModalCloseButton m={4} />
        <XpBooster finishDate={eventFinish} />
      </ModalContent>
    </Modal>
  );
};

export const XpBooster = ({
  fullScreen = false,
  finishDate,
}: XpBoosterProps) => {
  const { t } = useTranslation(["home"]);

  return (
    <Flex
      flexDir={"column"}
      px={4}
      alignItems={"center"}
      background="url(/shop/season-pass/bg.jpg)"
      backgroundSize="cover"
      backgroundPosition="center"
      height={fullScreen ? "100%" : isMobile ? "400px" : "500px"}
      width={"100%"}
      justifyContent="center"
      overflow="hidden"
      position={fullScreen ? "relative" : undefined}
    >
      <Flex
        position="absolute"
        top={isMobile ? "20%" : 0}
        left={fullScreen ? "50%" : undefined}
        transform={fullScreen ? "translateX(-50%)" : undefined}
        w={fullScreen ? (isMobile ? "100%" : "60%") : isMobile ? "120%" : "60%"}
        maxW={fullScreen ? (isMobile ? "520px" : "900px") : undefined}
        pointerEvents={fullScreen ? "none" : undefined}
      >
        <Image
          src="/shop/season-pass/coins-front.png"
          position="absolute"
          animation={`${coinPulse} 4s ease-in-out infinite`}
          transformOrigin="center"
          zIndex={2}
          w={fullScreen ? "100%" : undefined}
          h={fullScreen ? "auto" : undefined}
        />
        <Image
          src="/shop/season-pass/coins-back.png"
          zIndex={0}
          opacity={0.6}
          position="absolute"
          animation={`${coinPulseBack} 4s ease-in-out infinite`}
          transformOrigin="center"
          w={fullScreen ? "100%" : undefined}
          h={fullScreen ? "auto" : undefined}
        />
      </Flex>
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        gap={1}
      >
        <Heading
          color="lightViolet"
          variant={"italic"}
          fontSize={isMobile ? 27 : 60}
          lineHeight={1}
          textShadow={`0 0 ${isMobile ? "3px" : "7px"} ${VIOLET_LIGHT}`}
        >
          {t("home.xpBooster.title")}
        </Heading>
        <Text
          textTransform={"uppercase"}
          fontSize={isMobile ? 13 : 22}
          lineHeight={1.1}
          textAlign={"center"}
        >
          {t("home.xpBooster.subtitle")}
        </Text>
      </Flex>
      <Flex
        w="100%"
        justifyContent="center"
        alignItems="center"
        my={isMobile ? 4 : 7}
      >
        <Flex
          w={isMobile ? "80%" : "50%"}
          flexDir={"column"}
          gap={isMobile ? 3 : 4}
        >
          <Flex flexDir={"column"} gap={2}>
            <Text
              fontSize={isMobile ? 15 : 23}
              lineHeight={1.2}
              textAlign={"center"}
            >
              <Trans
                ns="home"
                i18nKey="home.xpBooster.headline"
                components={{
                  xp: (
                    <span
                      style={{
                        color: VIOLET_LIGHT,
                        fontWeight: "500",
                        textShadow: `0 0 5px ${VIOLET_LIGHT}`,
                      }}
                    />
                  ),
                  double: (
                    <span
                      style={{
                        color: VIOLET_LIGHT,
                        fontWeight: "500",
                        textShadow: `0 0 5px ${VIOLET_LIGHT}`,
                      }}
                    />
                  ),
                }}
              />
            </Text>
          </Flex>
          <Text
            fontSize={isMobile ? 15 : 23}
            lineHeight={1.2}
            textAlign={"center"}
          >
            {t("home.xpBooster.countdownLabel")}
          </Text>
        </Flex>
      </Flex>
      <Clock
        date={finishDate}
        iconSize={isMobile ? "10px" : "20px"}
        fontSize={isMobile ? 10 : 20}
      />
    </Flex>
  );
};
