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
import { CARD_WIDTH } from "../constants/visualProps.ts";
import { getCardData } from "../utils/getCardData";
import { getTemporalCardText } from "../utils/getTemporalCardText.ts";
import { isMobile } from "react-device-detect";
import { useGame } from "../dojo/queries/useGame.tsx";
import { useStore } from "../providers/StoreProvider";
import { Background } from "../components/Background";
import theme from "../theme/theme";
import Coins from "../assets/coins.svg?component"
import OpenAnimation from "../components/OpenAnimation.tsx";
import { useState } from "react";

const SIZE_MULTIPLIER = isMobile ? 1.3 : 2;
const { white, neonGreen } = theme.colors;

const PreviewCard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { card, isPack, pack } = state || {};
  const [isOpenAnimationRunning, setIsOpenAnimationRunning] =
    useState<boolean>(false);

  const handleAnimationEnd = () => {
    setIsOpenAnimationRunning(false);
    setLockRedirection(false);
    close();
    navigate("/open-pack");
  };
  
  if (!card) {
    return <p>Card not found.</p>;
  }

  const game = useGame();
  const { buyCard, buyPack, locked, setLockRedirection } = useStore();
  const cash = game?.cash ?? 0;
  const { name, description, details } = getCardData(card, isPack);
  const specialMaxLength = game?.len_max_current_special_cards ?? 0;
  const specialLength = game?.len_current_special_cards ?? 0;

  const notEnoughCash = !card.price || cash < card.price;
  const noSpaceForSpecialCards =
    card.isSpecial && specialLength >= specialMaxLength;

  const buyButton = (
    <Button
      onClick={() => {
        if (isPack) {
          buyPack(pack);
          setIsOpenAnimationRunning(true);
          setLockRedirection(true);
        }
        else{
          buyCard(card);
          navigate(-1);
        } 
      }}
      isDisabled={notEnoughCash || noSpaceForSpecialCards || locked}
      variant="outlinePrimaryGlow"
      height={"100%"}
    >
      BUY
    </Button>
  );

  return (
    <Background type="home" dark>
        <Flex flexDirection={"column"} 
        justifyContent={"center"} height={"100vh"}>
            <Flex 
              flexDirection={"column"} 
              justifyContent={"center"} 
              width="60%"
              margin={"0 auto"} 
              bg="rgba(0, 0, 0, 0.6)"
              borderRadius="25px"
              p={6}
              boxShadow={`0px 0px 10px 1px ${white}`}
            >
                <Flex>
                        <Box width={`${CARD_WIDTH * SIZE_MULTIPLIER + 30}px`}>
                          <OpenAnimation 
                            startAnimation={isOpenAnimationRunning}
                            onAnimationEnd={() => handleAnimationEnd()}>
                            <Image
                                src={isPack ? `Cards/${card.img}.png` : `Cards/${card.isSpecial || card.isModifier ? `effect/big/${card?.card_id}.png` : `big/${card?.img}`}`}
                                borderRadius="10px"
                            />
                          </OpenAnimation>
                        </Box>
                        
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
                            {!isPack && (
                              <Box mt={"20px"} >
                                <Text color="white" fontSize="lg" mb={2}
                                    sx={{
                                      position: "relative",
                                      _before: {
                                        content: '""',
                                        position: "absolute",
                                        bottom: 0,
                                        width: "95%",
                                        height: "2px",               
                                        backgroundColor: "white",
                                        boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                                      },
                                    }}
                                  >
                                      CARD TYPE:
                                  </Text>
                                  <Text color={neonGreen} fontSize="xl">
                                    {card.isSpecial ? "Special" 
                                    : card.isModifier ? "Modifier"
                                    : "Traditional"}
                                    {card.temporary && " (temporary)"}
                                  </Text>
                              </Box>
                            )}
                            <Box>
                                <Text color="white" fontSize="lg" mb={2}
                                  sx={{
                                    position: "relative",
                                    _before: {
                                      content: '""',
                                      position: "absolute",
                                      bottom: 0,
                                      width: "95%",
                                      height: "2px",               
                                      backgroundColor: "white",
                                      boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                                    },
                                  }}
                                >
                                    DESCRIPTION:
                                </Text>
                                <Text color={neonGreen} fontSize="xl">
                                    {description}
                                </Text>
                                {card.temporary && (
                                    <Text variant="neonGreen" size="l" pt={2}>
                                    {getTemporalCardText(card.remaining)}
                                    </Text>
                                )}
                            </Box>

                            {isPack && (
                              <Box>
                                <Text color="white" fontSize="lg" mb={2}
                                  filter="blur(0.5px)"
                                    sx={{
                                      position: "relative",
                                      _before: {
                                        content: '""',
                                        position: "absolute",
                                        bottom: 0,
                                        width: "95%",
                                        height: "2px",               
                                        backgroundColor: "white",
                                        boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                                      },
                                    }}
                                  >
                                      DETAILS:
                                  </Text>
                                  <Text color={neonGreen} fontSize="xl">
                                  {details?.split("\n").map((line, index) => (
                                    <span key={index}>
                                      {line}
                                      <br />
                                    </span>
                                  ))}
                                  </Text>
                              </Box>
                            )}
                            <Box flex={1} alignItems={"end"} display={"flex"} flexDir={"row"}
                              sx={{
                                position: "relative",
                                width: "60%",
                                _before: {
                                  content: '""',
                                  position: "absolute",
                                  bottom: 0,
                                  width: "100%",
                                  height: "2px",               
                                  backgroundColor: "white",
                                  boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                                },
                              }}
                            >
                              <Flex flex={1} alignItems={"end"} justifyContent={"space-between"} 
                                  sx={{
                                    paddingTop: "8px",
                                    paddingBottom: "8px",
                                    position: "relative",
                                    _before: {
                                      content: '""',
                                      position: "absolute",
                                      top: 0,
                                      width: "100%",
                                      height: "2px",               
                                      backgroundColor: "white",
                                      boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                                    },
                                  }}
                              >
                                <Flex>
                                  <Box mr={2}>
                                    <Coins width={"18px"} height={"auto"}/>
                                  </Box>
                                  <Text color="white" fontSize="lg">
                                      MY COINS:
                                  </Text>
                                </Flex>
                                <Text color="white" fontSize="xl">
                                    {cash} ¢
                                </Text>
                              </Flex>
                            </Box>
                        </VStack>
                    </Flex>
                </Flex>
            </Flex>

            <Flex 
              width="60%"
              gap={4} 
              m={1000} 
              mt={8}
              justifyContent={"space-between"} 
              margin={"0 auto"} 
            >
              <Flex 
                borderRadius="15px"
                boxShadow={`0px 0px 10px 1px ${white}`}
                bg={"rgba(0, 0, 0, 0.3)"}
                pl={8}
                py={"2px"}
                alignItems="center"
                flex={1}            
              >
                  <Heading size="m" variant="italic">
                    PRICE: {card.price} 
                  </Heading>
                  <Heading size="xl" pb={1}>¢</Heading>
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
                        
                        <Button variant="outlineSecondaryGlow" onClick={() => navigate(-1)} height={"100%"}>
                            Close
                        </Button>
                </HStack>
            </Flex>
        </Flex>
    </Background>
  );
};

export default PreviewCard;
