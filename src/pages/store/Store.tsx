import {
  Box,
  Button,
  Heading,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "../../components/Background";
import { GameMenu } from "../../components/GameMenu";
import { Loading } from "../../components/Loading";
import { PlaysTable } from "../../components/Plays/PlaysTable";
import { RollingNumber } from "../../components/RollingNumber";
import { useDojo } from "../../dojo/useDojo";
import { useCustomToast } from "../../hooks/useCustomToast";
import { useGameContext } from "../../providers/GameProvider";
import { useStore } from "../../providers/StoreProvider";
import { useGetGame } from "../../queries/useGetGame";
import { useGetStore } from "../../queries/useGetStore";
import { StoreCardsRow } from "./StoreCardsRow";
import { isMobile } from "react-device-detect";

export const Store = () => {
  const { gameId, setHand } = useGameContext();
  const { data: game } = useGetGame(gameId);
  const { data: store } = useGetStore(gameId);
  const state = game?.state;
  const { onShopSkip } = useGameContext();

  const rerollCost = store?.reroll_cost ?? 0;

  const [rerolled, setRerolled] = useState(store?.reroll_executed ?? false);
  const { showErrorToast } = useCustomToast();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    store && setRerolled(store.reroll_executed);
  }, [store?.reroll_executed]);

  const {
    setup: {
      systemCalls: { skipShop },
    },
    account,
  } = useDojo();

  const { cash, shopItems, reroll } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (state === "FINISHED") {
      navigate("/gameover");
    } else if (state === "IN_GAME") {
      navigate("/demo");
    }
  }, [state]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Background type="store">
      {!isMobile && (<Box
          sx={{
            position: "fixed",
            bottom: 7,
            left: 10,
            zIndex: 1000,
          }}>
          <GameMenu/>
      </Box>)}
      <Box
        gap={4}
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        h="100%"
        overflow={isMobile ? "scroll" : "auto"}
        pt={isMobile ? 4 : 0}
      >
        <Box
          display="flex"
          w={["100%", "100%", "45%", "45%", "40%"]}
          h={[null, null, "60%", "60%", "100%"]}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          pb={isMobile ? 4 : 0}
        >
          <Heading variant="italic" ml={12}>
            LEVEL UP YOUR GAME
          </Heading>
          <Box py={[2, 2, 2, 2, 4]}>
            {shopItems.pokerHandItems.length > 0 && <PlaysTable inStore />}
          </Box>
          <Heading
            variant={"italic"}
            sx={{
              mx: 16,
              position: "relative",
              _after: {
                content: '""',
                position: "absolute",
                bottom: -3,
                left: 0,
                width: "100%",
                height: "1px",
                background: "white",
                boxShadow:
                  "0 0 1px 0px rgba(255, 255, 255), 0 0 8px 1px rgba(255, 255, 255)",
              },}}
          >
            MY COINS: <RollingNumber n={cash} /> ȼ
          </Heading>
        </Box>
        <Box
          w={["100%", "100%", "45%", "45%", "40%"]}
          h={[null, null, "75%", "75%", "100%"]}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          pb={isMobile ? 4 : 0}
          pl={isMobile ? 4 : 0}
        >
            <Box>
              {shopItems.commonCards.length > 0 && (
                <StoreCardsRow
                  cards={shopItems.commonCards}
                  title="traditional cards"
                />
              )}
            </Box>
            <Box>
              {shopItems.modifierCards.length > 0 && (
                <StoreCardsRow
                  cards={shopItems.modifierCards}
                  title="modifiers"
                />
              )}
            </Box>
            <Box>
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
          flexDirection={["row-reverse", "row-reverse", "row-reverse", "row-reverse", "column"]}
          w={["100%", "100%", "100%", "100%", "15%"]}
          alignItems="center"
          justifyContent="center"
          gap={10}
          pb={isMobile ? 4 : 0}
          px={isMobile ? 2 : 0}
        >
          <Button
            onClick={() => {
              setLoading(true);
              onShopSkip();
              skipShop(account.account, gameId).then((response): void => {
                if (response.success) {
                  setHand(response.cards);
                  navigate("/redirect/demo");
                } else {
                  setLoading(false);
                  showErrorToast("Error skipping shop");
                }
              });
            }}
            lineHeight={1.6}
            variant="secondarySolid"
          >
            GO TO {isMobile  && (<br/>)} NEXT LEVEL
          </Button>
          <Tooltip
            placement="right"
            label={
              rerolled
                ? "Available only once per level"
                : "Update available items"
            }
          >
          <Button
            isDisabled={rerolled}
            onClick={() => {
              reroll().then((response) => {
                if (response) {
                  setRerolled(true);
                }
              });
            }}
          >
            REROLL{isMobile  && (<br/>)} ({rerollCost}ȼ)
          </Button>
          </Tooltip>
          <Button>
            SEE MY{isMobile  && (<br/>)} SPECIALS
          </Button>
          {/*  full deck */}
        </Box>
      </Box>
    </Background>
  );
};
