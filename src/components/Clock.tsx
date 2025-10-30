import { Flex, Text } from "@chakra-ui/react";
import { Icons } from "../constants/icons";
import { IconComponent } from "./IconComponent";
import { Countdown } from "./Countdown";

interface ClockProps {
  date: Date;
}

export const Clock = ({ date }: ClockProps) => {
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
      <IconComponent icon={Icons.CLOCK} width={"12px"} height={"12px"} />
      <Countdown targetDate={date}>
        {({ formatted }) => <Text mt={0.5}>{formatted}</Text>}
      </Countdown>
    </Flex>
  );
};
