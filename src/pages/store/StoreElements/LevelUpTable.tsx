import { Box } from "@chakra-ui/react";
import { useStore } from "../../../providers/StoreProvider";
import { PlaysTable } from "../../Plays/PlaysTable";

const LevelUpTable = () => {
  const { pokerHandItems } = useStore();
  return (
    <Box className="game-tutorial-step-2" py={[0, 2, 2, 2, 4]} width={"100%"}>
      {pokerHandItems.length > 0 && <PlaysTable inStore />}
    </Box>
  );
};

export default LevelUpTable;
