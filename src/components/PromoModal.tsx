import {
  Flex,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  type FlexProps,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ReactNode } from "react";

const coinPulse = keyframes`
  0% {
    transform: scale(1.5) rotate(0deg);
  }
  50% {
    transform: scale(1.6) rotate(3deg);
  }
  100% {
    transform: scale(1.5) rotate(0deg);
  }
`;

const coinPulseBack = keyframes`
  0% {
    transform: scale(1.3) rotate(0deg);
  }
  50% {
    transform: scale(1.4) rotate(-3deg);
  }
  100% {
    transform: scale(1.3) rotate(0deg);
  }
`;

export interface CoinsDecorationProps {
  top?: string;
  left?: string;
  transform?: string;
  width?: string;
  maxW?: string;
  pointerEvents?: FlexProps["pointerEvents"];
  zIndex?: number;
  imageWidth?: string;
  imageHeight?: string;
}

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: string;
  closeButtonColor?: string;
  children: ReactNode;
}

export const CoinsDecoration = ({
  top = "0",
  left,
  transform,
  width = "60%",
  maxW,
  pointerEvents = "none",
  zIndex = 4,
  imageWidth,
  imageHeight,
}: CoinsDecorationProps) => {
  return (
    <Flex
      position="absolute"
      top={top}
      left={left}
      transform={transform}
      w={width}
      maxW={maxW}
      pointerEvents={pointerEvents}
      zIndex={zIndex}
    >
      <Image
        src="/shop/season-pass/coins-front.png"
        position="absolute"
        animation={`${coinPulse} 4s ease-in-out infinite`}
        transformOrigin="center"
        zIndex={2}
        w={imageWidth}
        h={imageHeight}
      />
      <Image
        src="/shop/season-pass/coins-back.png"
        zIndex={0}
        opacity={0.6}
        position="absolute"
        animation={`${coinPulseBack} 4s ease-in-out infinite`}
        transformOrigin="center"
        w={imageWidth}
        h={imageHeight}
      />
    </Flex>
  );
};

export const PromoModal = ({
  isOpen,
  onClose,
  size = "4xl",
  closeButtonColor,
  children,
}: PromoModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      trapFocus={false}
      autoFocus={false}
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
      <ModalContent p={3} overflow="visible" position="relative">
        <ModalCloseButton m={4} color={closeButtonColor} />
        {children}
      </ModalContent>
    </Modal>
  );
};
