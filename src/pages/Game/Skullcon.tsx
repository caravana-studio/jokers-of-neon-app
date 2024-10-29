import { Flex } from "@chakra-ui/react";
import Skull from "../../assets/skull.svg?component";
import { isMobile } from "react-device-detect";

export const SkullIcon = ({ color = "white", used = false }) => {
  return (
    <Flex alignItems="center">
      <Skull width="15px" fill={color} opacity={used ? "50%" : "100%"} />
    </Flex>
  );
};
