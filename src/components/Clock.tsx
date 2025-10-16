import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Icons } from "../constants/icons";
import { IconComponent } from "./IconComponent";

interface ClockProps {
  date: Date;
}

export const Clock = ({ date }: ClockProps) => {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = Math.max(date.getTime() - now.getTime(), 0);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeString(
        `${days !== 0 ? `${days}d ` : ""}${hours}h ${days !== 0 ? "" : `${minutes}m`}`
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [date]);

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
      <Text mt={0.5}>{timeString}</Text>
    </Flex>
  );
};
