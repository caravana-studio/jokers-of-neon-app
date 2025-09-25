import { Flex } from "@chakra-ui/react";
import CompactRoundData from "../../components/CompactRoundData/CompactRoundData.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";

interface TopSectionMobileProps {
  onTutorialCardClick?: () => void;
}

export const MobileTopSection = ({
  onTutorialCardClick,
}: TopSectionMobileProps) => {
  return (
    <>
      <CompactRoundData />
      <Flex
        width={["95%", "80%"]}
        sx={{ margin: "0 auto" }}
        mx={2}
        justifyContent="center"
      >
        <SpecialCards onTutorialCardClick={onTutorialCardClick} />
      </Flex>
    </>
  );
};
