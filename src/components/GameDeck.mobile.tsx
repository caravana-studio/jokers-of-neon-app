import { Button, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DeckIcon from "../assets/deck.svg?component";
import CachedImage from "./CachedImage";

export const GameDeckMobile = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(false);

  return (
    <Button
      variant={hoveredButton ? "solid" : "defaultOutline"}
      borderRadius={"8px"}
      borderColor="transparent !important"
      size={"xs"}
      paddingInlineStart={0}
      paddingInlineEnd={0}
      onMouseEnter={() => setHoveredButton(true)}
      onMouseLeave={() => setHoveredButton(false)}
      _hover={{
        borderColor: "white !important",
      }}
      onClick={(e) => {
        e.stopPropagation();
        navigate("/deck");
      }}
    >
      <Flex
        p={"8px"}
        alignItems={"center"}
        justifyContent={"space-between"}
        border={"1px"}
        borderColor={"white"}
        borderRadius={"8px"}
      >
        <CachedImage height="15px" src="deck-icon.png" alt="deck-icon" />
      </Flex>
    </Button>
  );
};
