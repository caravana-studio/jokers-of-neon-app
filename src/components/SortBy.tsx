import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { SortBy as SortByEnum } from "../enums/sortBy.ts";
import { useGameContext } from "../providers/GameProvider";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import CachedImage from "./CachedImage.tsx";
import { CardContainerSwitcher } from "./CardContainerWithBorder.tsx";

export const SortBy = () => {
  const { sortBy } = useGameContext();
  const { t } = useTranslation(["game"]);

  return (
    <SortByContainer>
      <Tooltip
        label={t("game.hand-section.sort-by.tooltip.suit")}
        placement="bottom"
        size="sm"
      >
        <CachedImage
          cursor="pointer"
          src={`sort/heart-${sortBy === SortByEnum.SUIT ? "on" : "off"}.png`}
          height={{ base: 5, sm: 8 }}
        />
      </Tooltip>
      <Tooltip
        label={t("game.hand-section.sort-by.tooltip.rank")}
        placement="bottom"
        size="sm"
      >
        <CachedImage
          cursor="pointer"
          src={`sort/rank-${sortBy === SortByEnum.SUIT ? "off" : "on"}.png`}
          height={{ base: 5, sm: 8 }}
        />
      </Tooltip>
    </SortByContainer>
  );
};

const SortByContainer = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation(["game"]);

  const { toggleSortBy } = useGameContext();

  const { isSmallScreen } = useResponsiveValues();
  return isSmallScreen ? (
    <CardContainerSwitcher onClick={toggleSortBy}>
      {children}
    </CardContainerSwitcher>
  ) : (
    <Flex
      flexDirection={isSmallScreen ? "row" : "column"}
      alignItems="center"
      gap={0.5}
    >
      <Text size="m" pl={{ base: 1, sm: 0 }}>
        {t("game.hand-section.sort-by.sort-by-title")}
      </Text>
      <Flex
        gap={0.5}
        alignItems="center"
        justifyContent="center"
        border={isSmallScreen ? "none" : "1px solid white"}
        borderRadius="8px"
        minWidth={{ base: "50px", sm: "70px" }}
        p={{ base: "5px 5px", sm: "8px 5px" }}
        cursor={"pointer"}
        onClick={() => {
          toggleSortBy();
        }}
      >
        {children}
      </Flex>
    </Flex>
  );
};
