import { Box } from "@chakra-ui/react";

interface BrokenCardProps {
  onDeck: boolean;
  isPack: boolean;
}

export const BrokenCard: React.FC<BrokenCardProps> = ({ onDeck, isPack }) => {
  return (
    <>
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        backgroundColor={onDeck ? "" : "rgba(0,0,0,0.3)"}
        backgroundImage={'url("/broken.png")'}
        backgroundSize="cover"
        borderRadius={isPack ? {} : { base: "5px", sm: "8px" }}
        pointerEvents="none"
      />
    </>
  );
};
