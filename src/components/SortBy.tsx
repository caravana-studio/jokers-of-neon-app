import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { faHashtag, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isMobile } from "react-device-detect";
import { SortBy as SortByEnum } from "../enums/sortBy.ts";
import { useGameContext } from "../providers/GameProvider";

export const SortBy = () => {
  const { sortBy, toggleSortBy } = useGameContext();

  return (
    <Flex
      // p={{ base: 0.5, sm: 1 }}
      flexDirection={isMobile ? "row" : "column"}
      alignItems="center"
      gap={0.5}
    >
      <Text
        size="m"
        pl={{ base: 1, sm: 0 }}
      >
        Sort by
      </Text>
      <Flex
        gap={3}
        alignItems="center"
        justifyContent="center"
        border={isMobile ? "none" : "1px solid white"}
        borderRadius="8px"
        minWidth={{base: '50px', sm: '100px'}}
        p={{ base: "5px 5px", sm: "15px 10px" }}
      >
        <Tooltip hasArrow label="Suit" placement="bottom">
          <FontAwesomeIcon
            opacity={sortBy === SortByEnum.SUIT ? 1 : 0.3}
            cursor={sortBy === SortByEnum.SUIT ? "unset" : "pointer"}
            fontSize={isMobile ? 18 : 20}
            icon={faHeart}
            color="white"
            onClick={() => {
              toggleSortBy();
            }}
          />
        </Tooltip>
        <Tooltip hasArrow label="Rank" placement="bottom">
          <FontAwesomeIcon
            opacity={sortBy === SortByEnum.SUIT ? 0.3 : 1}
            cursor={sortBy === SortByEnum.SUIT ? "pointer" : "unset"}
            fontSize={isMobile ? 18 : 20}
            icon={faHashtag}
            color="white"
            onClick={() => {
              toggleSortBy();
            }}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};
