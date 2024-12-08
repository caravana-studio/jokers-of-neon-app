import { Box, Flex, Heading, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MobileBottomBar } from "../../components/MobileBottomBar.tsx";
import { MobileDecoration } from "../../components/MobileDecoration.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { BurnItem } from "./BurnItem.tsx";
import { Coins } from "./Coins.tsx";
import { LootBoxes } from "./LootBoxes.tsx";
import { SpecialSlotItem } from "./SpecialSlotItem.tsx";
import { StoreCardsRow } from "./StoreCardsRow.tsx";
import LevelUpTable from "./StoreElements/LevelUpTable.tsx";
import NextLevelButton from "./StoreElements/NextLevelButton.tsx";
import SpecialsButton from "./StoreElements/SpecialsButton.tsx";
import { StoreTopBar } from "./StoreElements/StoreTopBar.tsx";
import { StorePowerUpsRow } from "./StorePowerUpsRow.tsx";

export const StoreContentMobile = () => {
  const { commonCards, modifierCards, specialCards, setRun } = useStore();

  const { t } = useTranslation(["store"]);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <>
      <MobileDecoration />

      <Flex
        width="100%"
        height="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Flex p={2} mt={6} width={"95%"}>
          <Tabs
            index={tabIndex}
            onChange={handleTabChange}
            w="100%"
            isFitted
            color="white"
          >
            <TabList>
              <Tab fontSize={10}>{t("store.labels.cards")}</Tab>
              <Tab fontSize={10}>{t("store.labels.loot-boxes")}</Tab>
              <Tab fontSize={10}>{t("store.labels.utilities")}</Tab>
            </TabList>
          </Tabs>
        </Flex>
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
            <Flex>
              <Box w="60%" className="game-tutorial-step-4">
                {modifierCards.length > 0 && (
                  <StoreCardsRow
                    cards={modifierCards}
                    title={t("store.titles.modifiers")}
                  />
                )}
              </Box>
              <Box w="40%">
                <StorePowerUpsRow />
              </Box>
            </Flex>
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
            ></Flex>
          </Box>
        </Box>
        <MobileBottomBar
          setRun={setRun}
          firstButton={<SpecialsButton isSmallScreen={true} />}
          secondButton={<NextLevelButton isSmallScreen={true} />}
        />
      </Flex>
    </>
  );
};
