import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { SidebarMenu } from "./BarMenu/SidebarMenu";
import { hiddenBarMenu } from "./BarMenu/BarMenuConfig";

export const Layout = ({ children }: { children: ReactNode }) => {
  const sidebarHidden = hiddenBarMenu();
  return (
    <Flex width={"100%"} height={"100%"}>
      {!sidebarHidden && <SidebarMenu />}
      <Flex zIndex={2} flexGrow={1} height="100%">
        {children}
      </Flex>
    </Flex>
  );
};
