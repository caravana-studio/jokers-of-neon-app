import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";
import { MapProvider } from "../providers/MapProvider";
import { StoreProvider } from "../providers/StoreProvider";
import { nativePaddingTop } from "../utils/capacitorUtils";

export const MiniAppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ReactFlowProvider>
      <MapProvider>
        <StoreProvider>
          <Flex
            width="100%"
            height="100%"
            position="relative"
            pt={nativePaddingTop}
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
        </StoreProvider>
      </MapProvider>
    </ReactFlowProvider>
  );
};
