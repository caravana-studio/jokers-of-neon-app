import { Box, Checkbox, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { BackgroundDecoration } from "../../../components/Background";
import { Loading } from "../../../components/Loading";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { useCardsFlipAnimation } from "../../../hooks/useCardsFlipAnimation";
import { FlipCardGrid } from "../FlipCardGrid";
import { useRedirectByGameState } from "../../../hooks/useRedirectByGameState";
import { ChooseCardsButton } from "../ChooseCardsButton";
import { useCardsSelection } from "../../../hooks/useCardsSelection";
import { ManageSpecialCardsButton } from "../ManageSpecialCardsButton";
import { MobileBottomBar } from "../../../components/MobileBottomBar";

export const OpenLootBoxCardSelection = () => {
  const {
    cards,
    cardsToKeep,
    chooseDisabled,
    currentSpecialCardsLength,
    allSelected,
    setCardsToKeep,
    onCardToggle,
    confirmSelectCards,
  } = useCardsSelection();

  const { flippedStates, animationRunning, skipFlipping } =
    useCardsFlipAnimation(cards.length, 1000);

  const { t } = useTranslation(["store"]);
  const { isSmallScreen } = useResponsiveValues();

  useRedirectByGameState();

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
        <Tooltip label={t("store.packs.error-lbl")}>{continueButton}</Tooltip>
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
                  !e.target.checked
                    ? setCardsToKeep([])
                    : setCardsToKeep(cards);
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
              onCardToggle={onCardToggle}
              onGridClick={skipFlipping}
            />
          </Flex>
          <Flex
            flexDirection={isSmallScreen ? "column" : "row"}
            justifyContent="space-between"
            mt={4}
            gap={4}
          >
            {currentSpecialCardsLength > 0 ? (
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
