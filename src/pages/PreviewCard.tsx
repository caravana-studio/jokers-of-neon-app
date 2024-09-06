import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Image,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import OpenAnimation from "../components/OpenAnimation.tsx";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { getCardData } from "../utils/getCardData";
import { getTemporalCardText } from "../utils/getTemporalCardText.ts";
import { isMobile } from "react-device-detect";
import { useGame } from "../dojo/queries/useGame.tsx";
import { useStore } from "../providers/StoreProvider";
import { Background } from "../components/Background";
import { Card } from "../types/Card";
import theme from "../theme/theme";

const SIZE_MULTIPLIER = isMobile ? 1.3 : 2;
const { white, blue } = theme.colors;

const PreviewCard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Extract card and isPack from state
  const { card, isPack } = state || {};
  
  if (!card) {
    return <p>Card not found.</p>;
  }

  const game = useGame();
  const { buyCard } = useStore();
  const cash = game?.cash ?? 0;
  const { name, description, details } = getCardData(card, isPack);
  const { locked, setLockRedirection } = useStore();
  const specialMaxLength = game?.len_max_current_special_cards ?? 0;
  const specialLength = game?.len_current_special_cards ?? 0;

  const notEnoughCash = !card.price || cash < card.price;
  const noSpaceForSpecialCards =
    card.isSpecial && specialLength >= specialMaxLength;

  const [isOpenAnimationRunning, setIsOpenAnimationRunning] =
    useState<boolean>(false);

  const buyButton = (
    <Button
      onClick={() => {
        buyCard(card);
        if (isPack) {
          setIsOpenAnimationRunning(true);
          setLockRedirection(true);
        } else {
          navigate(-1);
        }
      }}
    //   sx={{ width: "50%" }}
      variant="secondarySolid"
      isDisabled={notEnoughCash || noSpaceForSpecialCards || locked}
    >
      BUY
    </Button>
  );

  const handleAnimationEnd = () => {
    setIsOpenAnimationRunning(false);
    setLockRedirection(false);
    navigate("/open-pack");
  };

  return (
    <Background type="home" dark>
        <Flex flexDirection={"column"} 
        justifyContent={"center"} height={"100vh"}>
            <Flex 
            // py={2} 
            // px={8} 
            flexDirection={"column"} 
            justifyContent={"center"} 
            width="60%"
            margin={"0 auto"} 
            bg="rgba(0, 0, 0, 0.3)"
            borderRadius="25px"
            p={6}
            boxShadow={`0px 0px 10px 1px ${white}`}
            >
                <Flex>
                    <OpenAnimation
                        startAnimation={isOpenAnimationRunning}
                        onAnimationEnd={handleAnimationEnd}
                    >
                        <Box width={`${CARD_WIDTH * SIZE_MULTIPLIER + 30}px`}>
                        <Image
                            src={isPack ? `Cards/${card.img}.png` : `Cards/${card.isSpecial || card.isModifier ? `effect/big/${card?.card_id}.png` : `big/${card?.img}`}`}
                            borderRadius="10px"
                        />
                        </Box>
                    </OpenAnimation>
                    <Flex flexDirection={"column"} ml={"30px"} flex="1" >
                        <Flex justifyContent="space-between" alignItems="center">
                            <Heading size="l" variant="italic">
                                {name}
                            </Heading>
                            <Image src={`/logos/jn-logo.png`}
                                    alt={"JN logo"}
                                    width="120px"
                                    />
                        </Flex>

                        <VStack align="stretch" spacing={8} flex={1}>
                            <Box mt={"20px"} >
                                <Text color="white" fontSize="lg" mb={2}
                                filter="blur(0.5px)"
                                  sx={{
                                    position: "relative",
                                    _before: {
                                      content: '""',
                                      position: "absolute",
                                      bottom: 0,
                                      width: "90%",
                                      height: "2px",               
                                      backgroundColor: "white",
                                      boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                                    },
                                  }}
                                >
                                    CARD TYPE:
                                </Text>
                                <Text color="cyan.300" fontSize="xl">
                                    {card.isSpecial ? "Special" : "Normal"}
                                </Text>
                            </Box>
                            <Box>
                                <Text color="white" fontSize="lg" mb={2}
                                  filter="blur(0.5px)"
                                  sx={{
                                    position: "relative",
                                    _before: {
                                      content: '""',
                                      position: "absolute",
                                      bottom: 0,
                                      width: "90%",
                                      height: "2px",               
                                      backgroundColor: "white",
                                      boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                                    },
                                  }}
                                >
                                    DESCRIPTION:
                                </Text>
                                <Text color="cyan.300" fontSize="xl">
                                    {description}
                                </Text>
                                {card.temporary && (
                                    <Text variant="neonGreen" size="l" pt={2}>
                                    {getTemporalCardText(card.remaining)}
                                    </Text>
                                )}
                            </Box>
                            <Box flex={1} alignItems={"end"} display={"flex"} flexDir={"row"} 
                              filter="blur(0.5px)"
                              sx={{
                                position: "relative",
                                _before: {
                                  content: '""',
                                  position: "absolute",
                                  bottom: 0,
                                  width: "90%",
                                  height: "2px",               
                                  backgroundColor: "white",
                                  boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                                },
                              }}
                            >
                              <Flex flex={1} alignItems={"end"}
                                  filter="blur(0.5px)"
                                  sx={{
                                  position: "relative",
                                  _before: {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    width: "90%",
                                    height: "2px",               
                                    backgroundColor: "white",
                                    boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                                  },
                                  }}
                              >
                                <Text color="white" fontSize="lg">
                                    MY COINS:
                                </Text>
                                <Text color="white" fontSize="xl">
                                    {cash} ¢
                                </Text>
                              </Flex>
                            </Box>
                        </VStack>
                    </Flex>
                </Flex>
            </Flex>

            <Flex width="60%" gap={4} m={1000} mt={6}
            justifyContent={"space-between"} margin={"0 auto"} >
                <Flex 
                borderRadius="18px"
                boxShadow={`0px 0px 10px 1px ${white}`}
                // pr={80}
                // py={1}
                // justifyContent="center"
                alignItems="center"
                flex={1}            
                >
                    <Text ml={"30px"} color="white" fontSize="2xl" fontWeight="bold" >
                        PRICE: {card.price} ¢
                    </Text>
                </Flex>

                <HStack gap={4}>
                {notEnoughCash || noSpaceForSpecialCards ? (
                        <Tooltip
                            label={
                            noSpaceForSpecialCards
                                ? "You don't have enough space for another special card. Remove one to buy this card"
                                : "You don't have enough coins to buy this card"
                            }
                        >
                            {buyButton}
                        </Tooltip>
                        ) : (
                        buyButton
                        )}
                        
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            Close
                        </Button>
                </HStack>
            </Flex>
        </Flex>
    </Background>
  );
};

export default PreviewCard;
