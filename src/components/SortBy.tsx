import { Flex, Heading, Tooltip } from "@chakra-ui/react";
import { faHashtag, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isMobile } from "react-device-detect";
import { SortBy as SortByEnum } from "../enums/sortBy.ts";
import { useGameContext } from "../providers/GameProvider";

export const SortBy = () => {
  const { sortBy, toggleSortBy } = useGameContext();

  return (
    <Flex
      backgroundColor="rgba(0,0,0,0.7)"
      p={2}
      flexDirection={isMobile ? "row" : "column"}
      alignItems="center"
      gap={2}
      mb={{ base: 0, md: 2 }}
    >
      <Heading size="s" mr='2'>sort by</Heading>
      <Flex gap={4} alignItems="center">
        <Tooltip hasArrow label="Suit" placement="bottom">
          <FontAwesomeIcon
            opacity={sortBy === SortByEnum.SUIT ? 1 : 0.3}
            cursor={sortBy === SortByEnum.SUIT ? "unset" : "pointer"}
            fontSize={isMobile ? 18 : 25}
            icon={faHeart}
            onClick={() => {
              toggleSortBy();
            }}
          />
        </Tooltip>
        <Tooltip hasArrow label="Rank" placement="bottom">
          <FontAwesomeIcon
            opacity={sortBy === SortByEnum.SUIT ? 0.3 : 1}
            cursor={sortBy === SortByEnum.SUIT ? "pointer" : "unset"}
            fontSize={isMobile ? 18 : 25}
            icon={faHashtag}
            onClick={() => {
              toggleSortBy();
            }}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};
