import { Button, Flex } from "@chakra-ui/react";
import { Background } from "../../components/Background";
import { PositionedGameMenu } from "../../components/GameMenu";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { ManagePageContent } from "./ManagePageContent";
import { ManagePageContentMobile } from "./ManagePageContent.mobile";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const ManagePage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "power-ups",
  });

  return (
    <Background bgDecoration dark type="home">
      <PositionedGameMenu decoratedPage />
      <Flex
        flexDirection={"column"}
        height={"100%"}
        gap={4}
        alignItems={"center"}
      >
        {isSmallScreen ? <ManagePageContentMobile /> : <ManagePageContent />}
        <Flex
          flexDirection={"row"}
          justifyContent="space-between"
          gap={4}
          mx={4}
          my={4}
        >
          <Button
            fontSize={12}
            onClick={() => {
              navigate(-1);
            }}
            width={"unset"}
          >
            {t("go-back")}
          </Button>
        </Flex>
      </Flex>
    </Background>
  );
};
