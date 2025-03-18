import { Flex, Heading } from "@chakra-ui/react";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { BarMenuBtn } from "./BarMenuBtn";
import { Icons } from "../../constants/icons";

export const SidebarMenu = () => {
  const { isSmallScreen } = useResponsiveValues();

  // if (isSmallScreen) return null;

  const iconWidth = "50%";

  return (
    <Flex
      position="fixed"
      width={12}
      p={1}
      height="100%"
      flexDirection={"column"}
      justifyContent={"space-around"}
      zIndex={1000}
      left={0}
      top={0}
      backgroundColor={"black"}
    >
      <Flex
        flexDirection={"column"}
        gap={4}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <BarMenuBtn
          icon={Icons.CARTRIDGE}
          description={"Cartridge connector"}
          onClick={() => {}}
          width={iconWidth}
        />
        <BarMenuBtn
          icon={Icons.MAP}
          description={"Map"}
          onClick={() => {}}
          width={iconWidth}
        />
        <BarMenuBtn
          icon={Icons.PODIUM}
          description={"Leaderboard"}
          onClick={() => {}}
          width={iconWidth}
        />
        <BarMenuBtn
          icon={Icons.FILES}
          description={"Files"}
          onClick={() => {}}
          width={iconWidth}
        />
        <BarMenuBtn
          icon={Icons.SETTINGS}
          description={"Settings"}
          onClick={() => {}}
          width={iconWidth}
        />
      </Flex>
      <Flex
        gap={4}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Flex
          flexDirection={"column"}
          py={8}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Heading
            variant="italic"
            mb={4}
            size={"sm"}
            sx={{
              writingMode: "vertical-lr",
              whiteSpace: "nowrap",
              transform: "rotate(-180deg)",
            }}
          >
            REWARDS - GLOBALS
          </Heading>
          <BarMenuBtn
            icon={Icons.CIRCLE}
            description={""}
            onClick={() => {}}
            width={iconWidth}
          />
        </Flex>

        <BarMenuBtn
          icon={Icons.BARS}
          description={"Game menu"}
          onClick={() => {}}
          width={iconWidth}
        />
      </Flex>
    </Flex>
  );
};
