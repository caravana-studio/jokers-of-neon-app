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
      py={[0, 2, 2, 2, 4]}
      width={"100%"}
      height={"80%"}
      margin={"0 auto"}
      bg="rgba(0, 0, 0, 0.6)"
      borderRadius="25px"
      mt={8}
      p={6}
      boxShadow={`0px 0px 10px 1px ${white}`}
    >
      {pokerHandItems.length > 0 && <PlaysTable inStore />}
    </Box>
  );
};

export default LevelUpTable;
