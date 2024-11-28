import { Flex, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../providers/GameProvider";
import { GREY_LINE } from "../theme/colors";
import CachedImage from "./CachedImage";

export const SpecialRageSwitcher = () => {
  const { t } = useTranslation(["game"]);

  const { isRageRound, specialSwitcherOn, toggleSpecialSwitcher } =
    useGameContext();
  return (
    <Flex
      border={`1px solid ${GREY_LINE}`}
      borderRadius={["12px", "20px"]}
      height={["60px", "110px"]}
      flexDir="column"
      justifyContent="center"
      gap={2}
      alignItems="center"
      width={["28px", "50px"]}
      position="absolute"
      right={["-15px", "-25px"]}
      backgroundColor={isRageRound ? "black" : "backgroundBlue"}
      zIndex={10}
    >
      <Tooltip placement="right" label={t("specials-box.specials-tooltip")}>
        <CachedImage
          cursor="pointer"
          src={`specials-box/special-icon-${specialSwitcherOn ? "on" : "off"}.png`}
          height={{ base: 5, sm: 8, md: 10 }}
          onClick={() => toggleSpecialSwitcher()}
        />
      </Tooltip>
      <Tooltip placement="right" label={t("specials-box.rage-tooltip")}>
        <CachedImage
          cursor="pointer"
          src={`specials-box/rage-icon-${specialSwitcherOn ? "off" : "on"}.png`}
          height={{ base: 5, sm: 8, md: 10 }}
          onClick={() => toggleSpecialSwitcher()}
        />
      </Tooltip>
    </Flex>
  );
};
