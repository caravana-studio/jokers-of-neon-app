import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useDeck } from "../../dojo/queries/useDeck";
import { DeckCardsGrid } from "./DeckCardsGrid";
import { Background } from "../../components/Background";
import { BLUE_LIGHT } from "../../theme/colors";

export const DeckPage = () => 
    {
        const deck = useDeck();
        const cards = deck?.cards;

        return(
            <Background type="store">
                <Flex py={4} px={20} width={"100vw"} height={"100vh"} alignItems={"center"} justifyContent={"center"} gap={12}>
                    <Flex alignItems={"center"}  width={"40%"} height={"50%"} flexDirection={"column"}>
                    
                    <Heading 
                        variant="italic" 
                        size="l"
                        width={"100%"}
                        ml={4}
                        textAlign={"center"}
                        sx={{
                            position: "relative",
                            _after: {
                                content: '""',
                                position: "absolute",
                                top: "-12px",
                                left: 0,
                                width: "100%",
                                height: "1px",
                                background:
                                    `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, ${BLUE_LIGHT} 50%, rgba(255, 255, 255, 0) 100%)`,
                                boxShadow:
                                    "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
                            },
                            _before: {
                                content: '""',
                                position: "absolute",
                                bottom: "-12px",
                                left: 0,
                                width: "100%",
                                height: "1px",
                                background:
                                    `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, ${BLUE_LIGHT} 50%, rgba(255, 255, 255, 0) 100%)`,
                                boxShadow:
                                    "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
                            },
                        }}
                    >
                        My full deck
                    </Heading>
                    <Flex flexDirection={"column"} my={12} alignItems={"center"}>
                        <Text 
                            size={"sm"}
                            sx={{
                                position: "relative",
                                _before: {
                                    content: '""',
                                    position: "absolute",
                                    bottom: "0px",
                                    left: 0,
                                    width: "100%",
                                    height: "1px",
                                    background:
                                        `linear-gradient(to right, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.5) 100%)`,
                                    boxShadow:
                                        "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
                                },
                            }}
                        >
                            Filter by
                        </Text>
                        <Flex alignItems={"space-around"} justifyContent={"center"} wrap={"wrap"} gap={4} mt={8}>
                            <Button size={"sm"} variant={"outlineSecondaryGlow"} borderRadius={"25px"}>CLUBS</Button>
                            <Button size={"sm"} variant={"outlineSecondaryGlow"} borderRadius={"25px"}>SPADE</Button>
                            <Button size={"sm"} variant={"outlineSecondaryGlow"} borderRadius={"25px"}>HEART</Button>
                            <Button size={"sm"} variant={"outlineSecondaryGlow"} borderRadius={"25px"}>DIAMOND</Button>
                            <Button size={"sm"} variant={"outlineSecondaryGlow"} borderRadius={"25px"}>NEON</Button>
                            <Button size={"sm"} variant={"outlineSecondaryGlow"} borderRadius={"25px"}>MODIFIER</Button>
                        </Flex>
                    </Flex>

                    <Flex gap={4} mt={20}>
                        <Button variant={"outlinePrimaryGlow"}>SEE SPECIAL CARDS</Button>
                        <Button variant={"outlinePrimaryGlow"}>BACK TO GAME</Button>
                    </Flex>

                    </Flex>
                    <Flex alignItems={"center"} width={"60%"} height={"60%"} overflowY="auto">
                    <Box w="100%" h="100%"> 
                        <DeckCardsGrid cards={deck?.cards} />
                    </Box>
                    </Flex>
                </Flex>
            </Background>
        );
    }