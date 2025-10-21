import { Flex } from "@chakra-ui/react";
import { useGameStore } from "../state/useGameStore";
import CachedImage from "./CachedImage";

interface MobileDecorationProps {
  fadeToBlack?: boolean;
  top?: string | number;
  bottom?: string | number;
}

export const MobileDecoration = ({
  top = 1,
  bottom = 1,
  fadeToBlack = false,
}: MobileDecorationProps) => {
  const { isRageRound } = useGameStore();
  return (
    <>
      {fadeToBlack && (
        <Flex
          position="absolute"
          bottom={0}
          w="100%"
          height={{ base: "90px", sm: "150px" }}
          background="linear-gradient(to top, 
    black 0%, 
    black 40%, 
    transparent 100%);"
          zIndex={5}
          pointerEvents="none"
        />
      )}
      {fadeToBlack && (
        <Flex
          position="absolute"
          top={0}
          w="100%"
          height={{ base: "60px", sm: "150px" }}
          background="linear-gradient(to bottom, 
    black 0%, 
    black 40%, 
    transparent 100%);"
          zIndex={1}
          pointerEvents="none"
        />
      )}
      <CachedImage
        src={`/borders/top${isRageRound ? "-rage" : ""}.png`}
        width="100%"
        maxHeight="70px"
        position="fixed"
        top={top}
        zIndex={2}
      />
      <CachedImage
        src={`/borders/bottom${isRageRound ? "-rage" : ""}.png`}
        width="100%"
        maxHeight="70px"
        position="fixed"
        bottom={bottom}
        zIndex={6}
      />
    </>
  );
};
