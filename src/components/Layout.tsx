import { Capacitor } from "@capacitor/core";
import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";
import { MapProvider } from "../providers/MapProvider";
import { StoreProvider } from "../providers/StoreProvider";
import { hiddenBarMenu } from "./Menu/BarMenu/BarMenuConfig";
import { SidebarMenu } from "./Menu/BarMenu/SidebarMenu";

const platform = Capacitor.getPlatform();
const needsPadding = platform === "ios";

export const Layout = ({ children }: { children: ReactNode }) => {
  const sidebarHidden = hiddenBarMenu();
  return (
    <ReactFlowProvider>
      <MapProvider>
        <StoreProvider>
          <Flex
            width={"100%"}
            height={"100%"}
            pt={needsPadding ? "50px" : "0px"}
            pb={needsPadding ? "20px" : "0px"}
          >
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
