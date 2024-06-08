import { Box, Button, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import { GameDeck } from "../../components/GameDeck";
import { PointBox } from "../../components/MultiPoints";
import { PlaysTable } from "../../components/Plays/PlaysTable";
import { useGame } from "../../dojo/utils/useGame";
import { useGetShopItems } from "../../queries/useGetShopItems";
import { CardsRow } from "./CardsRow";

export const Store = () => {
  const { id, cash, state } = useGame();
  const { data: shopItems } = useGetShopItems(id);
  console.log(shopItems);
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
            {`${cash}ȼ`}
          </Heading>
        </PointBox>
        <Heading size="xl" variant="neonWhite">
          LEVEL UP YOUR GAME
        </Heading>
        <Box>
          <Button sx={{ lineHeight: 1.6 }} size="m" variant="outline">
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
            <PlaysTable inStore />
          </GridItem>
          <GridItem colSpan={5}>
            <CardsRow cards={shopItems.commonCards} title="traditional cards" />
          </GridItem>
          <GridItem colSpan={5}>
            <CardsRow cards={shopItems.modifierCards} title="modifiers" />
          </GridItem>
          <GridItem colSpan={4}>
            <CardsRow
              cards={shopItems.specialCards}
              title="special cards"
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
