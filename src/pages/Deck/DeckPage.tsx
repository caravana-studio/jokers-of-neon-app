import { Box, Flex, Heading } from "@chakra-ui/react";
import { useDeck } from "../../dojo/queries/useDeck";
import { DeckCardsGrid } from "./DeckCardsGrid";
import { Background } from "../../components/Background";

export const DeckPage = () => 
    {
        const deck = useDeck();
        const cards = deck?.cards;

        return(
            <Background type="store">
                <Flex py={4} px={8} width={"100vw"} height={"100vh"} flexDirection={"column"} justifyContent={"center"}>
                <Heading variant="italic" size="l" ml={4}>
                    My full deck
                </Heading>
                    <DeckCardsGrid cards={deck?.cards}></DeckCardsGrid>
                </Flex>
            </Background>
        );
    }