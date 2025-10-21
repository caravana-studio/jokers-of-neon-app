import { Box, Flex, Heading } from "@chakra-ui/react";
import { Clock } from "../../components/Clock";
import { SeasonPassBuyButton } from "../../components/SeasonPass/SeasonPassBuyButton";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { SeasonPassUnlocked } from "../../components/SeasonPass/SeasonPassUnlocked";
import { useTranslation } from "react-i18next";
import { STEP_HEIGHT } from "./Step";

const SEASON_PASS_UNLOCKED = false;

export const SeasonProgressionHeader = () => {
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "season-progression",
  });
  return (
    <Flex
      w="100%"
      position="fixed"
      top={0}
      zIndex={1}
      h={`${STEP_HEIGHT}px`}
      borderBottom={`1px solid ${BLUE}`}
      pt={isSmallScreen ? "25px" : "70px"}
      px={isSmallScreen ? "15px" : "30px"}
      pb={3}
      gap={2}
      bgColor="rgba(0,0,0,0.4)"
    >
      <Flex
        w="50%"
        flexWrap="nowrap"
        overflowX="visible"
        gap={2}
        position="relative"
        justifyContent={"center"}
        alignItems="flex-end"
      >
        <Flex
          position="absolute"
          w={isSmallScreen ? "190px" : "500px"}
          flexWrap={"wrap"}
          gap={1}
          top={0}
          left={0}
        >
          <Heading
            fontSize={isSmallScreen ? "sm" : "lg"}
            variant="italic"
            textOverflow={"initial"}
            whiteSpace={"nowrap"}
            wordBreak={"keep-all"}
          >
            {t("season", { season: 1 })}
          </Heading>
          <Box ml={1}>
            <Clock date={new Date()} />
          </Box>
        </Flex>
        <Heading mb={3} fontWeight={100} fontSize={isSmallScreen ?11 : 18}>
          {t("free-rewards")}
        </Heading>
      </Flex>
      <Flex
        w="50%"
        justifyContent={"center"}
        alignItems="flex-end"
        flexDir={"column"}
      >
        {SEASON_PASS_UNLOCKED ? (
          <SeasonPassUnlocked />
        ) : (
          <SeasonPassBuyButton />
        )}
      </Flex>
    </Flex>
  );
};
