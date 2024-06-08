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
} from "@chakra-ui/react";
import { Card } from "../../types/Card";
import { getCardData } from "../../utils/getCardData";

interface IShowCardModalProps {
  card: Card;
  close: () => void;
}

export const ShowCardModal = ({ card, close }: IShowCardModalProps) => {
  const { name, description } = getCardData(card);
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
                <Button sx={{ width: "50%" }}>BUY</Button>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
