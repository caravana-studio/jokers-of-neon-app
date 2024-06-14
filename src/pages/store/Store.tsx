import { Box, Button, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameDeck } from "../../components/GameDeck";
import { PointBox } from "../../components/MultiPoints";
import { PlaysTable } from "../../components/Plays/PlaysTable";
import { RollingNumber } from "../../components/RollingNumber";
import { useDojo } from "../../dojo/useDojo";
import { useGame } from "../../dojo/queries/useGame";
import { useGetShopItems } from "../../queries/useGetShopItems";
import { StoreCardsRow } from "./StoreCardsRow";

export const Store = () => {
  const { id, cash, state, round } = useGame();
  const { data: shopItems } = useGetShopItems(id, round);
  const {
    setup: {
      systemCalls: { skipShop, buyCard, levelUpPokerHand },
    },
    account,
  } = useDojo();
  const navigate = useNavigate();

  useEffect(() => {
    if (state === "FINISHED") {
      navigate("/gameover");
    } else if (state === "IN_GAME") {
      navigate("/demo");
    }
  }, []);

  const onBuyCard = (card_idx: number, card_type: number) => {
    buyCard(account.account, id, card_idx, card_type);
  };

  const onBuyPlayLevelUp = (item_id: number) => {
    levelUpPokerHand(account.account, id, item_id);
  };

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
              skipShop(account.account, id).then((response): void => {
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
            <PlaysTable inStore onBuyPlayLevelUp={onBuyPlayLevelUp} />
          </GridItem>
          <GridItem colSpan={5}>
            <StoreCardsRow
              cards={shopItems.commonCards}
              title="traditional cards"
              onBuyCard={(card_idx: number) => {
                onBuyCard(card_idx, 1);
              }}
            />
          </GridItem>
          <GridItem colSpan={5}>
            <StoreCardsRow
              cards={shopItems.modifierCards}
              title="modifiers"
              onBuyCard={(card_idx: number) => {
                onBuyCard(card_idx, 2);
              }}
            />
          </GridItem>
          <GridItem colSpan={4}>
            <StoreCardsRow
              cards={shopItems.specialCards}
              title="special cards"
              onBuyCard={(card_idx: number) => {
                onBuyCard(card_idx, 3);
              }}
              button={{ label: "see my special cards", onClick: () => {} }}
            />
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
