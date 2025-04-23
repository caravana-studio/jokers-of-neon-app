import { Flex } from "@chakra-ui/react";
import { ReactFlowProvider } from "reactflow";
import { DelayedLoading } from "../../components/DelayedLoading";
import { Map } from "./Map";

export const MapPage = () => {
  return (
    <DelayedLoading ms={600}>
      <Flex
        height="100%"
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <ReactFlowProvider>
          <Map />
        </ReactFlowProvider>
      </Flex>
    </DelayedLoading>
  );
};
