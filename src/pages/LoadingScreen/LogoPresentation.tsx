import { Flex, Heading, Image } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { motion } from "framer-motion";
import { SeasonLoadingAssets } from "./useSeasonLoadingAssets";

interface LogoPresentationProps {
  seasonNumber: number;
  assets: SeasonLoadingAssets;
}

export const LogoPresentation: React.FC<LogoPresentationProps> = ({
  seasonNumber,
  assets,
}) => {
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
        src={assets.backgroundSrc}
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
        initial={{ y: "20%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <Image
          src={assets.bossSrc}
          alt="Loading boss"
          width={isMobile ? "100vw" : "56vw"}
          maxWidth="900px"
          maxH="90vh"
          objectFit="contain"
        />
      </motion.div>

      <motion.div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: isMobile ? "18vh" : "20vh",
          zIndex: 4,
          display: "flex",
          justifyContent: "center",
        }}
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 1.05 }}
      >
        <Image
          src="/logos/logo.png"
          alt="Jokers of Neon"
          width={isMobile ? "70vw" : "50vw"}
          maxWidth="520px"
          objectFit="contain"
        />
      </motion.div>

      <motion.div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: isMobile ? "16.8vh" : "18.9vh",
          zIndex: 4,
          display: "flex",
          justifyContent: "center",
        }}
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 1.45 }}
      >
        <Heading variant="italic" size={isMobile ? "sm" : "lg"}>
          SEASON {seasonNumber}
        </Heading>
      </motion.div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3,
        }}
      >
        <Image
          src={assets.bottomSrc}
          alt="Loading foreground"
          width="100%"
          objectFit="cover"
        />
      </div>
    </Flex>
  );
};
