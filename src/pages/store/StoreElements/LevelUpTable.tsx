import { Box, Flex, Heading } from "@chakra-ui/react";
import { useStore } from "../../../providers/StoreProvider";
import { PlaysTable } from "../../Plays/PlaysTable";
import theme from "../../../theme/theme";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";

const LevelUpTable = () => {
  const { pokerHandItems } = useStore();
  const { white } = theme.colors;
  const { t } = useTranslation(["store"]);
  return (
    <Box
      className="game-tutorial-step-2"
      width={"100%"}
      height={"100%"}
      margin={"0 auto"}
      alignContent={"center"}
    >
      {pokerHandItems.length > 0 && <PlaysTable inStore />}
    </Box>
  );
};

export default LevelUpTable;
