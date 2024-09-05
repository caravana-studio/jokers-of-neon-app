import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import OpenAnimation from "../components/OpenAnimation.tsx";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { getCardData } from "../utils/getCardData";
import { getTemporalCardText } from "../utils/getTemporalCardText.ts";
import { isMobile } from "react-device-detect";
import { useGame } from "../dojo/queries/useGame.tsx";
import { useStore } from "../providers/StoreProvider";
import { Card } from "../types/Card";

const SIZE_MULTIPLIER = isMobile ? 1.3 : 2;

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
      sx={{ width: "50%" }}
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
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Heading size="l" variant="italic">
        {name}
      </Heading>

      <OpenAnimation
        startAnimation={isOpenAnimationRunning}
        onAnimationEnd={handleAnimationEnd}
      >
        <Box width={`${CARD_WIDTH * SIZE_MULTIPLIER + 30}px`} mb={4}>
          <Image
            src={isPack ? `Cards/${card.img}.png` : `Cards/${card.isSpecial || card.isModifier ? `effect/big/${card?.card_id}.png` : `big/${card?.img}`}`}
            borderRadius="10px"
          />
        </Box>
      </OpenAnimation>

      <Text variant="neonGreen" size="l">
        {description}
      </Text>
      {card.temporary && (
        <Text variant="neonGreen" size="l" pt={2}>
          {getTemporalCardText(card.remaining)}
        </Text>
      )}

      <Flex gap={4} mb={2}>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Close
        </Button>
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
      </Flex>
    </Flex>
  );
};

export default PreviewCard;
