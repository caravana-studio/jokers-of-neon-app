import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserCards } from "../../api/getUserCards";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";
import { MODIFIERS_RARITY } from "../../data/modifiers";
import { fetchCardsConfig } from "../../dojo/queries/getCardsConfig";
import { useDojo } from "../../dojo/useDojo";
import { Tab, TabPattern } from "../../patterns/tabs/TabPattern";
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { isAndroidDevice } from "../../utils/capacitorUtils";
import CollectionGrid from "../MyCollection/Collection";
import { Collection } from "../MyCollection/types";
import { DocsBoxesRow } from "./DocsBoxesRow";
import { DocCardsContent, DocsCardsRow } from "./DocsCardsRow";

interface DocsProps {
  lastIndexTab: number;
}

export const DocsPage: React.FC<DocsProps> = ({ lastIndexTab = 0 }) => {
  const { t } = useTranslation(["docs"]);
  const [isLoading, setIsLoading] = useState(true);
  const [myCollection, setMyCollection] = useState<Collection[]>([]);

  const { modCardsConfig, modId } = useGameStore();
  const [docsModCardsConfig, setDocsModCardsConfig] = useState(modCardsConfig);

  const { isSmallScreen } = useResponsiveValues();

  const { highlightedItem: highlightedCard } = useCardHighlight();

  const {
    account: { account },
    setup: { useBurnerAcc, client },
  } = useDojo();

  useEffect(() => {
    if (modCardsConfig) {
      setDocsModCardsConfig(modCardsConfig);
    }
  }, [modCardsConfig]);

  useEffect(() => {
    if (modCardsConfig || !client || !modId) return;

    let isMounted = true;
    fetchCardsConfig(client, modId)
      .then((config) => {
        if (isMounted) {
          setDocsModCardsConfig(config);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDocsModCardsConfig(undefined);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [client, modCardsConfig, modId]);

  useEffect(() => {
    if (useBurnerAcc) {
      setIsLoading(false);
      setMyCollection([]);
    } else {
      getUserCards(account.address).then((data) => {
        setIsLoading(false);
        setMyCollection(data.specials);
      });
    }
  }, [account.address, useBurnerAcc]);

  const specialCardsIds = docsModCardsConfig?.specialCardsIds ?? [];
  const rageCardsIds = docsModCardsConfig?.rageCardsIds ?? [];
  const shouldShowLootBoxesTab = !isAndroidDevice;
  const initialTabIndex = shouldShowLootBoxesTab
    ? lastIndexTab
    : Math.min(lastIndexTab, 2);
  const tabs = [
    <Tab key="special-cards" title={t("labels.special-cards")}>
      <Flex
        width={isSmallScreen ? "100%" : "90%"}
        height={["90%"]}
        margin={"0 auto"}
        my={[4, 2]}
        flexDirection="row"
        alignItems={"center"}
        justifyContent={"center"}
        alignContent={"flex-start"}
        wrap={"wrap"}
        gap={2}
        overflow={"auto"}
        pt={isSmallScreen ? 0 : 2}
      >
        {!useBurnerAcc ? (
          isLoading ? (
            <Flex
              w="100%"
              h="200px"
              justifyContent="center"
              alignItems="center"
            >
              <Spinner color="white" />
            </Flex>
          ) : (
            myCollection.map((collection) => (
              <CollectionGrid
                key={collection.id}
                collection={collection}
                hideHighlight
              />
            ))
          )
        ) : (
          <></>
        )}
        <Flex
          w="100%"
          flexDirection={"column"}
          px={6}
          py={useBurnerAcc ? 0 : 4}
        >
          {!useBurnerAcc && (
            <Flex>
              <Heading variant="italic" size="xs">
                {t("base-cards")}
              </Heading>
              <Text ml={2} fontSize="8px" color="gray.400">
                ({specialCardsIds.length})
              </Text>
            </Flex>
          )}
        </Flex>
        <DocCardsContent cardIds={specialCardsIds} />
      </Flex>
    </Tab>,
    <Tab key="modifier-cards" title={t("labels.modifier-cards")}>
      <DocsCardsRow cardIds={Object.keys(MODIFIERS_RARITY).map(Number)} />
    </Tab>,
    <Tab key="rage-cards" title={t("labels.rage-cards")}>
      <DocsCardsRow cardIds={rageCardsIds} />
    </Tab>,
  ];

  if (shouldShowLootBoxesTab) {
    tabs.push(
      <Tab key="loot-boxes" title={t("labels.loot-boxes")}>
        <DocsBoxesRow />
      </Tab>
    );
  }

  return (
    <DelayedLoading>
      {highlightedCard && (
        <MobileCardHighlight
          card={highlightedCard as Card}
          showExtraInfo
          isPack={!highlightedCard.img}
        />
      )}
      <TabPattern lastIndexTab={initialTabIndex}>
        {tabs}
      </TabPattern>
    </DelayedLoading>
  );
};
