import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "../../components/Clock";
import { SeasonPassBuyButton } from "../../components/SeasonPass/SeasonPassBuyButton";
import { SeasonPassUnlocked } from "../../components/SeasonPass/SeasonPassUnlocked";
import { useSeasonNumber } from "../../constants/season";
import { useInformationPopUp } from "../../providers/InformationPopUpProvider";
import { useSeasonPass } from "../../providers/SeasonPassProvider";
import { useSeason } from "../../queries/useSeason";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { STEP_HEIGHT } from "./Step";

interface ISeasonProgressionHeaderProps {
  onSeasonPassPurchased: () => void;
}

export const SeasonProgressionHeader = ({
  onSeasonPassPurchased,
}: ISeasonProgressionHeaderProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "season-progression",
  });
  const { setInformation } = useInformationPopUp();
  const { seasonPassUnlocked } = useSeasonPass();
  const { season } = useSeason();

  const seasonNumber = useSeasonNumber();
  const seasonFinishDate = season?.finishDate;
  const infoContent = useMemo(
    () => (
      <VStack align="start" spacing={4}>
        <Heading size="sm" variant="italic">
          {t("intro.popup-title")}
        </Heading>
        <Divider borderColor={BLUE} />
        <VStack align="start" spacing={3}>
          <Text fontSize={{ base: "sm", md: "md" }}>{t("intro.points.1")}</Text>
          <Text fontSize={{ base: "sm", md: "md" }}>{t("intro.points.2")}</Text>
          <Text fontSize={{ base: "sm", md: "md" }}>{t("intro.points.3")}</Text>
          <Text fontSize={{ base: "sm", md: "md" }}>{t("intro.points.4")}</Text>
        </VStack>
      </VStack>
    ),
    [t]
  );

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
        justifyContent={isSmallScreen ? "space-between" : "center"}
        alignItems={isSmallScreen ? "flex-start" : "flex-end"}
        flexDir={isSmallScreen ? "column" : "row"}
      >
        <Flex
          position={isSmallScreen ? "static" : "absolute"}
          w={isSmallScreen ? "100%" : "500px"}
          flexWrap={"wrap"}
          gap={1}
          top={isSmallScreen ? undefined : 0}
          left={isSmallScreen ? undefined : 0}
        >
          <Heading
            fontSize={isSmallScreen ? "sm" : "lg"}
            variant="italic"
            textOverflow={"initial"}
            whiteSpace={"nowrap"}
            wordBreak={"keep-all"}
          >
            {t("season", { season: seasonNumber })}
          </Heading>
          {seasonFinishDate && (
            <Box ml={1}>
              <Clock date={seasonFinishDate} />
            </Box>
          )}
          <Flex
            w="100%"
            alignItems="baseline"
            gap={1}
            flexWrap="nowrap"
          >
            <Text
              fontSize={isSmallScreen ? "xs" : "sm"}
              color="gray.200"
              lineHeight="short"
              whiteSpace="nowrap"
            >
              {t("intro.summary")}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              display="inline-flex"
              verticalAlign="baseline"
              height="auto"
              minH="unset"
              py={0}
              px={0}
              lineHeight="inherit"
              minW="auto"
              onClick={() => setInformation(infoContent)}
            >
              {t("intro.learn-more")}
            </Button>
          </Flex>
        </Flex>
        <Heading
          mb={isSmallScreen ? 0 : 3}
          fontWeight={100}
          fontSize={isSmallScreen ? 11 : 18}
        >
          {t("free-rewards")}
        </Heading>
      </Flex>
      <Flex
        w="50%"
        justifyContent={"center"}
        alignItems="flex-end"
        flexDir={"column"}
      >
        {seasonPassUnlocked ? (
          <SeasonPassUnlocked />
        ) : (
          <SeasonPassBuyButton
            onSeasonPassPurchased={onSeasonPassPurchased}
          />
        )}
      </Flex>
    </Flex>
  );
};
