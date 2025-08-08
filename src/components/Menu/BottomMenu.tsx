import { Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { Icons } from "../../constants/icons";
import { BottomMenuItem } from "./BottomMenuItem";

export const BottomMenu = () => {
  const location = useLocation();
  const page = location.pathname;
  return (
    <Flex
      h="50px"
      w="100%"
      backgroundColor="black"
      alignItems="center"
      zIndex={1000}
    >
      <BottomMenuItem icon={Icons.HOME} url="/" active={page === "/"} />
      <BottomMenuItem icon={Icons.DOCS} url="/my-collection" active={page === "/my-collection"} />
      <BottomMenuItem
        icon={Icons.JOKER}
        url="/my-games"
        active={page === "/my-games"}
      />

      <BottomMenuItem
        icon={Icons.PROFILE}
        url="/profile"
        active={page === "/profile"}
      />
      <BottomMenuItem
        icon={Icons.SETTINGS}
        url="/settings"
        active={page === "/settings"}
      />
    </Flex>
  );
};
