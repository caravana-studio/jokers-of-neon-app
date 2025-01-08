import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import { useState } from "react";
import { languageMap } from "../constants/language";
import { animationSpeedLabels } from "../constants/animationSpeed";

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
    setSelectedLanguage(lng);
    i18n.changeLanguage(lng);
  };

  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language.toString().substring(0, 2)
  );

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
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  bg="gray.800"
                  color="white"
                  width={"100%"}
                  variant={"defaultOutline"}
                >
                  {languageMap[selectedLanguage]}
                </MenuButton>
                <MenuList
                  bg="black"
                  color="white"
                  border="2px solid teal.500"
                  zIndex={10000}
                >
                  {Object.keys(languageMap).map((languageKey) => {
                    return (
                      <MenuItem
                        onClick={() => changeLanguage(languageKey)}
                        _focus={{
                          bg: "black",
                          border: "none",
                          boxShadow: "none",
                          outline: "none",
                        }}
                      >
                        {languageMap[languageKey]}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
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
                max={0.4}
                step={0.1}
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
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  bg="gray.800"
                  color="white"
                  width={"100%"}
                  variant={"defaultOutline"}
                >
                  {t(animationSpeedLabels[animationSpeed])}
                </MenuButton>
                <MenuList
                  bg="black"
                  color="white"
                  border="2px solid teal.500"
                  zIndex={10000}
                >
                  {Object.entries(animationSpeedLabels).map(
                    ([speedKey, label]) => {
                      const speed = speedKey as Speed;
                      return (
                        <MenuItem
                          key={speed}
                          onClick={() => setAnimationSpeed(speed)}
                          _focus={{
                            bg: "black",
                            border: "none",
                            boxShadow: "none",
                            outline: "none",
                          }}
                        >
                          {t(label)}
                        </MenuItem>
                      );
                    }
                  )}
                </MenuList>
              </Menu>
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
