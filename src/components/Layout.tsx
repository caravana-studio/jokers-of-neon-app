import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { SidebarMenu } from "./Menu/BarMenu/SidebarMenu";
import { hiddenBarMenu } from "./Menu/BarMenu/BarMenuConfig";
import { MapProvider } from "../providers/MapProvider";
import { ReactFlowProvider } from "reactflow";
import { StoreProvider } from "../providers/StoreProvider";

export const Layout = ({ children }: { children: ReactNode }) => {
  const sidebarHidden = hiddenBarMenu();
  return (
    <ReactFlowProvider>
      <MapProvider>
        <StoreProvider>
          <Flex width={"100%"} height={"100%"}>
            {!sidebarHidden && <SidebarMenu />}
            <Flex zIndex={2} flexGrow={1} height="100%">
              {children}
            </Flex>
          </Flex>
        </StoreProvider>
      </MapProvider>
    </ReactFlowProvider>
  );
};
