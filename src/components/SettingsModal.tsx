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
import { useGameContext } from "../providers/GameProvider";
import { useAudioPlayer } from "../providers/AudioPlayerProvider";

interface SettingsModalProps {
  close?: () => void;
}

export const SettingsModal = ({ close }: SettingsModalProps) => {
  const {
    sfxVolume,
    setSfxVolume,
    animationSpeedMultiplier,
    setAnimationSpeedMultiplier,
  } = useGameContext();
  const { musicVolume, setMusicVolume } = useAudioPlayer();

  const { t, i18n } = useTranslation(["game"]);
  const title = "Settings";
  const languageLbl = "Language";
  const sfxLbl = "Sfx";
  const musicLbl = "Music";
  const animSpeedLbl = "Animation speed";

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Modal isOpen={true} onClose={close || (() => {})}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="m" variant="neonWhite">
            {title}
          </Heading>
        </ModalHeader>
        <ModalCloseButton onClick={close} />
        <ModalBody>
          <Flex gap={4} flexDirection="column">
            <Flex gap={2}>
              <Text size="md">{languageLbl}</Text>
              <Select
                size="lg"
                variant="outline"
                focusBorderColor="teal.500"
                onChange={(e) => changeLanguage(e.target.value)}
                defaultValue={i18n.language}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="pt">Português</option>
              </Select>
            </Flex>
            <Flex gap={2}>
              <Text size="md">{sfxLbl}</Text>
              <Slider
                min={0}
                max={1}
                step={0.25}
                value={sfxVolume}
                onChange={(value) => setSfxVolume(value)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex>
            <Flex gap={2}>
              <Text size="md">{musicLbl}</Text>
              <Slider
                min={0}
                max={1}
                step={0.25}
                value={musicVolume}
                onChange={(value) => setMusicVolume(value)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex>
            <Flex gap={2}>
              <Text size="md">{animSpeedLbl}</Text>
              <Select
                size="lg"
                variant="outline"
                focusBorderColor="teal.500"
                value={animationSpeedMultiplier}
                onChange={(evt) =>
                  setAnimationSpeedMultiplier(Number(evt.target.value))
                }
              >
                <option value={0.35}>x3</option>
                <option value={0.5}>x2</option>
                <option value={1}>x1</option>
              </Select>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondarySolid"
            boxShadow={`0px 0px 10px 6px ${NEON_PINK}`}
            size="sm"
            ml={3}
            onClick={close}
          >
            {t("confirmation-modal.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
