import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MODIFIERS_RARITY } from "../../data/modifiers";
import { getUserSpecialCards } from "../../dojo/queries/getUserSpecialCards";
import { useDojo } from "../../dojo/useDojo";
import { useUsername } from "../../dojo/utils/useUsername";
import { Tab, TabPattern } from "../../patterns/tabs/TabPattern";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
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

  const { modCardsConfig } = useGameStore();

  const { isSmallScreen } = useResponsiveValues();

  const loggedInUser = useUsername();
  const {
    setup: { client, useBurnerAcc },
  } = useDojo();

  useEffect(() => {
    if (useBurnerAcc) {
      setIsLoading(false);
      setMyCollection([]);
    } else {
      console.log("loggedInUser", loggedInUser);
      if (loggedInUser) {
        getUserSpecialCards(client, loggedInUser).then((collections) => {
          setIsLoading(false);
          console.log("collections", collections);
          setMyCollection(collections);
        });
      }
    }
  }, [loggedInUser, useBurnerAcc]);

  return (
    <DelayedLoading>
      <TabPattern lastIndexTab={lastIndexTab}>
        <Tab title={t("labels.special-cards")}>
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
                    ({modCardsConfig?.specialCardsIds?.length ?? ""})
                  </Text>
                </Flex>
              )}
            </Flex>
            <DocCardsContent cardIds={modCardsConfig?.specialCardsIds ?? []} />
          </Flex>
        </Tab>
        <Tab title={t("labels.modifier-cards")}>
          <DocsCardsRow cardIds={Object.keys(MODIFIERS_RARITY).map(Number)} />
        </Tab>
        <Tab title={t("labels.rage-cards")}>
          <DocsCardsRow cardIds={modCardsConfig?.rageCardsIds ?? []} />
        </Tab>
        <Tab title={t("labels.loot-boxes")}>
          <DocsBoxesRow />
        </Tab>
      </TabPattern>
    </DelayedLoading>
  );
};
