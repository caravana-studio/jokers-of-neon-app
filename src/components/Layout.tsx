import { Capacitor } from "@capacitor/core";
import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";
import { MapProvider } from "../providers/MapProvider";
import { StoreProvider } from "../providers/StoreProvider";
import { hiddenBarMenu } from "./Menu/BarMenu/BarMenuConfig";
import { SidebarMenu } from "./Menu/BarMenu/SidebarMenu";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { BottomMenu } from "./Menu/BottomMenu";
import { needsPadding } from "../utils/capacitorUtils";

export const Layout = ({ children }: { children: ReactNode }) => {
  const sidebarHidden = hiddenBarMenu();
  const { isSmallScreen } = useResponsiveValues();
  return (
    <ReactFlowProvider>
      <MapProvider>
        <StoreProvider>
          <Flex
            width={"100%"}
            height={"100%"}
            pt={needsPadding ? "50px" : "0px"}
            pb={needsPadding ? "80px" : "50px"}
            flexDirection={"column"}
          >
            {!sidebarHidden && <SidebarMenu />}
            <Flex zIndex={2} flexGrow={1} flexShrink={1} minH={0}>
              {children}
            </Flex>
          </Flex>
            {isSmallScreen && <BottomMenu />}
        </StoreProvider>
      </MapProvider>
    </ReactFlowProvider>
  );
};
