import { Button, Flex, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { ConfirmationModal } from "../../components/ConfirmationModal.tsx";
import { stateToPageMap } from "../../constants/redirectConfig.ts";
import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useGameStore } from "../../state/useGameStore.ts";
import { BLUE, VIOLET_RGBA } from "../../theme/colors.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { GameSummary } from "./MyGames.tsx";

export const GameBox = ({
  game,
  onSurrendered,
  hideTournamentBadge = false,
}: {
  game: GameSummary;
  onSurrendered?: (gameId: number) => void;
  hideTournamentBadge?: boolean;
}) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });

  const { prepareNewGame, surrenderGame } = useGameContext();
  const { setGameId } = useGameStore();

  const { isSmallScreen } = useResponsiveValues();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const navigate = useNavigate();

  const handleContinueButtonClick = async () => {
    setIsLoading(true);
    prepareNewGame();
    setGameId(game.id);
    navigate(stateToPageMap[game.status as GameStateEnum]);
  };

  const handleSurrenderButtonClick = async () => {
    setIsLoading(true);
    try {
      surrenderGame(game.id);
      onSurrendered?.(game.id);
    } catch {
    } finally {
      setIsLoading(false);
      setIsModalOpened(false);
    }
  };

  return (
    <Flex
      alignItems="center"
      border="1px solid white"
      borderRadius="15px"
      color="white"
      width="100%"
      boxShadow={`inset 0 0 10px 5px ${game.isTournament ? BLUE : VIOLET_RGBA(0.6)}`}
      height={isSmallScreen ? "60px" : "70px"}
      opacity={game.status === GameStateEnum.GameOver ? 0.6 : 1}
    >
      <Flex
        fontWeight="bold"
        flexDirection="row"
        flex={1}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        gap={0.5}
        position="relative"
      >
        {game.isTournament && !hideTournamentBadge && (
          <Flex
            sx={{
              width: "100%",
              position: "absolute",
              top: "-18px",
              right: isSmallScreen ? "12px" : "25px",
              justifyContent: "flex-end",
            }}
          >
            <Flex
              bgColor="blue"
              px={2}
              borderRadius={"full"}
              border="1px solid white"
            >
              <Text fontSize={{base: "7px", sm: "11px"}} fontWeight={400}>
                {t("tournament-game")}
              </Text>
            </Flex>
          </Flex>
        )}
        {/* Game ID Section */}
        <Flex
          pl={isSmallScreen ? 2 : 6}
          alignItems="center"
          gap={1.5}
          w={isSmallScreen ? "100px" : "210px"}
        >
          {game.isTournament ? (
            <CachedImage
              src="/tournament-entry.png"
              h={isSmallScreen ? "30px" : "45px"}
            />
          ) : (
            <CachedImage
              src="/logos/jn.png"
              height={isSmallScreen ? "13px" : "25px"}
            />
          )}
          <Text
            fontFamily="Orbitron"
            fontSize={isSmallScreen ? "11px" : "23px"}
            fontWeight="bold"
          >
            {" "}
            · {game.id}
          </Text>
        </Flex>

        {/* Game Info Section */}
        <Flex
          flexDirection="column"
          mt={1}
          alignItems="flex-start"
          pl={isSmallScreen ? 0 : 10}
          w={isSmallScreen ? "60px" : "190px"}
        >
          {game.level && (
            <Flex gap={2}>
              <Flex gap={0.5}>
                <Text>{t("level-lbl")}</Text>
                <Text color="lightViolet">{game.level}</Text>
              </Flex>
              <Flex gap={0.5}>
                <Text>{t("round-lbl")}</Text>
                <Text color="lightViolet">{game.round}</Text>
              </Flex>
            </Flex>
          )}
          <Flex gap={1}>
            {!isSmallScreen && <Text>{t("status-lbl")}:</Text>}
            <Text color="lightViolet">{game.status}</Text>
          </Flex>
        </Flex>

        {/* Action Button Section */}
        <Flex>
          {game.status !== GameStateEnum.GameOver && (
            <Flex
              gap={isSmallScreen ? 2 : 4}
              alignItems={"center"}
              pr={isSmallScreen ? 2 : 6}
            >
              {isLoading && (
                <Spinner
                  size={{ base: "xs", sm: "sm" }}
                  visibility={isLoading ? "visible" : "hidden"}
                  px={2}
                />
              )}
              {!isLoading && (
                <>
                  <Button
                    size="sm"
                    width={isSmallScreen ? "60px" : "110px"}
                    h={isSmallScreen ? "25px" : undefined}
                    variant="secondarySolid"
                    onClick={handleContinueButtonClick}
                    disabled={isLoading}
                  >
                    {t(
                      game.status === GameStateEnum.NotStarted
                        ? "start-btn"
                        : "continue-btn",
                    ).toUpperCase()}
                  </Button>

                  <Tooltip label={t("surrender.action")}>
                    <Button
                      size="xs"
                      width={isSmallScreen ? "25px" : "32px"}
                      h={isSmallScreen ? "25px" : "32px"}
                      variant="solid"
                      onClick={() => setIsModalOpened(true)}
                      disabled={isLoading}
                    >
                      X
                    </Button>
                  </Tooltip>
                </>
              )}
              <ConfirmationModal
                isOpen={isModalOpened}
                close={() => setIsModalOpened(false)}
                title={t("surrender.confirmation-modal.title")}
                description={t("surrender.confirmation-modal.description", {
                  gameId: game.id,
                })}
                onConfirm={handleSurrenderButtonClick}
              />
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
