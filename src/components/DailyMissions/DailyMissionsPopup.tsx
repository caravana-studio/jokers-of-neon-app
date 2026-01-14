import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import { VIOLET } from "../../theme/colors";
import { DailyMissions } from "./DailyMissions";

export const DailyMissionsPopup = () => {
  const { t } = useTranslation(["game"]);

  return (
    <Flex
      position="relative"
      onClick={(e) => e.stopPropagation()}
      flexDirection="column"
    >
      <Box
        width="500px"
        maxHeight="75vh"
        overflowY="auto"
        borderRadius="10px"
        border="2px solid #DAA1E8FF"
        boxShadow={`0px 0px 15px 7px ${VIOLET}`}
        backgroundColor="rgba(0, 0, 0, 0.95)"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        }}
      >
        {/* Header */}
        <Flex
          bg="transparent"
          borderBottom="1px solid white"
          py={3}
          px={4}
          position="sticky"
          top={0}
          zIndex={1}
          backgroundColor="rgba(0, 0, 0, 0.95)"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading
            size="md"
            textAlign="center"
            color="white"
            fontWeight="600"
            letterSpacing="wider"
            flex={1}
          >
            {t("game.game-menu.daily-missions-btn")}
          </Heading>
          <IoMdClose
            size={24}
            color="white"
            cursor="pointer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </Flex>

        {/* Content */}
        <Box px={4} py={4}>
          <DailyMissions showTitle={false} fontSize="14px" />
        </Box>
      </Box>
    </Flex>
  );
};
