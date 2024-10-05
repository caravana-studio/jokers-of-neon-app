import { Button, Flex, Heading } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Background } from "../../components/Background";
import { useTranslation } from "react-i18next";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { PlaysAvailableTable } from "./PlaysAvailableTable";

export const PlaysLayout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["game"]);

  return (
    <Background type="game" dark bgDecoration>
      <Flex
        py={2}
        px={8}
        flexDirection={"column"}
        justifyContent={"center"}
        width={isMobile ? "100%" : { sm: "75%", md: "50%" }}
        margin={"0 auto"}
        height={"100vh"}
      >
        <Heading
          mt={{ base: 0, sm: 20, md: 20 }}
          size={{ base: "sm", sm: "md" }}
          variant="italic"
          color="white"
          textAlign={"center"}
          mb={isMobile ? 10 : 8}
        >
          {t('game.plays.title').toUpperCase()}
        </Heading>
        <PlaysAvailableTable maxHeight={{ base: "52%", md: "60%" }} />
        <Button
          className="game-tutorial-step-4"
          mt={8}
          mb={4}
          w="100%"
          size="md"
          variant="solid"
          onClick={() =>
            navigate("/demo", { state: { skipRageAnimation: true } })
          }
        >
          {t('game.plays.go-back-btn')}
        </Button>
      </Flex>
      {!isMobile && <PositionedDiscordLink  />}
    </Background>
  );
};
