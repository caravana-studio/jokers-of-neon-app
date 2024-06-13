import { Flex, Heading, Tooltip } from "@chakra-ui/react";
import { faHashtag, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { SORT_BY_SUIT } from "../constants/localStorage";

export const SortBy = () => {
  const [sortBySuit, setSortBySuit] = useState(
    !!localStorage.getItem(SORT_BY_SUIT)
  );

  return (
    <Flex
      backgroundColor="rgba(0,0,0,0.7)"
      p={2}
      flexDirection="column"
      alignItems="center"
      gap={2}
      mb={2}
    >
      <Heading size="s">sort by</Heading>
      <Flex gap={4} alignItems="center">
        <Tooltip hasArrow label="Suit" placement="bottom">
          <FontAwesomeIcon
            opacity={sortBySuit ? 1 : 0.3}
            cursor={!sortBySuit ? "pointer" : "unset"}
            fontSize={25}
            icon={faHeart}
            onClick={() => {
              localStorage.setItem(SORT_BY_SUIT, "true");
              setSortBySuit(true);
            }}
          />
        </Tooltip>
        <Tooltip hasArrow label="Value" placement="bottom">
          <FontAwesomeIcon
            opacity={!sortBySuit ? 1 : 0.3}
            cursor={sortBySuit ? "pointer" : "unset"}
            fontSize={25}
            icon={faHashtag}
            onClick={() => {
              localStorage.removeItem(SORT_BY_SUIT);
              setSortBySuit(false);
            }}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};
