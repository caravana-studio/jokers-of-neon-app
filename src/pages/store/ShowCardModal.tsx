import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps.ts";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useStore } from "../../providers/StoreProvider";
import { Card } from "../../types/Card";
import { getCardData } from "../../utils/getCardData";
import { getTemporalCardText } from "../../utils/getTemporalCardText.ts";

interface IShowCardModalProps {
  card: Card;
  close: () => void;
  onBuyClick: (idx: number) => void;
}

const SIZE_MULTIPLIER = isMobile ? 1.3 : 2;

export const ShowCardModal = ({
  card,
  close,
  onBuyClick,
}: IShowCardModalProps) => {
  const game = useGame();
  const cash = game?.cash ?? 0;
  const { name, description } = getCardData(card);
  const { locked } = useStore();
  const specialMaxLength = game?.len_max_current_special_cards ?? 0;
  const specialLength = game?.len_current_special_cards ?? 0;

  const notEnoughCash = !card.price || cash < card.price;
  const noSpaceForSpecialCards =
    card.isSpecial && specialLength >= specialMaxLength;

  const buyButton = (
    <Button
      onClick={() => {
        onBuyClick(card.idx);
        close();
      }}
      sx={{ width: "50%" }}
      variant="secondarySolid"
      isDisabled={notEnoughCash || noSpaceForSpecialCards || locked}
    >
      BUY
    </Button>
  );

  return (
    <Modal size="xxl" isOpen={true} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="l" variant="italic">
            {name}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            gap={isMobile ? 2 : 8}
            width="100%"
            flexDirection={{ base: "column", sm: "row" }}
            alignItems="center"
          >
            <Box width={`${CARD_WIDTH * SIZE_MULTIPLIER + 30}px`} mb={4}>
              <Box
                p={"5px"}
                borderRadius={isMobile ? "10px" : "20px"}
                boxShadow={"0px 0px 20px 3px white"}
                width={`${CARD_WIDTH * SIZE_MULTIPLIER + 10}px`}
                height={`${CARD_HEIGHT * SIZE_MULTIPLIER + 10}px`}
              >
                <Image
                  borderRadius={{ base: "8px", sm: "15px" }}
                  width={`${CARD_WIDTH * SIZE_MULTIPLIER}px`}
                  height={`${CARD_HEIGHT * SIZE_MULTIPLIER}px`}
                  src={`Cards/${card.isSpecial || card.isModifier ? `effect/big/${card?.card_id}.png` : card?.img}`}
                />
              </Box>
            </Box>
            <Flex flexDirection="column" gap={isMobile ? 4 : 8} width="100%">
              <Box>
                <Heading color="white" size={isMobile ? "s" : "m"}>
                  card type:
                </Heading>
                <Text variant="neonGreen" size="l">
                  {card.isSpecial
                    ? "special"
                    : card.isModifier
                      ? "modifier"
                      : "traditional"}
                  {card.temporary && " (temporary)"}
                </Text>
              </Box>
              <Box>
                <Heading color="white" size={isMobile ? "s" : "m"}>
                  description:
                </Heading>
                <Text variant="neonGreen" size="l">
                  {description}
                </Text>
                {card.temporary && (
                  <Text variant="neonGreen" size="l" pt={2}>
                    {getTemporalCardText(card.remaining)}
                  </Text>
                )}
              </Box>
              <Flex gap={3}>
                <Heading color="white" size={isMobile ? "s" : "m"}>
                  price:
                </Heading>
                <Heading variant="neonGreen" size={isMobile ? "s" : "m"}>
                  {card.price}ȼ
                </Heading>
              </Flex>
              <Flex gap={4} mb={2}>
                <Button sx={{ width: "50%" }} variant="outline" onClick={close}>
                  close
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
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
