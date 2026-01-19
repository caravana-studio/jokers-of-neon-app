import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserCards } from "../../api/getUserCards";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useDojo } from "../../dojo/useDojo";
import { useInformationPopUp } from "../../providers/InformationPopUpProvider";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import CollectionGrid from "./Collection";
import { Collection } from "./types";
export const MyCollectionPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const {
    account: { account },
  } = useDojo();
  const { setInformation } = useInformationPopUp();

  const [isLoading, setIsLoading] = useState(true);
  const [myCollection, setMyCollection] = useState<Collection[]>([]);
  const [traditionalCollection, setTraditionalCollection] =
    useState<Collection>({
      id: -1,
      cards: [],
    });
  const [neonCollection, setNeonCollection] = useState<Collection>({
    id: -2,
    cards: [],
  });

  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-collection",
  });

  const infoContent = useMemo(
    () => (
      <VStack align="start" spacing={4}>
        <Heading size="sm" variant="italic">
          {t("intro.popup-title")}
        </Heading>
        <Divider borderColor={BLUE} />
        <VStack align="start" spacing={3}>
          <Text fontSize={{ base: "sm", md: "md" }}>{t("intro.points.1")}</Text>
          <Text fontSize={{ base: "sm", md: "md" }}>{t("intro.points.2")}</Text>
          <Text fontSize={{ base: "sm", md: "md" }}>{t("intro.points.3")}</Text>
          <Text fontSize={{ base: "sm", md: "md" }}>{t("intro.points.4")}</Text>
        </VStack>
      </VStack>
    ),
    [t]
  );

  useEffect(() => {
    if (account?.address) {
      getUserCards(account.address).then((data) => {
        setIsLoading(false);
        setMyCollection(data.specials);
        setTraditionalCollection(data.traditionals);
        setNeonCollection(data.neons);
      });
    }
  }, [account?.address]);

  return (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex
        h="100%"
        w="100%"
        pt={isSmallScreen ? "30px" : "80px"}
        flexDir="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="sm" variant={"italic"}>
          {t("title")}
        </Heading>
        <Divider my={3} borderColor={BLUE} />

        <Flex
          w="100%"
          h="100%"
          minH={0}
          flexGrow={1}
          flexDir="column"
          gap={4}
          overflowY="auto"
        >
          <Flex px={6} justifyContent="center">
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="gray.200"
              textAlign="center"
            >
              {t("intro.summary")}{" "}
              <Button
                variant="ghost"
                size="sm"
                display="inline-flex"
                verticalAlign="baseline"
                height="auto"
                minH="unset"
                py={0}
                px={2}
                lineHeight="inherit"
                onClick={() => setInformation(infoContent)}
              >
                {t("intro.learn-more")}
              </Button>
            </Text>
          </Flex>
          {isLoading ? (
            <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
              <Spinner color="white" />
            </Flex>
          ) : (
            myCollection.map((collection) => (
              <CollectionGrid key={collection.id} collection={collection} />
            ))
          )}
          <CollectionGrid
            collection={traditionalCollection}
            defaultOpen={false}
          />
          <CollectionGrid collection={neonCollection} defaultOpen={false} />
        </Flex>
        <Box h="50px" />
      </Flex>
    </DelayedLoading>
  );
};
