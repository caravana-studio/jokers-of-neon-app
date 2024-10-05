import { Box, Button, Flex, Heading, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Joyride, { CallBackProps } from "react-joyride";
import { useNavigate } from "react-router-dom";
import { Background } from "../../components/Background.tsx";
import { CashSymbol } from "../../components/CashSymbol.tsx";
import { CurrentSpecialCardsModal } from "../../components/CurrentSpecialCardsModal.tsx";
import { GameMenu } from "../../components/GameMenu.tsx";
import { Loading } from "../../components/Loading.tsx";
import {
  STORE_TUTORIAL_STEPS,
  TUTORIAL_STYLE,
} from "../../constants/gameTutorial.ts";
import { SKIP_TUTORIAL_STORE } from "../../constants/localStorage.ts";
import { useCurrentSpecialCards } from "../../dojo/queries/useCurrentSpecialCards.tsx";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useShop } from "../../dojo/queries/useShop.tsx";
import { useShopItems } from "../../dojo/queries/useShopItems.ts";
import { useShopActions } from "../../dojo/useShopActions.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { PlaysTable } from "../Plays/PlaysTable.tsx";
import { Coins } from "./Coins.tsx";
import { Packs } from "./Packs.tsx";
import { StoreCardsRow } from "./StoreCardsRow.tsx";

export const StoreContentMobile = () => {
  const { gameId, setHand, onShopSkip, setIsRageRound } = useGameContext();
  const game = useGame();
  const cash = game?.cash ?? 0;
  const store = useShop();
  const state = game?.state;
  const { lockRedirection } = useStore();
  const rerollCost = store?.reroll_cost ?? 0;
  const notEnoughCash = cash < rerollCost;

  const [rerolled, setRerolled] = useState(store?.reroll_executed ?? false);

  const [loading, setLoading] = useState(false);
  const [specialCardsModalOpen, setSpecialCardsModalOpen] = useState(false);
  const specialCards = useCurrentSpecialCards();
  const navigate = useNavigate();

  useEffect(() => {
    store && setRerolled(store.reroll_executed);
  }, [store?.reroll_executed]);

  const { skipShop } = useShopActions();

  const { reroll, locked } = useStore();
  const [run, setRun] = useState(false);

  const shopItems = useShopItems();

  const levelUpTable = (
    <Box className="game-tutorial-step-2" py={2}>
      {shopItems.pokerHandItems.length > 0 && <PlaysTable inStore />}
    </Box>
  );

  const rerollButton = (
    <Tooltip
      placement="right"
      label={
        rerolled ? "Available only once per level" : "Update available items"
      }
    >
      <Button
        className="game-tutorial-step-6"
        fontSize={10}
        w={"unset"}
        isDisabled={rerolled || locked || notEnoughCash}
        onClick={() => {
          reroll().then((response) => {
            if (response) {
              setRerolled(true);
            }
          });
        }}
      >
        REROLL {rerollCost}
        <CashSymbol />
      </Button>
    </Tooltip>
  );

  const specialsButton = specialCards.length > 0 && (
    <Button
      fontSize={10}
      w={"unset"}
      onClick={() => {
        setSpecialCardsModalOpen(true);
      }}
    >
      SEE MY <br /> SPECIAL CARDS
    </Button>
  );

  const nextLevelButton = (
    <Button
      className="game-tutorial-step-7"
      my={0}
      w={"unset"}
      onClick={() => {
        setLoading(true);
        onShopSkip();
        skipShop(gameId).then((response): void => {
          if (response.success) {
            setHand(response.cards);
            navigate("/redirect/demo");
          } else {
            setLoading(false);
          }
        });
      }}
      isDisabled={locked}
      lineHeight={1.6}
      variant="secondarySolid"
      fontSize={10}
    >
      GO TO <br /> NEXT LEVEL
    </Button>
  );

  useEffect(() => {
    const showTutorial = !localStorage.getItem(SKIP_TUTORIAL_STORE);
    if (showTutorial) setRun(true);
  }, []);

  if (loading) {
    return (
      <Background type="game">
        <Loading />
      </Background>
    );
  }

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { type } = data;

    if (type === "tour:end") {
      window.localStorage.setItem(SKIP_TUTORIAL_STORE, "true");
      setRun(false);
    }
  };

  return (
    <Background type="store" scrollOnMobile>
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
            bottom: "5px",
            right: "5px",
            zIndex: 1000,
            transform: "scale(0.7)",
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
          overflow="auto"
          pt={4}
          px={2}
        >
          <Box
            display="flex"
            w={["100%", "100%", "100%", "40%", "40%"]}
            flexDirection="column"
            pb={4}
          >
            <Flex flexDirection={"column"} gap={0} mb={4} mt={0} >
              <Heading variant="italic" size="l" ml={4} textAlign={{base: "left", sm: "center"}}>
                LEVEL UP YOUR GAME
              </Heading>       
                <Flex margin={{base: "0", sm: "0 auto"}} mt={2}>
                  <Coins rolling />
                </Flex>
            </Flex>
              <Flex justifyContent={{base: "left", sm: "center"}}>
                <Packs />
              </Flex>
          </Box>
          <Box
            width={{base: "100%", sm: "auto"}}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            pb={4}
            pl={4}
            gap={2}
          >
            <Box className="game-tutorial-step-3">
              {shopItems.commonCards.length > 0 && (
                <StoreCardsRow
                  cards={shopItems.commonCards}
                  title={"traditional and neon cards."}
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
              className="game-tutorial-step-2"
              width={{base: "95%", sm: "75%"}}
              background="rgba(0,0,0,0.5)"
              px={4}
              borderRadius="10px"
            >
              <Heading variant="italic" size="m" mt={4}>
                IMPROVE YOUR PLAYS
              </Heading>
              {levelUpTable}
            </Box>

          <Box
            display="flex"
            flexDirection={"row-reverse"}
            w={"100%"}
            justifyContent={"center"}
            gap={10}
            px={2}
          >
              <Flex
                width="100%"
                mx={2}
                justifyContent="center"
                my={6}
                mb={12}
                gap={6}
              >
                {rerollButton}
                {specialsButton}
                {nextLevelButton}
              </Flex>
          </Box>
        </Box>
      </Flex>
    </Background>
  );
};
