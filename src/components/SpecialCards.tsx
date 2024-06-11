import { Box, Flex, GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import { TiltCard } from "./TiltCard";

const cards = [
  {
    id: "1",
    idx: 1,
    img: "effect/1.png",
  },
  {
    id: "2",
    idx: 1,
    img: "effect/10.png",
  },
  {
    id: "3",
    idx: 1,
    img: "effect/15.png",
  },
  {
    id: "4",
    idx: 1,
    img: "effect/7.png",
  },
  {
    id: "5",
    idx: 1,
    img: "effect/12.png",
  },
];

export const SpecialCards = () => {
  return (
    <Box>
      <SimpleGrid columns={5}>
        {cards.map((card) => {
          return (
            <GridItem key={card.id} sx={{ mx: 1 }} justifyContent='flex-end' alignItems="right">
              <TiltCard card={card} />
            </GridItem>
          );
        })}
      </SimpleGrid>
      <Flex sx={{px: 2, mt: 1}} justifyContent='space-between'>
        <Heading size="s">special cards</Heading>
        <Heading size="s">(5/5)</Heading>
      </Flex>
    </Box>
  );
};
