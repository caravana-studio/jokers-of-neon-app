import { Box, Flex, Heading } from "@chakra-ui/react";
import { CardsRow } from "./CardsRow";

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
    <Box width="100%" p={2}>
      <CardsRow cards={cards} />
      <Flex sx={{ px: 4, mt: 1 }} justifyContent="space-between">
        <Heading size="s">special cards</Heading>
        <Heading size="s">({cards.length}/5)</Heading>
      </Flex>
    </Box>
  );
};
