import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

import CachedImage from "../../components/CachedImage.tsx";

import { useLocation, useNavigate } from "react-router-dom";
import { CARD_WIDTH } from "../../constants/visualProps.ts";
import { useStore } from "../../providers/StoreProvider.tsx";
import theme from "../../theme/theme.ts";
import { getTemporalCardText } from "../../utils/getTemporalCardText.ts";
import { Coins } from "../store/Coins.tsx";

import { useTranslation } from "react-i18next";
import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { useCustomNavigate } from "../../hooks/useCustomNavigate.tsx";
import { useCardData } from "../../providers/CardDataProvider.tsx";
import { useGameStore } from "../../state/useGameStore.ts";
import { useShopStore } from "../../state/useShopStore.ts";

const SIZE_MULTIPLIER = 2;
const { white, neonGreen } = theme.colors;

const PreviewCardLayout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const customNavigate = useCustomNavigate();

  const { card, isPack, pack } = state || {};

  const [buyDisabled, setBuyDisabled] = useState(false);
  const { t } = useTranslation(["store"]);
  /*   const [isOpenAnimationRunning, setIsOpenAnimationRunning] =
    useState<boolean>(false); */

  /*   const handleAnimationEnd = () => {
    setIsOpenAnimationRunning(false);
    close();
    navigate("open-pack");
  }; */

  const { getCardData } = useCardData();
  const { cash, specialSlots, specialCards } = useGameStore();
  const { buyCard, buyPack } = useStore();
  const { locked } = useShopStore();

  if (!card) {
    return <p>Card not found.</p>;
  }

  const { name, description, details } = getCardData(card.card_id ?? 0);

  const notEnoughCash = !card.price || cash < card.price;
  const noSpaceForSpecialCards =
    card.isSpecial && specialCards.length >= specialSlots;

  const fontTitleSize = ["s", "s", "l"];
  const fontSize = ["md", "md", "xl"];
  const layoutWidth = ["95%", "90%", "70%"];

  const buyButton = (
    <Button
      onClick={() => {
        if (isPack) {
          setBuyDisabled(true);
          buyPack(pack)
            .then((response) => {
              if (response) {
                navigate("/open-loot-box");
              } else {
                setBuyDisabled(false);
              }
            })
            .catch(() => {
              setBuyDisabled(false);
            });
        } else {
          buyCard(card);
          customNavigate(GameStateEnum.Store);
        }
      }}
      isDisabled={
        notEnoughCash || noSpaceForSpecialCards || locked || buyDisabled
      }
      variant="outlinePrimaryGlow"
      height={"100%"}
    >
      {t("store.preview-card.labels.buy")}
    </Button>
  );

  return (
    <>
      <Flex flexDirection={"column"} justifyContent={"center"} height={"100vh"}>
        <Flex
          flexDirection={"column"}
          justifyContent={"center"}
          width={layoutWidth}
          margin={"0 auto"}
          bg="rgba(0, 0, 0, 0.6)"
          borderRadius="25px"
          p={6}
          boxShadow={`0px 0px 10px 1px ${white}`}
        >
          <Flex>
            <Box
              width={`${CARD_WIDTH * SIZE_MULTIPLIER + 30}px`}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
            >
              {/*               <OpenAnimation
                startAnimation={isOpenAnimationRunning}
                onAnimationEnd={() => handleAnimationEnd()}
              > */}
              <CachedImage
                src={
                  isPack
                    ? `Cards/${card.img}.png`
                    : `Cards/${card.isSpecial || card.isModifier ? `${card?.card_id}.png` : `${card?.img}`}`
                }
                alt={`Card: ${card.name}`} // Make sure to provide an appropriate alt text
                borderRadius="10px"
              />
              {/* </OpenAnimation> */}
            </Box>

            <Flex flexDirection={"column"} ml={"30px"} flex="1">
              <Flex justifyContent="space-between" alignItems="center">
                <Heading size={["md", "md", "l"]} variant="italic" mb={4}>
                  {name}
                </Heading>
                <CachedImage
                  src={`/logos/jn-logo.png`}
                  alt={"JN logo"}
                  width="120px"
                  display={["none", "none", "flex"]}
                />
              </Flex>

              <VStack align="stretch" spacing={8} flex={1}>
                {!isPack && (
                  <Box mt={"20px"}>
                    <Text
                      color="white"
                      fontSize={fontTitleSize}
                      mb={2}
                      sx={{
                        position: "relative",
                        _before: {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          width: "95%",
                          height: "2px",
                          backgroundColor: "white",
                          boxShadow:
                            "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                        },
                      }}
                    >
                      {t("store.preview-card.title.card-type")}
                    </Text>
                    <Text color={neonGreen} fontSize={fontSize}>
                      {card.isSpecial
                        ? t("store.preview-card.labels.special")
                        : card.isModifier
                          ? t("store.preview-card.labels.modifier")
                          : t("store.preview-card.labels.traditional")}
                      {card.temporary &&
                        " (" + t("store.preview-card.labels.temporary") + ")"}
                    </Text>
                  </Box>
                )}
                <Box>
                  <Text
                    color="white"
                    fontSize={fontTitleSize}
                    mb={2}
                    sx={{
                      position: "relative",
                      _before: {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        width: "95%",
                        height: "2px",
                        backgroundColor: "white",
                        boxShadow:
                          "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {t("store.preview-card.title.description")}
                  </Text>
                  <Text color={neonGreen} fontSize={fontSize}>
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
                    <Text
                      color="white"
                      fontSize={fontTitleSize}
                      mb={2}
                      sx={{
                        position: "relative",
                        _before: {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          width: "95%",
                          height: "2px",
                          backgroundColor: "white",
                          boxShadow:
                            "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                        },
                      }}
                    >
                      {t("store.preview-card.title.details")}
                    </Text>
                    <Text color={neonGreen} fontSize={fontSize}>
                      {details?.split("\n").map((line, index) => (
                        <span key={index}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </Text>
                  </Box>
                )}
                <Box
                  flex={1}
                  alignItems={"end"}
                  display={"flex"}
                  flexDir={"row"}
                >
                  <Heading size="m" variant="italic">
                    {t("store.preview-card.title.price")} {card.price}
                  </Heading>
                  <Heading size="m" ml={2}>
                    ¢
                  </Heading>
                </Box>
              </VStack>
            </Flex>
          </Flex>
        </Flex>

        <Flex
          width={layoutWidth}
          gap={4}
          m={1000}
          mt={8}
          justifyContent={"space-between"}
          margin={"0 auto"}
        >
          <Coins />
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

            <Button
              variant="outlineSecondaryGlow"
              onClick={() => navigate("/store")}
              height={"100%"}
            >
              {t("store.preview-card.labels.close")}
            </Button>
          </HStack>
        </Flex>
      </Flex>
    </>
  );
};

export default PreviewCardLayout;
