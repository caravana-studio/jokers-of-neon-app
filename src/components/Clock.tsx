import { Flex, Text } from "@chakra-ui/react";
import { Icons } from "../constants/icons";
import { IconComponent } from "./IconComponent";
import { Countdown } from "./Countdown";

interface ClockProps {
  date: Date;
  fontSize?: number;
  iconSize?: string;
}

export const Clock = ({ date, fontSize, iconSize = "12px"}: ClockProps) => {
  return (
    <Flex
      gap={1}
      borderRadius={"full"}
      border="1px solid white"
      px={1.5}
      pb={0.5}
      alignItems={"center"}
      justifyContent={"center"}
      zIndex={10}
    >
      <IconComponent icon={Icons.CLOCK} width={iconSize} height={iconSize} />
      <Countdown targetDate={date}>
        {({ formatted }) => <Text mt={0.5} fontSize={fontSize}>{formatted}</Text>}
      </Countdown>
    </Flex>
  );
};
