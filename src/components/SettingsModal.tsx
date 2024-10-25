import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";

import { useTranslation } from "react-i18next";
import { NEON_PINK } from "../theme/colors";
import React from "react";

export const SettingsModal = () => {
  const { t } = useTranslation(["game"]);
  const title = "Settings";
  const languageLbl = "Language";
  const sfxLbl = "Sfx";
  const musicLbl = "Music";
  const animSpeedLbl = "Animation speed";

  const saveSettings = () => {};

  const languages = [
    {
      value: "english",
      label: "English",
    },
    {
      value: "spanish",
      label: "Spanish",
    },
  ];

  return (
    <Modal isOpen={true} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="m" variant="neonWhite">
            {title}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={4} flexDirection="column">
            <Flex gap={2}>
              <Text size="md">{languageLbl}</Text>
              <Select placeholder="Select option">
                {languages.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </Select>
            </Flex>
            <Flex gap={2}>
              <Text size="md">{sfxLbl}</Text>
              <Slider defaultValue={50}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex>
            <Flex gap={2}>
              <Text size="md">{musicLbl}</Text>
              <Slider defaultValue={50}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex>
            <Flex gap={2}>
              <Text size="md">{animSpeedLbl}</Text>
              <Select size="lg" variant="outline" focusBorderColor="teal.500">
                <option value="2">Faster</option>
                <option value="1">Normal</option>
                <option value="0.5">Slower</option>
              </Select>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondarySolid"
            boxShadow={`0px 0px 10px 6px ${NEON_PINK}`}
            size="sm"
            onClick={saveSettings}
            ml={3}
          >
            {t("confirmation-modal.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
