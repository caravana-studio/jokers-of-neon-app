import { Button, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { BackgroundDecoration } from "../../components/Background";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { PlaysAvailableTable } from "./PlaysAvailableTable";

export const PlaysLayout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["game"]);
  const { isSmallScreen } = useResponsiveValues();
  const { state } = useLocation();
  const isTutorial = state?.isTutorial;

  const content = (
    <Flex
      py={2}
      px={8}
      flexDirection={"column"}
      justifyContent={"center"}
      width={{ base: "100%", sm: "75%", md: "50%" }}
      margin={"0 auto"}
      height={"100%"}
      sx={{
        zIndex: 1,
      }}
    >
      <Heading
        mt={{ base: 0, sm: 20, md: 20 }}
        size={"md"}
        variant="italic"
        color="white"
        textAlign={"center"}
        mb={8}
      >
        {t("game.plays.title").toUpperCase()}
      </Heading>
      <PlaysAvailableTable maxHeight={{ base: undefined, lg: "60%" }} />
      {!isSmallScreen && (
        <Button
          className="game-tutorial-step-4"
          mt={8}
          mb={4}
          w="100%"
          size="md"
          variant="solid"
          onClick={() =>
            isTutorial
              ? navigate("/demo")
              : navigate("/demo", { state: { skipRageAnimation: true } })
          }
        >
          {t("game.plays.go-back-btn")}
        </Button>
      )}
    </Flex>
  );

  return (
    <DelayedLoading>
      {isSmallScreen ? (
        <>
          <MobileDecoration />
          {content}
        </>
      ) : (
        <BackgroundDecoration>{content}</BackgroundDecoration>
      )}
    </DelayedLoading>
  );
};
