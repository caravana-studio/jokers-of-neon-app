import { Box } from "@chakra-ui/react";

interface BrokenCardProps {
  onDeck: boolean;
  isPack: boolean;
  isSpecial?: boolean;
}

export const BrokenCard: React.FC<BrokenCardProps> = ({ onDeck, isPack, isSpecial }) => {
  return (
    <>
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        backgroundColor={onDeck ? "" : isSpecial ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
        backgroundImage={'url("/broken.png")'}
        backgroundSize="cover"
        borderRadius={isPack ? {} : { base: "5%", sm: "8px" }}
        pointerEvents="none"
      />
    </>
  );
};
