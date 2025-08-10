import { Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileBottomBar } from "../components/MobileBottomBar";
import { MobileDecoration } from "../components/MobileDecoration";
import { useLogout } from "../hooks/useLogout";

export const ProfilePage = () => {
  const { t } = useTranslation("game");
  const { handleLogout } = useLogout();
  return (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex
        h="100%"
        w="100%"
        pt="30px"
        flexDir="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading variant={"italic"}>Profile</Heading>
        <Heading sx={{ letterSpacing: "5px", wordSpacing: "5px" }}>
          Coming Soon
        </Heading>
        <MobileBottomBar
          firstButton={{
            label: t("game.game-menu.logout-btn"),
            onClick: handleLogout,
          }}
        />
      </Flex>
    </DelayedLoading>
  );
};
