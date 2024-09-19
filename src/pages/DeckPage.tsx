import { Box, Flex, Heading } from "@chakra-ui/react";
import { TiltCard } from "../components/TiltCard";
import { useDeck } from "../dojo/queries/useDeck";
import { Card } from "../types/Card";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps";
import { useEffect, useRef, useState } from "react";

const SCALE = 0.45;
const CUSTOM_CARD_WIDTH = CARD_WIDTH * SCALE;
const CUSTOM_CARD_HEIGHT = CARD_HEIGHT * SCALE;

export const DeckPage = () => 
    {
        const deck = useDeck();
        const cards = deck?.cards;

        const labelRef = useRef(null);
        const [flexWidth, setFlexWidth] = useState(0);

        useEffect(() => {
            const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setFlexWidth(entry.contentRect.width);
            }
            });
            if (labelRef.current) {
            resizeObserver.observe(labelRef.current);
            }
            return () => {
            if (labelRef.current) {
                resizeObserver.unobserve(labelRef.current);
            }
            };
        }, []);

        const calculateCardPosition = (index: number) => {

            if (!cards) return 0;

            if (cards.length === 1) return flexWidth / 2 - CUSTOM_CARD_WIDTH / 2; 
            const position = (flexWidth - CUSTOM_CARD_WIDTH) / (cards.length - 1) * index;

            return position + CUSTOM_CARD_WIDTH / 2;
        };
        
        return(
            <Box backgroundColor="darkGrey" py={4} px={8} width={"100vw"} height={"100vh"}>
                <Heading size="lg" color="aqua" textAlign="center">
                    CURRENT DECK: {cards?.length}
                </Heading>
                <Box mb={4}>
                    <Flex justifyContent="start" mb={1} id="label" ref={labelRef}>
                        <Heading size="s" color="white" textAlign="center">
                        {/* {suit} */}
                        Deck
                        </Heading>
                    </Flex>

                    <Box position="relative" height={CUSTOM_CARD_HEIGHT} id="cards-container">
                        {cards?.map((card, index) => {
                        const cardPosX = calculateCardPosition(index);
                        return (
                            <Box
                                key={card.id+String(card.isModifier)}
                                position="absolute"
                                left={`${cardPosX}px`}
                                m={1}
                                transform={`translateX(-${CUSTOM_CARD_WIDTH / 2}px)`}
                            >
                            <TiltCard card={card} scale={SCALE} />
                            </Box>
                        );
                        })}
                    </Box>

                </Box>
            </Box>
        );
    }