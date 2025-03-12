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
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";

import { useTranslation } from "react-i18next";
import { NEON_PINK } from "../theme/colors";
import { useAudioPlayer } from "../providers/AudioPlayerProvider";
import AudioPlayer from "./AudioPlayer";
import { MdArrowDropDown, MdGraphicEq } from "react-icons/md";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Speed } from "../enums/settings";
import { useState } from "react";
import { languageMap } from "../constants/language";
import {
  animationSpeedLabels,
  lootboxTransitionLabels,
} from "../constants/settingsLabels";
import { useSettings } from "../providers/SettingsProvider";

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
    lootboxTransition,
    setLootboxTransition,
  } = useSettings();
  const { musicVolume, setMusicVolume, isPlaying } = useAudioPlayer();
  const { isSmallScreen } = useResponsiveValues();

  const { t, i18n } = useTranslation(["game"], { keyPrefix: "settings-modal" });
  const { t: tGeneral } = useTranslation(["game"]);

  const title = t("title");
  const languageLbl = t("language");
  const sfxLbl = t("sfx-volume");
  const musicLbl = t("music-volume");
  const animSpeedLbl = t("anim-speed");
  const lootboxTransitionLbl = t("loot-box-transition");

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
              <Menu variant={"menuOutline"}>
                <MenuButton width={"100%"}>
                  <Flex alignItems="center" gap={2}>
                    <MdArrowDropDown /> {languageMap[selectedLanguage]}
                  </Flex>
                </MenuButton>
                <MenuList zIndex={10000}>
                  {Object.keys(languageMap).map((languageKey) => {
                    return (
                      <MenuItem onClick={() => changeLanguage(languageKey)}>
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
              <Menu variant={"menuOutline"}>
                <MenuButton width={"100%"}>
                  <Flex alignItems="center" gap={2}>
                    <MdArrowDropDown />{" "}
                    {t(animationSpeedLabels[animationSpeed])}
                  </Flex>
                </MenuButton>
                <MenuList zIndex={10000}>
                  {Object.entries(animationSpeedLabels).map(
                    ([speedKey, label]) => {
                      const speed = speedKey as Speed;
                      return (
                        <MenuItem
                          key={speed}
                          onClick={() => setAnimationSpeed(speed)}
                        >
                          {t(label)}
                        </MenuItem>
                      );
                    }
                  )}
                </MenuList>
              </Menu>
            </Flex>
            <Flex gap={2} alignItems={"center"}>
              <Text size="md" width={"50%"}>
                {lootboxTransitionLbl}
              </Text>
              <Menu variant={"menuOutline"}>
                <MenuButton width={"100%"}>
                  <Flex alignItems="center" gap={2}>
                    <MdArrowDropDown />{" "}
                    {t(lootboxTransitionLabels[lootboxTransition])}
                  </Flex>
                </MenuButton>
                <MenuList zIndex={10000}>
                  {Object.entries(lootboxTransitionLabels).map(
                    ([color, label]) => {
                      return (
                        <MenuItem
                          key={color}
                          onClick={() => setLootboxTransition(color)}
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
            {tGeneral("confirmation-modal.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
