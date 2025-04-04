import { Box, Flex } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../providers/StoreProvider";
import theme from "../../../theme/theme";
import { PlaysTable } from "../../Plays/PlaysTable";
import { RerollingAnimation } from "./RerollingAnimation";

const LevelUpTable = () => {
  const { pokerHandItems } = useStore();
  const { white } = theme.colors;
  const { t } = useTranslation(["store"]);
  return (
    <RerollingAnimation>
      <Box className="game-tutorial-step-2" width={"100%"} height={"100%"}>
        <Flex
          justifyContent={isMobile ? "center" : "space-between"}
          sx={{
            position: "relative",
            _before: {
              content: '""',
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: "1px",
              backgroundColor: "white",
              boxShadow:
                "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
            },
          }}
        />
        <Flex
          margin={"0 auto"}
          alignContent={"center"}
          mb={1}
          alignItems="center"
          justifyContent={"center"}
          width={"100%"}
          height={"100%"}
        >
          {pokerHandItems.length > 0 && <PlaysTable inStore />}
        </Flex>
      </Box>
    </RerollingAnimation>
  );
};

export default LevelUpTable;
