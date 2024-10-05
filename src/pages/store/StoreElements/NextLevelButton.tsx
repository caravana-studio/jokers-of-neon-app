import React from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../types/Card";

interface NextLevelButtonProps {
  setLoading: (value: boolean) => void;
  onShopSkip: () => void;
  skipShop: (gameId: number) => Promise<{ success: boolean; cards: Card[] }>;
  gameId: number;
  setHand: (cards: Card[]) => void;
  locked: boolean;
  isSmallScreen: boolean;
}

const NextLevelButton: React.FC<NextLevelButtonProps> = ({
  setLoading,
  onShopSkip,
  skipShop,
  gameId,
  setHand,
  locked,
  isSmallScreen,
}) => {
  const navigate = useNavigate();

  const handleNextLevelClick = async () => {
    setLoading(true);
    onShopSkip();
    const response = await skipShop(gameId);
    if (response.success) {
      setHand(response.cards);
      navigate("/redirect/demo");
    } else {
      setLoading(false);
    }
  };

  return (
    <Button
      className="game-tutorial-step-7"
      my={isSmallScreen ? 0 : { base: 0, md: 6 }}
      w={isSmallScreen ? "unset" : ["unset", "unset", "unset", "100%", "100%"]}
      onClick={handleNextLevelClick}
      isDisabled={locked}
      lineHeight={1.6}
      variant="secondarySolid"
      fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
    >
      GO TO { isSmallScreen && <br />} NEXT LEVEL
    </Button>
  );
};

export default NextLevelButton;
