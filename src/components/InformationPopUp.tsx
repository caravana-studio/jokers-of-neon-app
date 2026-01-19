import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { BLUE } from "../theme/colors";

interface InformationPopUpProps {
  content: ReactNode;
  onClose: () => void;
  unstyled?: boolean;
}

export const InformationPopUp = ({
  content,
  onClose,
  unstyled = false,
}: InformationPopUpProps) => {
  const contentBox = unstyled ? (
    <Box onClick={(e) => e.stopPropagation()}>{content}</Box>
  ) : (
    <Box
      maxW="720px"
      w="90%"
      maxH="90vh"
      bg="rgba(0, 0, 0, 0.85)"
      border="1px solid"
      borderColor={BLUE}
      borderRadius="16px"
      boxShadow="0 0 20px white, inset 0 0 10px white"
      p={{ base: 5, md: 8 }}
      overflowY="auto"
      onClick={(e) => e.stopPropagation()}
    >
      {content}
    </Box>
  );

  return (
    <Flex
      position={"absolute"}
      top={0}
      left={0}
      width={"100%"}
      height={"100%"}
      zIndex={1100}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      backdropFilter="blur(5px)"
      backgroundColor=" rgba(0, 0, 0, 0.5)"
      gap={6}
      onClick={() => {
        onClose();
      }}
    >
      {contentBox}
    </Flex>
  );
};
