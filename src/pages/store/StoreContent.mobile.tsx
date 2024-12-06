import { Box, Flex, Heading } from "@chakra-ui/react";
import { PositionedGameMenu } from "../../components/GameMenu.tsx";
import { Coins } from "./Coins.tsx";
import { LootBoxes } from "./LootBoxes.tsx";
import { StoreCardsRow } from "./StoreCardsRow.tsx";
import LevelUpTable from "./StoreElements/LevelUpTable.tsx";
import RerollButton from "./StoreElements/RerollButton.tsx";
import SpecialsButton from "./StoreElements/SpecialsButton.tsx";
import NextLevelButton from "./StoreElements/NextLevelButton.tsx";
import { useTranslation } from "react-i18next";
import { SpecialSlotItem } from "./SpecialSlotItem.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { BurnItem } from "./BurnItem.tsx";
import SeeFullDeckButton from "./StoreElements/SeeFullDeckButton.tsx";
import { StoreTab } from "./StoreElements/StoreTab.tsx";
import { StoreTopBar } from "./StoreElements/StoreTopBar.tsx";
import { StoreBottomBar } from "./StoreElements/StoreBottomBar.tsx";

export const StoreContentMobile = () => {
  const { setRun, commonCards, modifierCards, specialCards } = useStore();

  const { t } = useTranslation(["store"]);

  return (
    <>
      {/* <PositionedGameMenu
        showTutorial={() => {
          setRun(true);
        }}
      /> */}
      <Flex
        width="100%"
        height="100vh"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <StoreTab></StoreTab>
        <StoreTopBar isSmallScreen={true}></StoreTopBar>
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="center"
          width="100%"
          overflow="scroll"
          pt={4}
          px={2}
        >
          <Box
            display="flex"
            w={["100%", "100%", "100%", "40%", "40%"]}
            flexDirection="column"
            pb={4}
          >
            <Flex flexDirection={"column"} gap={0} mb={4} mt={0}>
              <Heading
                variant="italic"
                size="l"
                ml={4}
                textAlign={{ base: "left", sm: "center" }}
              >
                {t("store.titles.level-game").toUpperCase()}
              </Heading>
              <Flex margin={{ base: "0", sm: "0 auto" }} mt={2}>
                <Coins rolling />
              </Flex>
            </Flex>
            <Flex justifyContent={{ base: "left", sm: "center" }}>
              <LootBoxes />
            </Flex>
          </Box>
          <Box
            width={{ base: "100%", sm: "auto" }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            pb={4}
            pl={4}
            gap={2}
          >
            <Box className="game-tutorial-step-3">
              {commonCards.length > 0 && (
                <StoreCardsRow
                  cards={commonCards}
                  title={t("store.titles.traditional")}
                />
              )}
            </Box>
            <Box className="game-tutorial-step-4">
              {modifierCards.length > 0 && (
                <StoreCardsRow
                  cards={modifierCards}
                  title={t("store.titles.modifiers")}
                />
              )}
            </Box>
            <Box className="game-tutorial-step-5">
              {specialCards.length > 0 && (
                <StoreCardsRow
                  cards={specialCards}
                  title={t("store.titles.special")}
                />
              )}
            </Box>
          </Box>
          <Flex mb={3} mx={4} flexDir={"row"} gap={5}>
            <SpecialSlotItem />
            <BurnItem />
          </Flex>
          <Box
            className="game-tutorial-step-2"
            width={{ base: "95%", sm: "75%" }}
            background="rgba(0,0,0,0.5)"
            px={4}
            borderRadius="10px"
          >
            <Heading variant="italic" size="m" mt={4}>
              {t("store.titles.improve-plays").toUpperCase()}
            </Heading>
            <LevelUpTable isSmallScreen={true} />
          </Box>

          <Box
            display="flex"
            flexDirection={"row-reverse"}
            w={"100%"}
            justifyContent={"center"}
            gap={10}
            px={2}
          >
            <Flex
              width="100%"
              mx={2}
              justifyContent="center"
              my={6}
              mb={12}
              gap={6}
            >
              <RerollButton isSmallScreen={true} />
              <SpecialsButton isSmallScreen={true} />
              <NextLevelButton isSmallScreen={true} />
              <SeeFullDeckButton isSmallScreen={true} />
            </Flex>
          </Box>
        </Box>
        <StoreBottomBar isSmallScreen={true}></StoreBottomBar>
      </Flex>
    </>
  );
};
