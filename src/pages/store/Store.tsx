import { Box, Button, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import { PointBox } from "../../components/MultiPoints";
import { CardsRow } from "./CardsRow";

const SPECIAL_CARDS_INDEX = [17, 19, 21];
const SPECIAL_CARDS = SPECIAL_CARDS_INDEX.map((number) => {
  return {
    id: number.toString(),
    idx: number,
    img: `effect/special-${number}.png`,
    price: 1500,
  };
});
const MODIFIER_CARDS = [
  {
    id: "1",
    idx: 1,
    img: "effect/26.png",
    price: 500,
  },
  {
    id: "2",
    idx: 2,
    img: "effect/20.png",
    price: 500,
  },
  {
    id: "3",
    idx: 3,
    img: "effect/28.png",
    price: 300,
  },
  {
    id: "4",
    idx: 4,
    img: "effect/23.png",
    price: 600,
  },
];

const COMMON_CARDS_INDEX = [3, 51, 22, 45, 34];
const COMMON_CARDS = COMMON_CARDS_INDEX.map((number) => {
  return {
    id: number.toString(),
    idx: number,
    img: `${number}.png`,
    price: 150,
  };
});

export const Store = () => {
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Flex
        justifyContent="space-between"
        gap={50}
        alignItems="center"
        sx={{ height: "15%", mx: 10 }}
      >
        <PointBox type="level">
          <Heading size="s">MY COINS</Heading>
          <Heading size="l" sx={{ mx: 4, color: "white" }}>
            2000ȼ
          </Heading>
        </PointBox>
        <Heading size="xl" variant="neonWhite">
          LEVEL UP YOUR GAME
        </Heading>
        <Box>
          <Button sx={{lineHeight: 1.6}} size="m" variant="outline">
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
              plays
            </Heading>
          </GridItem>
          <GridItem colSpan={5}>
            <CardsRow
              cards={SPECIAL_CARDS}
              title="special cards"
              button={{ label: "see my special cards", onClick: () => {} }}
            />
          </GridItem>
          <GridItem colSpan={5}>
            <CardsRow
              cards={MODIFIER_CARDS}
              title="modifiers"
              button={{ label: "see my modifiers", onClick: () => {} }}
            />
          </GridItem>
          <GridItem colSpan={5}>
            <CardsRow
              cards={COMMON_CARDS}
              title="traditional cards"
              button={{ label: "see my traditional cards", onClick: () => {} }}
            />
          </GridItem>
        </Grid>
      </Flex>
    </Box>
  );
};
