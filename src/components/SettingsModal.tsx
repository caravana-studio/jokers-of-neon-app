import {
  Box,
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
import AudioPlayer from "./AudioPlayer";
import { MdGraphicEq } from "react-icons/md";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Speed } from "../enums/speed";

interface SettingsModalProps {
  close?: () => void;
}

export const SettingsModal = ({ close }: SettingsModalProps) => {
  const {
    sfxVolume,
    setSfxVolume,
    sfxOn,
    setSfxOn,
    animationSpeed,
    setAnimationSpeed,
  } = useGameContext();
  const { musicVolume, setMusicVolume, isPlaying } = useAudioPlayer();
  const { isSmallScreen } = useResponsiveValues();

  const { t, i18n } = useTranslation(["game"]);
  const title = t("settings-modal.title");
  const languageLbl = t("settings-modal.language");
  const sfxLbl = t("settings-modal.sfx-volume");
  const musicLbl = t("settings-modal.music-volume");
  const animSpeedLbl = t("settings-modal.anim-speed");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Modal isOpen={true} onClose={close || (() => {})} size={"xl"} isCentered>
      <ModalOverlay
        bg="blackAlpha.400"
        backdropFilter="auto"
        backdropBlur="5px"
      />
      <ModalContent width={isSmallScreen ? "100%" : "70%"}>
        <ModalHeader>
          <Heading size="m" variant="neonWhite">
            {title}
          </Heading>
        </ModalHeader>
        <ModalCloseButton onClick={close} />
        <ModalBody>
          <Flex gap={4} flexDirection="column">
            <Flex gap={2} alignItems={"center"}>
              <Text size={"md"} width={"50%"}>
                {languageLbl}
              </Text>
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
            <Flex gap={2} alignItems={"center"}>
              <Text size="md" width={"50%"}>
                {sfxLbl}
              </Text>
              <AudioPlayer
                sx={{
                  position: "relative",
                  bottom: "auto",
                  left: "auto",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
                isEnabled={sfxOn}
                onClick={() => setSfxOn(!sfxOn)}
              />
              <Slider
                min={0}
                max={1}
                step={0.25}
                value={sfxVolume}
                onChange={(value) => setSfxVolume(value)}
                isDisabled={!sfxOn}
              >
                <SliderTrack>
                  <SliderFilledTrack bg={NEON_PINK} />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                  <Box color={NEON_PINK} as={MdGraphicEq} />
                </SliderThumb>
              </Slider>
            </Flex>
            <Flex gap={2} alignItems={"center"}>
              <Text size="md" width={"50%"}>
                {musicLbl}
              </Text>
              <AudioPlayer
                sx={{
                  position: "relative",
                  bottom: "auto",
                  left: "auto",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
              />
              <Slider
                min={0}
                max={1}
                step={0.25}
                value={musicVolume}
                isDisabled={!isPlaying}
                onChange={(value) => setMusicVolume(value)}
              >
                <SliderTrack>
                  <SliderFilledTrack bg={NEON_PINK} />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                  <Box color={NEON_PINK} as={MdGraphicEq} />
                </SliderThumb>
              </Slider>
            </Flex>
            <Flex gap={2} alignItems={"center"}>
              <Text size="md" width={"50%"}>
                {animSpeedLbl}
              </Text>
              <Select
                size="lg"
                variant="outline"
                focusBorderColor="teal.500"
                value={animationSpeed}
                onChange={(evt) => setAnimationSpeed(evt.target.value as Speed)}
              >
                <option value={Speed.NORMAL}>
                  {t("settings-modal.speed.normal")}
                </option>
                <option value={Speed.FAST}>
                  {t("settings-modal.speed.fast")}
                </option>
                <option value={Speed.FASTEST}>
                  {t("settings-modal.speed.fastest")}
                </option>
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
