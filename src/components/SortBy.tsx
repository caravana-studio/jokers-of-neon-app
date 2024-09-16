import { Flex, Img, Text, Tooltip } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { SortBy as SortByEnum } from "../enums/sortBy.ts";
import { useGameContext } from "../providers/GameProvider";

export const SortBy = () => {
  const { sortBy, toggleSortBy } = useGameContext();

  return (
    <Flex
      flexDirection={isMobile ? "row" : "column"}
      alignItems="center"
      gap={0.5}
    >
      <Text size="m" pl={{ base: 1, sm: 0 }}>
        Sort by
      </Text>
      <Flex
        gap={1}
        alignItems="center"
        justifyContent="center"
        border={isMobile ? "none" : "1px solid white"}
        borderRadius="8px"
        minWidth={{ base: "50px", sm: "100px" }}
        p={{ base: "5px 5px", sm: "8px 10px" }}
      >
        <Tooltip label="Suit" placement="bottom" size="sm">
          <Img
            cursor="pointer"
            src={`sort/heart-${sortBy === SortByEnum.SUIT ? "on" : "off"}.png`}
            height={{base: 5, sm: 9}}
            onClick={() => {
              toggleSortBy();
            }}
          />
        </Tooltip>
        <Tooltip label="Rank" placement="bottom" size="sm">
          <Img
            cursor="pointer"
            src={`sort/rank-${sortBy === SortByEnum.SUIT ? "off" : "on"}.png`}
            height={{base: 5, sm: 9}}
            onClick={() => {
              toggleSortBy();
            }}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};
