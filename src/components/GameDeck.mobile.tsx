import { Button, Text, Tooltip } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const GameDeckMobile = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(false);

  return (
      <Button
        variant={hoveredButton ? "solid" : "defaultOutline"}
        borderRadius={"8px"}
        borderColor = "transparent !important"
        size={"xs"}
        onMouseEnter={() => setHoveredButton(true)}
        onMouseLeave={() => setHoveredButton(false)}
        _hover={{
            borderColor: "white !important"
        }}
        onClick={(e) => {
            e.stopPropagation();
            navigate("/deck");
        }}
        >
          <Text textTransform="initial">Show deck</Text>
        </Button>
  );
};
