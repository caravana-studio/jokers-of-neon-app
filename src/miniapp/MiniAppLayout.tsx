import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { MapProvider } from "../providers/MapProvider";
import { StoreProvider } from "../providers/StoreProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { isNative, nativePaddingTop } from "../utils/capacitorUtils";
import { MiniAppBottomMenu } from "./navigation/MiniAppBottomMenu";

export const MiniAppLayout = ({ children }: { children: ReactNode }) => {
  const { isSmallScreen } = useResponsiveValues();
  const location = useLocation();
  const shouldHideNavigation =
    location.pathname === "/login" ||
    location.pathname === "/terms-and-conditions";

  return (
    <ReactFlowProvider>
      <MapProvider>
        <StoreProvider>
          <Flex
            width="100%"
            height="100%"
            position="relative"
            pt={nativePaddingTop}
            pb={
              shouldHideNavigation
                ? "0px"
                : isNative
                  ? "80px"
                  : isSmallScreen
                    ? "50px"
                    : "0px"
            }
            flexDirection="column"
            flexGrow={1}
            minH={0}
          >
            <Flex
              zIndex={2}
              flexGrow={1}
              flexShrink={1}
              minH={0}
              minW={0}
              height="100%"
              width="100%"
            >
              {children}
            </Flex>
          </Flex>
          {!shouldHideNavigation && isSmallScreen && <MiniAppBottomMenu />}
        </StoreProvider>
      </MapProvider>
    </ReactFlowProvider>
  );
};
