import { Button, Flex } from "@chakra-ui/react";

interface StoreTabProps {
  onClickCards?: () => void;
  onClickLootBoxes?: () => void;
  onClickUtilities?: () => void;
}

export const StoreTab = (props: StoreTabProps) => {
  return (
    <Flex
      gap={4}
      p={2}
      backgroundColor={"black"}
      border={"1px 1px 2px 2px"}
      borderRadius={"25px"}
      borderColor={"white"}
    >
      <Button
        fontSize={10}
        variant={"solid"}
        onClick={() => props.onClickCards?.()}
      >
        Cards
      </Button>
      <Button
        fontSize={10}
        variant={"solid"}
        onClick={() => props.onClickLootBoxes?.()}
      >
        Loot Boxes
      </Button>
      <Button
        fontSize={10}
        variant={"solid"}
        onClick={() => props.onClickUtilities?.()}
      >
        Utilities
      </Button>
    </Flex>
  );
};
