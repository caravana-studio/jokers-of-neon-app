import { Flex, Text, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

interface LogoPresentationProps {
  visibleElements?: {
    logo?: boolean;
    text?: boolean;
  };
}

export const LogoPresentation: React.FC<LogoPresentationProps> = ({
  visibleElements = { text: false, logo: false },
}) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "loading-screen",
  });

  const [hasShownLogo, setHasShownLogo] = useState(false);

  useEffect(() => {
    if (visibleElements.logo) {
      setHasShownLogo(true);
    }
  }, [visibleElements.logo]);

  const showBoss = hasShownLogo && !visibleElements.logo;

  return (
    <Flex
      width="100%"
      height="100%"
      position="relative"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
    >
      <Image
        src="/loading-screen/loading-bg.jpg"
        alt="Loading background"
        position="absolute"
        inset={0}
        width="100%"
        height="100%"
        objectFit="cover"
        zIndex={0}
      />

      <motion.div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
        }}
        initial={{ y: "100%" }}
        animate={{ y: showBoss ? "0%" : "100%" }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <Image
          src="/loading-screen/loading-boss.png"
          alt="Loading boss"
          width={isMobile ? "72vw" : "46vw"}
          maxWidth="740px"
          maxH="80vh"
          objectFit="contain"
        />
      </motion.div>

      <motion.div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: isMobile ? "11vh" : "12vh",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: "16px",
        }}
        initial={{ y: "100%", opacity: 0 }}
        animate={{
          y: visibleElements.logo ? "0%" : "100%",
          opacity: visibleElements.logo || visibleElements.text ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Image
          width={isMobile ? "44vw" : "28vw"}
          maxWidth="360px"
          src="/logos/caravana-logo.png"
          alt="Caravana logo"
        />
        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{
            y: visibleElements.text ? 0 : 18,
            opacity: visibleElements.text ? 1 : 0,
          }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Text color="white" fontSize={isMobile ? "1.2rem" : "2.2rem"}>
            {t("presents")}
          </Text>
        </motion.div>
      </motion.div>

      <motion.div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3,
        }}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <Image
          src="/loading-screen/loading-top.png"
          alt="Loading foreground"
          width="100%"
          objectFit="cover"
        />
      </motion.div>
    </Flex>
  );
};
