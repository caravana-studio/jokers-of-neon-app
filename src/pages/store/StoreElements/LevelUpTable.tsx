import { Box } from "@chakra-ui/react";
import { useStore } from "../../../providers/StoreProvider";
import { PlaysTable } from "../../Plays/PlaysTable";

interface LevelUpTableProps {
  isSmallScreen: boolean;
}

const LevelUpTable: React.FC<LevelUpTableProps> = ({ isSmallScreen }) => {
  const { pokerHandItems } = useStore();
  return (
    <Box
      className="game-tutorial-step-2"
      py={isSmallScreen ? 2 : [2, 2, 2, 2, 4]}
      width={isSmallScreen ? "auto" : "100%"}
    >
      {pokerHandItems.length > 0 && <PlaysTable inStore />}
    </Box>
  );
};

export default LevelUpTable;
