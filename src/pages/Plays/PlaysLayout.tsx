import { Button, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { BackgroundDecoration } from "../../components/Background";
import { DelayedLoading } from "../../components/DelayedLoading";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { PositionedGameMenu } from "../../components/GameMenu";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { PlaysAvailableTable } from "./PlaysAvailableTable";

export const PlaysLayout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["game"]);
  const { isSmallScreen } = useResponsiveValues();
  const { state } = useLocation();
  const isTutorial = state?.isTutorial;

  return (
    <DelayedLoading>
      <BackgroundDecoration>
        <PositionedGameMenu decoratedPage />
        <Flex
          py={2}
          px={8}
          flexDirection={"column"}
          justifyContent={"center"}
          width={{ base: "100%", sm: "75%", md: "50%" }}
          margin={"0 auto"}
          height={"100vh"}
          sx={{
            zIndex: 1,
          }}
        >
          <Heading
            mt={{ base: 0, sm: 20, md: 20 }}
            size={{ base: "sm", sm: "md" }}
            variant="italic"
            color="white"
            textAlign={"center"}
            mb={isSmallScreen ? 10 : 8}
          >
            {t("game.plays.title").toUpperCase()}
          </Heading>
          <PlaysAvailableTable maxHeight={{ base: "52%", lg: "60%" }} />
          <Button
            className="game-tutorial-step-4"
            mt={8}
            mb={4}
            w="100%"
            size="md"
            variant="solid"
            onClick={() =>
              isTutorial
                ? navigate(-1)
                : navigate("/demo", { state: { skipRageAnimation: true } })
            }
          >
            {t("game.plays.go-back-btn")}
          </Button>
        </Flex>
        {!isSmallScreen && <PositionedDiscordLink />}
      </BackgroundDecoration>
    </DelayedLoading>
  );
};
