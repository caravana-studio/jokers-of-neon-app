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
  Tooltip,
} from "@chakra-ui/react";
import { useGameContext } from "../../providers/GameProvider";
import { useStore } from "../../providers/StoreProvider";
import { useGetGame } from "../../queries/useGetGame";
import { Card } from "../../types/Card";
import { getCardData } from "../../utils/getCardData";

interface IShowCardModalProps {
  card: Card;
  close: () => void;
  onBuyClick: (idx: number) => void;
}

export const ShowCardModal = ({
  card,
  close,
  onBuyClick,
}: IShowCardModalProps) => {
  const { name, description } = getCardData(card);
  const { cash } = useStore();
  const { gameId } = useGameContext();
  const { data: game } = useGetGame(gameId);
  const specialMaxLength = game?.len_max_current_special_cards ?? 0;
  const specialLength = game?.len_current_special_cards ?? 0;

  const notEnoughCash = !card.price || cash < card.price;
  const noSpaceForSpecialCards = card.isSpecial &&specialLength >= specialMaxLength;

  const buyButton = (
    <Button
      onClick={() => {
        onBuyClick(card.idx);
        close();
      }}
      sx={{ width: "50%" }}
      isDisabled={notEnoughCash || noSpaceForSpecialCards}
    >
      BUY
    </Button>
  );

  return (
    <Modal size="xxl" isOpen={true} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="l" variant="neonWhite">
            {name}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={8} width="100%">
            <Image src={`Cards/${card?.img}`} />
            <Flex flexDirection="column" gap={8} width="100%">
              <Box>
                <Heading color="white" size="m">
                  card type:
                </Heading>
                <Heading variant="neonGreen" size="m">
                  {card.isSpecial
                    ? "special"
                    : card.isModifier
                      ? "modifier"
                      : "traditional"}
                </Heading>
              </Box>
              <Box>
                <Heading color="white" size="m">
                  description:
                </Heading>
                <Heading variant="neonGreen" size="m">
                  {description}
                </Heading>
              </Box>
              <Box>
                <Heading color="white" size="m">
                  price:
                </Heading>
                <Heading variant="neonGreen" size="l">
                  {card.price}ȼ
                </Heading>
              </Box>
              <Flex gap={4} width="100%">
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
