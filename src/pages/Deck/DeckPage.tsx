import { Box, Flex, Heading } from "@chakra-ui/react";
import { useDeck } from "../../dojo/queries/useDeck";
import { DeckCardsGrid } from "./DeckCardsGrid";

export const DeckPage = () => 
    {
        const deck = useDeck();
        const cards = deck?.cards;

        return(
            <Box backgroundColor="darkGrey" py={4} px={8} width={"100vw"} height={"100vh"}>
                <Heading size="lg" color="aqua" textAlign="center">
                    CURRENT DECK: {cards?.length}
                </Heading>
                <DeckCardsGrid cards={deck?.cards}></DeckCardsGrid>
            </Box>
        );
    }