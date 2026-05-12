import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { BottomMenu } from "../components/Menu/BottomMenu";
import { MapProvider } from "../providers/MapProvider";
import { StoreProvider } from "../providers/StoreProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { isNative, nativePaddingTop } from "../utils/capacitorUtils";

export const MiniAppLayout = ({ children }: { children: ReactNode }) => {
  const { isSmallScreen } = useResponsiveValues();
  const location = useLocation();
  const shouldHideNavigation = location.pathname === "/login";

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
          {!shouldHideNavigation && isSmallScreen && <BottomMenu />}
        </StoreProvider>
      </MapProvider>
    </ReactFlowProvider>
  );
};
