import { Button } from "@chakra-ui/react";
import { Card } from "../../../types/Card";

interface SpecialsButtonProps {
    specialCards: Card[];
    setSpecialCardsModalOpen: (value: boolean) => void;
    isSmallScreen: boolean;
  }
  
const SpecialsButton: React.FC<SpecialsButtonProps> = ({ specialCards, setSpecialCardsModalOpen, isSmallScreen }) => (
    specialCards.length > 0 && (
      <Button
        fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
        w={isSmallScreen ? "unset" : ["unset", "unset", "unset", "100%", "100%"]}
        onClick={() => {
          setSpecialCardsModalOpen(true);
        }}
      >
        SEE MY { isSmallScreen && <br />} SPECIAL CARDS
      </Button>
    )
  );

  export default SpecialsButton; 