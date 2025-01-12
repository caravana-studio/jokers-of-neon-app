import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { PositionedDiscordLink } from "../../components/DiscordLink.tsx";
import { PositionedGameMenu } from "../../components/GameMenu.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { BurnItem } from "./BurnItem.tsx";
import { Coins } from "./Coins.tsx";
import { LootBoxes } from "./LootBoxes.tsx";
import { SpecialSlotItem } from "./SpecialSlotItem.tsx";
import { StoreCardsRow } from "./StoreCardsRow.tsx";
import LevelUpTable from "./StoreElements/LevelUpTable.tsx";
import NextLevelButton from "./StoreElements/NextLevelButton.tsx";
import RerollButton from "./StoreElements/RerollButton.tsx";
import SeeFullDeckButton from "./StoreElements/SeeFullDeckButton.tsx";
import SpecialsButton from "./StoreElements/SpecialsButton.tsx";
import { StorePowerUpsRow } from "./StorePowerUpsRow.tsx";

export const StoreContent = () => {
  const { setRun, specialCards, commonCards, modifierCards } = useStore();

  const { t } = useTranslation(["store"]);

  return (
    <>
      <PositionedGameMenu
        showTutorial={() => {
          setRun(true);
        }}
      />
      <Flex
        width="100%"
        height="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Flex
          display="flex"
          flexWrap="nowrap"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          overflow={"auto"}
          pt={0}
          px={{ md: 0, lg: 4 }}
          overflowY={"hidden"}
        >
          <Box
            h="100%"
            display="flex"
            w={"40%"}
            flexDirection="column"
            justifyContent="space-between"
            pb={0}
            pt={0}
            pl={"2%"}
          >
            <Heading variant="italic" ml={4}>
              {t("store.titles.level-game").toUpperCase()}
            </Heading>
            <LootBoxes />
            <Flex mt={8}>
              <LevelUpTable />
            </Flex>
          </Box>
          <Box
            w={"auto"}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems={"flex-start"}
            pb={0}
            gap={6}
          >
            <Box className="game-tutorial-step-3">
              {commonCards.length > 0 && (
                <StoreCardsRow cards={commonCards} title={"traditional"} />
              )}
            </Box>
            <Flex gap={4} w="100%">
              <Box w="70%" className="game-tutorial-step-4">
                {modifierCards.length > 0 && (
                  <StoreCardsRow cards={modifierCards} title={"modifiers"} />
                )}
              </Box>
              <Box w="30%" className="game-tutorial-step-4">
                <StorePowerUpsRow />
              </Box>
            </Flex>
            <Box className="game-tutorial-step-5" mb={4}>
              {specialCards.length > 0 && (
                <StoreCardsRow cards={specialCards} title={"special"} />
              )}
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection={"column"}
            w={"20%"}
            h={"100%"}
            justifyContent={"space-between"}
            px={0}
            pr={"2%"}
          >
            <>
              <NextLevelButton isSmallScreen={false} />
              <Flex flexDirection={"row"} gap={10}>
                <SpecialSlotItem />
                <BurnItem />
              </Flex>

              <Flex flexDirection="column" gap={14}>
                <RerollButton />
                <SpecialsButton isSmallScreen={false} />
                <SeeFullDeckButton isSmallScreen={false} />
                <Coins />
              </Flex>
            </>
          </Box>
        </Flex>
      </Flex>
      <PositionedDiscordLink />
    </>
  );
};
