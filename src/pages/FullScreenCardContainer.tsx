import { Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps";

export const FullScreenCardContainer = ({ children }: PropsWithChildren) => {
  return (
    <Flex
      sx={{
        // maxWidth: `${CARD_WIDTH * 5}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        minHeight: `${CARD_HEIGHT * 2 + 80}px`,
      }}
      gap={3}
    >
      {children}
    </Flex>
  );
};
