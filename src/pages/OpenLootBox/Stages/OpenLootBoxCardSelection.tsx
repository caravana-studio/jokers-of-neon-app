import { Box, Checkbox, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BackgroundDecoration } from "../../../components/Background";
import { Loading } from "../../../components/Loading";
import { MobileBottomBar } from "../../../components/MobileBottomBar";
import { useDojo } from "../../../dojo/DojoContext";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useCardsFlipAnimation } from "../../../hooks/useCardsFlipAnimation";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { useCustomToast } from "../../../hooks/useCustomToast";
import { useStore } from "../../../providers/StoreProvider";
import { useGameStore } from "../../../state/useGameStore";
import { useLootBoxStore } from "../../../state/useLootBoxStore";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { ChooseCardsButton } from "../ChooseCardsButton";
import { FlipCardGrid } from "../FlipCardGrid";
import { ManageSpecialCardsButton } from "../ManageSpecialCardsButton";

export const OpenLootBoxCardSelection = () => {
  const {
    setup: { client },
  } = useDojo();
  const navigate = useCustomNavigate();

  const {
    fetchLootBoxResult,
    result: cards,
    cardsToKeep,
    toggleCard,
    reset,
    selectAll,
    selectNone,
  } = useLootBoxStore();

  const {
    id: gameId,
    specialSlots,
    specialCards: currentSpecialCards,
  } = useGameStore();
  const specialCardsToKeep = cardsToKeep.filter((c) => c.isSpecial).length;
  const maxSpecialCards = specialSlots ?? 0;
  const currentSpecialCardsLength = currentSpecialCards?.length ?? 0;

  useEffect(() => {
    fetchLootBoxResult(client, gameId);
  }, []);
  const { selectCardsFromPack } = useStore();
  const { showErrorToast } = useCustomToast();

  const confirmSelectCards = () => {
    selectCardsFromPack(cardsToKeep.map((c) => c.idx))
      .then((response) => {
        if (response) {
          reset();
        } else {
          showErrorToast("Error selecting cards");
          navigate(GameStateEnum.Lootbox);
        }
      })
      .catch(() => {
        showErrorToast("Error selecting cards");
        navigate(GameStateEnum.Lootbox);
      });
    navigate(GameStateEnum.Store);
  };

  const { flippedStates, animationRunning, skipFlipping } =
    useCardsFlipAnimation(cards.length, 1000);

  const specialCardCount = cards.filter((card) => card.isSpecial).length;

  const { t } = useTranslation(["store"]);
  const { isSmallScreen } = useResponsiveValues();

  const chooseDisabled =
    specialCardsToKeep > maxSpecialCards - currentSpecialCardsLength;
  const allSelected = cardsToKeep.length === cards.length;

  const continueButton = (
    <ChooseCardsButton
      disabled={chooseDisabled}
      opacity={animationRunning ? 0 : 1}
      onConfirm={confirmSelectCards}
      cardsToKeep={cardsToKeep.length}
    />
  );

  const renderContinueButton = () => {
    if (chooseDisabled) {
      if (isSmallScreen) {
        return (
          <Flex w="100%" justifyContent="center" alignItems="center">
            <Text textAlign="center" w="60%" size="lg" zIndex={2}>
              {t("store.packs.error-lbl")}
            </Text>
          </Flex>
        );
      }

      return (
        <Tooltip label={t("store.packs.error-lbl")} zIndex={10}>
          <Box display="inline-block">{continueButton}</Box>
        </Tooltip>
      );
    }

    return !isSmallScreen ? continueButton : null;
  };

  return (
    <BackgroundDecoration contentHeight={isSmallScreen ? "85%" : "60%"}>
      {cards.length > 0 ? (
        <Flex
          height={"100%"}
          width={isSmallScreen ? "100%" : "auto"}
          justifyContent={isSmallScreen ? "space-between" : "center"}
          flexDirection="column"
          gap={4}
        >
          <Flex
            flexDirection={"column"}
            gap={4}
            justifyContent={"center"}
            height={isSmallScreen ? "100%" : "auto"}
          >
            <Flex
              flexDirection={isSmallScreen ? "column" : "row"}
              justifyContent="space-between"
              alignItems="center"
              mx={2}
              opacity={animationRunning ? 0 : 1}
              transition="opacity 0.3s ease"
              gap={isSmallScreen ? 2 : 8}
            >
              <Text size="lg">{t("store.packs.cards-select-lbl")}</Text>
              <Checkbox
                color="white"
                isChecked={!!allSelected}
                onChange={(e) => {
                  !e.target.checked ? selectNone() : selectAll();
                }}
              >
                {t("store.packs.select-all-lbl").toUpperCase()}
              </Checkbox>
            </Flex>
            <FlipCardGrid
              cards={cards}
              cardsToKeep={cardsToKeep}
              flippedStates={flippedStates}
              animationRunning={animationRunning}
              onCardToggle={toggleCard}
              onGridClick={skipFlipping}
            />
          </Flex>
          <Flex
            flexDirection={isSmallScreen ? "column" : "row"}
            justifyContent="space-between"
            mt={4}
            gap={4}
          >
            {specialCardCount > 0 ? (
              <ManageSpecialCardsButton opacity={animationRunning ? 0 : 1} />
            ) : (
              <Box />
            )}

            {renderContinueButton()}
          </Flex>
          {isSmallScreen && (
            <MobileBottomBar
              secondButtonReactNode={continueButton}
              hideDeckButton
            />
          )}
        </Flex>
      ) : (
        <Loading />
      )}
    </BackgroundDecoration>
  );
};
