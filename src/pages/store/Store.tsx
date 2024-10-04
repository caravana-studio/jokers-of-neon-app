import { Box, Button, Flex, Heading, Image, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import Joyride, { CallBackProps } from "react-joyride";
import { useNavigate } from "react-router-dom";
import { Background } from "../../components/Background";
import { CashSymbol } from "../../components/CashSymbol.tsx";
import { CurrentSpecialCardsModal } from "../../components/CurrentSpecialCardsModal";
import { PositionedDiscordLink } from "../../components/DiscordLink.tsx";
import { GameMenu } from "../../components/GameMenu";
import { Loading } from "../../components/Loading";
import {
  STORE_TUTORIAL_STEPS,
  TUTORIAL_STYLE,
} from "../../constants/gameTutorial";
import { SKIP_TUTORIAL_STORE } from "../../constants/localStorage.ts";
import { useCurrentSpecialCards } from "../../dojo/queries/useCurrentSpecialCards.tsx";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useShop } from "../../dojo/queries/useShop.tsx";
import { useShopItems } from "../../dojo/queries/useShopItems.ts";
import { useShopActions } from "../../dojo/useShopActions.tsx";
import { useGameContext } from "../../providers/GameProvider";
import { useStore } from "../../providers/StoreProvider";
import { PlaysTable } from "../Plays/PlaysTable.tsx";
import { Coins } from "./Coins.tsx";
import { Packs } from "./Packs.tsx";
import { StoreCardsRow } from "./StoreCardsRow";

export const Store = () => {
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

  useEffect(() => {
    store && setRerolled(store.reroll_executed);
  }, [store?.reroll_executed]);

  useEffect(() => {
    setIsRageRound(false);
  }, []);

  useEffect(() => {
    if (!lockRedirection) {
      if (game?.state === "FINISHED") {
        navigate(`/gameover/${gameId}`);
      } else if (game?.state === "IN_GAME") {
        navigate("/demo");
      } else if (game?.state === "OPEN_BLISTER_PACK") {
        navigate("/open-pack");
      }
    }
  }, [game?.state, lockRedirection]);

  const { skipShop } = useShopActions();

  const { reroll, locked } = useStore();
  const [run, setRun] = useState(false);

  const shopItems = useShopItems();

  const navigate = useNavigate();

  const levelUpTable = (
    <Box className="game-tutorial-step-2" py={[2, 2, 2, 2, 4]}>
      {shopItems.pokerHandItems.length > 0 && <PlaysTable inStore />}
    </Box>
  );

  const rerollButton = (
    <Tooltip
      placement={isMobile ? "top" : "right"}
      label={
        rerolled ? "Available only once per level" : "Update available items"
      }
    >
      <Button
        className="game-tutorial-step-6"
        fontSize={[10, 10, 10, 14, 14]}
        w={["unset", "unset", "unset", "100%", "100%"]}
        isDisabled={rerolled || locked || notEnoughCash}
        onClick={() => {
          reroll().then((response) => {
            if (response) {
              setRerolled(true);
            }
          });
        }}
      >
        REROLL{isMobile && <br />} {rerollCost}
        <CashSymbol />
      </Button>
    </Tooltip>
  );

  const specialsButton = specialCards.length > 0 && (
    <Button
      fontSize={[10, 10, 10, 14, 14]}
      w={["unset", "unset", "unset", "100%", "100%"]}
      onClick={() => {
        setSpecialCardsModalOpen(true);
      }}
    >
      SEE MY{isMobile && <br />} SPECIAL CARDS
    </Button>
  );

  const nextLevelButton = (
    <Button
      className="game-tutorial-step-7"
      my={{ base: 0, md: 6 }}
      w={["unset", "unset", "unset", "100%", "100%"]}
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
      fontSize={[10, 10, 10, 14, 14]}
    >
      GO TO {isMobile && <br />} NEXT LEVEL
    </Button>
  );

  useEffect(() => {
    if (state === "FINISHED") {
      navigate(`/gameover/${gameId}`);
    } else if (state === "IN_GAME") {
      navigate("/demo");
    }
  }, [state]);

  useEffect(() => {
    if (!game) {
      navigate("/");
    }
  }, []);

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
      {!isMobile ? (
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
      ) : (
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
      )}
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
          width="100%"
          overflow={isMobile ? "scroll" : "auto"}
          pt={isMobile ? 4 : 0}
          px={{ base: 2, md: 14 }}
        >
          <Box
            display="flex"
            w={["100%", "100%", "40%", "40%", "40%"]}
            h={[null, null, "100%", "100%", "100%"]}
            flexDirection="column"
            justifyContent="space-between"
            pb={isMobile ? 4 : 0}
          >
            <Heading variant="italic" size="l" ml={4}>
              LEVEL UP YOUR GAME
            </Heading>
            {isMobile && (
              <Flex mt={2}>
                <Coins rolling />
              </Flex>
            )}
            <Packs />
            {!isMobile && <Flex mt={8}>{levelUpTable}</Flex>}
            {!isMobile && <Coins rolling />}
          </Box>
          <Box
            w={["100%", "100%", "45%", "45%", "45%"]}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            pb={isMobile ? 4 : 0}
            pl={4}
            gap={[2, 2, 4, 6, 6]}
          >
            <Box className="game-tutorial-step-3">
              {shopItems.commonCards.length > 0 && (
                <StoreCardsRow
                  cards={shopItems.commonCards}
                  title="traditional and neon cards"
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
          {isMobile && (
            <Box
              className="game-tutorial-step-2"
              w="100%"
              background="rgba(0,0,0,0.5)"
              px={4}
              borderRadius="10px"
            >
              <Heading variant="italic" size="m" mt={4}>
                IMPROVE YOUR PLAYS
              </Heading>
              {levelUpTable}
            </Box>
          )}

          <Box
            display="flex"
            flexDirection={[
              "row-reverse",
              "row-reverse",
              "row-reverse",
              "column",
              "column",
            ]}
            w={["100%", "100%", "100%", "15%", "15%"]}
            h={[null, null, null, "100%", "100%"]}
            justifyContent={[
              "center",
              "center",
              "center",
              "space-between",
              "space-between",
            ]}
            gap={10}
            px={isMobile ? 2 : 0}
          >
            {!isMobile ? (
              <>
                {nextLevelButton}
                <Flex flexDirection="column" gap={14} alignItems="center">
                  {rerollButton}
                  {specialsButton}
                  <Image
                    src="/logos/logo-variant.svg"
                    alt="store-bg"
                    width="90%"
                  />
                </Flex>
              </>
            ) : (
              <Flex
                width="95%"
                justifyContent="space-between"
                my={4}
                mb={"100px"}
              >
                {rerollButton}
                {specialsButton}
                {nextLevelButton}
              </Flex>
            )}
          </Box>
        </Box>
      </Flex>
      {!isMobile && <PositionedDiscordLink  />}
    </Background>
  );
};
