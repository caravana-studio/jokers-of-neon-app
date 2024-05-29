import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading
} from "@chakra-ui/react";
import { CardsRow } from "./CardsRow";

const SPECIAL_CARDS_INDEX = [11, 17, 18, 19, 21, 22];
const SPECIAL_CARDS = SPECIAL_CARDS_INDEX.map((number) => {
  return {
    id: number.toString(),
    idx: number,
    img: `Special/special-${number}.png`,
  };
});
const MODIFIER_CARDS = [
  {
    id: "1",
    idx: 1,
    img: "Modifier/CLUBS.png",
  },
  {
    id: "2",
    idx: 2,
    img: "Modifier/multi+5.png",
  },
  {
    id: "3",
    idx: 3,
    img: "Modifier/HEARTS.png",
  },
  {
    id: "4",
    idx: 4,
    img: "Modifier/points+50.png",
  },
  {
    id: "5",
    idx: 5,
    img: "Modifier/points+10.png",
  },
  {
    id: "6",
    idx: 6,
    img: "Modifier/multi+2.png",
  },
  {
    id: "7",
    idx: 7,
    img: "Modifier/HEARTS.png",
  },
];

export const Store = () => {
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Flex justifyContent="center" alignItems="center" sx={{ height: "15%" }}>
        <Heading size="xxl" variant="neonWhite">
          STORE
        </Heading>
      </Flex>
      <Flex sx={{ height: "85%" }}>
        <Grid templateColumns="repeat(8, 1fr)" gap={4} sx={{ width: "100%" }}>
          <GridItem bg="tomato" colSpan={3} rowSpan={3}>
            plays
          </GridItem>
          <GridItem bg="tomato" colSpan={5}>
            <CardsRow cards={SPECIAL_CARDS} title="special cards" />
          </GridItem>
          <GridItem bg="tomato" colSpan={5}>
            <CardsRow cards={MODIFIER_CARDS} title="modifiers" />
          </GridItem>
          <GridItem bg="tomato" colSpan={5}>
            normal and neon cards
          </GridItem>
        </Grid>
      </Flex>
    </Box>
  );
};
