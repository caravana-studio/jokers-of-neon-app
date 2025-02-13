import { Button, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { PositionedGameMenu } from "../../components/GameMenu";
import { ManagePageContent } from "./ManagePageContent";
import { ManagePageContentMobile } from "./ManagePageContent.mobile";
import { BackgroundDecoration } from "../../components/Background";

export const ManagePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "power-ups",
  });

  const isSmallMobile = useBreakpointValue({
    base: true,
    sm: false,
  });

  return (
    <BackgroundDecoration>
      <PositionedGameMenu decoratedPage />
      <PositionedDiscordLink />
      <Flex
        flexDirection={"column"}
        height={"100%"}
        gap={4}
        alignItems={"center"}
      >
        {isSmallMobile ? <ManagePageContentMobile /> : <ManagePageContent />}
        <Flex
          flexDirection={"row"}
          justifyContent="space-between"
          gap={4}
          mx={4}
          mt={14}
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
    </BackgroundDecoration>
  );
};
