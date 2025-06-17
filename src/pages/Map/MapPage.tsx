import { Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ReactFlowProvider } from "reactflow";
import CachedImage from "../../components/CachedImage";
import { DelayedLoading } from "../../components/DelayedLoading";
import { useRedirectByGameState } from "../../hooks/useRedirectByGameState";
import { MapProvider } from "../../providers/MapProvider";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Legend } from "./Legend";
import { Map } from "./Map";

export const MapPage = () => {
  const { t } = useTranslation("intermediate-screens", { keyPrefix: "map" });
  const { level } = useGameStore();
  const { isSmallScreen } = useResponsiveValues();

  useRedirectByGameState();
  return (
    <DelayedLoading ms={600}>
      <Flex
        height="100%"
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <ReactFlowProvider>
          <MapProvider>
            <Map />
          </MapProvider>
        </ReactFlowProvider>
      </Flex>
      <Flex
        position="absolute"
        top={{ base: "12px", sm: "27px" }}
        right={"0px"}
        zIndex={1000}
      >
        <CachedImage
          src="/borders/level.png"
          height={{ base: "40px", sm: "70px" }}
        />
        <Flex
          position={"absolute"}
          right={{ base: "7px", sm: "30px" }}
          display={"flex"}
          alignItems={"center"}
          zIndex={1001}
          height={{ base: "30px", sm: "55px" }}
          gap={{ base: 3.5, sm: 7 }}
        >
          <Heading color="lightBlue" fontSize={{ base: "12px", sm: "22px" }}>
            {t("level")}
          </Heading>
          <Flex w={{ base: "40px", sm: "50px" }}>
            <Heading
              textAlign="center"
              w="100%"
              fontSize={{ base: "12px", sm: "22px" }}
            >
              {level}
            </Heading>
          </Flex>
        </Flex>
      </Flex>
      {!isSmallScreen && (
        <Flex position="absolute" bottom="65px" right="15px" zIndex={10}>
          <Legend />
        </Flex>
      )}
    </DelayedLoading>
  );
};
