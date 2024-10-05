import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Joyride, { CallBackProps } from "react-joyride";
import { Background } from "../../components/Background.tsx";
import { CurrentSpecialCardsModal } from "../../components/CurrentSpecialCardsModal.tsx";
import { GameMenu } from "../../components/GameMenu.tsx";
import {
  STORE_TUTORIAL_STEPS,
  TUTORIAL_STYLE,
} from "../../constants/gameTutorial.ts";
import { SKIP_TUTORIAL_STORE } from "../../constants/localStorage.ts";
import { Coins } from "./Coins.tsx";
import { Packs } from "./Packs.tsx";
import { StoreCardsRow } from "./StoreCardsRow.tsx";
import useStoreContent from "./UseStoreContent.ts";
import LevelUpTable from "./StoreElements/LevelUpTable.tsx";
import RerollButton from "./StoreElements/RerollButton.tsx";
import SpecialsButton from "./StoreElements/SpecialsButton.tsx";
import NextLevelButton from "./StoreElements/NextLevelButton.tsx";

export const StoreContent = () => {
  const {
    cash,
    rerollCost,
    notEnoughCash,
    rerolled,
    setRerolled,
    setLoading,
    specialCardsModalOpen,
    setSpecialCardsModalOpen,
    specialCards,
    skipShop,
    run,
    setRun,
    reroll,
    locked,
    shopItems,
    onShopSkip,
    gameId,
    setHand,
  } = useStoreContent();

  useEffect(() => {
    const showTutorial = !localStorage.getItem(SKIP_TUTORIAL_STORE);
    if (showTutorial) setRun(true);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { type } = data;

    if (type === "tour:end") {
      window.localStorage.setItem(SKIP_TUTORIAL_STORE, "true");
      setRun(false);
    }
  };

  return (
    <Background type="store">
      <Joyride
        steps={STORE_TUTORIAL_STEPS}
        run={run}
        continuous
        showSkipButton
        styles={TUTORIAL_STYLE}
        showProgress
        callback={handleJoyrideCallback}
      />
      {specialCardsModalOpen && (
        <CurrentSpecialCardsModal
          close={() => setSpecialCardsModalOpen(false)}
        />
      )}
        <Box
          sx={{
            position: "fixed",
            bottom: 7,
            left: 10,
            zIndex: 1000,
          }}
        >
          <GameMenu
            inStore
            showTutorial={() => {
              setRun(true);
            }}
          />
        </Box>
      <Flex
        width="100%"
        height="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="center"
          width="100%"
          overflow={"auto"}
          pt={0}
          px={{md: 0, lg: 14}}
          overflowY={"hidden"}
        >
          <Box
            display="flex"
            h={"100%"}
            flexDirection="column"
            justifyContent="space-between"
            pb={0}
          >
            <Flex flexDirection={"column"} gap={4} mb={0}>
              <Heading variant="italic" size="l" ml={4}>
                LEVEL UP YOUR GAME
              </Heading>
            </Flex>
            <Packs />
            <Flex mt={8} width={"95%"}>
              <LevelUpTable shopItems={shopItems} isSmallScreen={false}/>
            </Flex>
            <Coins rolling />
          </Box>
          <Box
            w={"auto"}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems={"flex-start"}
            pb={0}
            pl={4}
            pr={4}
            gap={6}
          >
            <Box className="game-tutorial-step-3">
              {shopItems.commonCards.length > 0 && (
                <StoreCardsRow
                  cards={shopItems.commonCards}
                  title={"traditional and neon cards"}
                />
              )}
            </Box>
            <Box className="game-tutorial-step-4">
              {shopItems.modifierCards.length > 0 && (
                <StoreCardsRow
                  cards={shopItems.modifierCards}
                  title="modifier cards"
                />
              )}
            </Box>
            <Box className="game-tutorial-step-5">
              {shopItems.specialCards.length > 0 && (
                <StoreCardsRow
                  cards={shopItems.specialCards}
                  title="special cards"
                />
              )}
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection={"column"}
            w={"15%"}
            h={"100%"}
            justifyContent={"space-between"}
            gap={10}
            px={0}
            paddingInlineStart={"4px"}
          >
              <>
                <NextLevelButton
                  setLoading={setLoading}
                  onShopSkip={onShopSkip}
                  skipShop={skipShop}
                  gameId={gameId}
                  setHand={setHand}
                  locked={false}
                  isSmallScreen={false}
                />
                <Flex flexDirection="column" gap={14}>
                <RerollButton
                  rerolled={rerolled}
                  locked={locked}
                  notEnoughCash={notEnoughCash}
                  rerollCost={rerollCost}
                  setRerolled={setRerolled}
                  isSmallScreen={false}
                  reroll={reroll}
                />
                  <SpecialsButton
                    specialCards={specialCards}
                    setSpecialCardsModalOpen={setSpecialCardsModalOpen}
                    isSmallScreen={false}
                  />
                  <Image
                    src="/logos/logo-variant.svg"
                    alt="store-bg"
                    width="90%"
                  />
                </Flex>
              </>
          </Box>
        </Box>
      </Flex>
    </Background>
  );
};
