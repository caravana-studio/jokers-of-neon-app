import { Button, Tooltip } from "@chakra-ui/react";
import { CashSymbol } from "../../../components/CashSymbol";

interface RerollButtonProps {
    rerolled: boolean;
    locked: boolean;
    notEnoughCash: boolean;
    rerollCost: number;
    setRerolled: (value: boolean) => void;
    isSmallScreen: boolean;
    reroll: () => Promise<boolean>;
  }
  
  const RerollButton: React.FC<RerollButtonProps> = ({
    rerolled,
    locked,
    notEnoughCash,
    rerollCost,
    setRerolled,
    isSmallScreen,
    reroll,
  }) => (
    <Tooltip
      placement="right"
      label={rerolled ? "Available only once per level" : "Update available items"}
    >
      <Button
        className="game-tutorial-step-6"
        fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
        w={isSmallScreen ? "unset" : ["unset", "unset", "unset", "100%", "100%"]}
        isDisabled={rerolled || locked || notEnoughCash}
        onClick={async () => {
          const response = await reroll();
          if (response) {
            setRerolled(true);
          }
        }}
      >
        REROLL {rerollCost}
        <CashSymbol />
      </Button>
    </Tooltip>
  );
  
  export default RerollButton; 
  