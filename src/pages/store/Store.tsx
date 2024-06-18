import { Box, Button, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameDeck } from "../../components/GameDeck";
import { PointBox } from "../../components/MultiPoints";
import { PlaysTable } from "../../components/Plays/PlaysTable";
import { RollingNumber } from "../../components/RollingNumber";
import { useDojo } from "../../dojo/useDojo";
import { useGameContext } from "../../providers/GameProvider";
import { useStore } from "../../providers/StoreProvider";
import { useGetGame } from "../../queries/useGetGame";
import { StoreCardsRow } from "./StoreCardsRow";

export const Store = () => {
  const { gameId } = useGameContext();
  const { data: game } = useGetGame(gameId);
  const state = game?.state;
  const { onShopSkip } = useGameContext();

  const {
    setup: {
      systemCalls: { skipShop },
    },
    account,
  } = useDojo();

  const { cash, shopItems } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (state === "FINISHED") {
      navigate("/gameover");
    } else if (state === "IN_GAME") {
      navigate("/demo");
    }
  }, [state]);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Flex
        justifyContent="space-between"
        gap={50}
        alignItems="center"
        sx={{ height: "15%", mx: 10 }}
      >
        <PointBox type="level">
          <Heading size="s" sx={{ mx: 4 }}>
            MY COINS
          </Heading>
          <Heading size="l" sx={{ mx: 4, color: "white" }}>
            <RollingNumber n={cash} />ȼ
          </Heading>
        </PointBox>
        <Heading size="xl" variant="neonWhite">
          LEVEL UP YOUR GAME
        </Heading>
        <Box>
          <Button
            onClick={() => {
              onShopSkip();
              skipShop(account.account, gameId).then((response): void => {
                if (response) {
                  navigate("/demo");
                }
              });
            }}
            sx={{ lineHeight: 1.6 }}
            size="m"
            variant="outline"
          >
            go to <br />
            NEXT LEVEL
          </Button>
        </Box>
      </Flex>
      <Flex sx={{ height: "85%" }}>
        <Grid
          templateColumns="repeat(8, 1fr)"
          gap={4}
          sx={{ width: "100%", m: 4 }}
        >
          <GridItem
            sx={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            colSpan={3}
            rowSpan={3}
          >
            <Heading variant="neonGreen" size="m" sx={{ m: 3 }}>
              level up your plays
            </Heading>
            {shopItems.pokerHandItems.length > 0 && <PlaysTable inStore />}
          </GridItem>
          <GridItem colSpan={5}>
            {shopItems.commonCards.length > 0 && (
              <StoreCardsRow
                cards={shopItems.commonCards}
                title="traditional cards"
              />
            )}
          </GridItem>
          <GridItem colSpan={5}>
            {shopItems.modifierCards.length > 0 && (
              <StoreCardsRow
                cards={shopItems.modifierCards}
                title="modifiers"
              />
            )}
          </GridItem>
          <GridItem colSpan={4}>
            {shopItems.specialCards.length > 0 && (
              <StoreCardsRow
                cards={shopItems.specialCards}
                title="special cards"
                button={{ label: "see my special cards", onClick: () => {} }}
              />
            )}
          </GridItem>
          <GridItem colSpan={1}>
            <Flex justifyContent="center" alignItems="flex-end" height="100%">
              <GameDeck />
            </Flex>
          </GridItem>
        </Grid>
      </Flex>
    </Box>
  );
};
