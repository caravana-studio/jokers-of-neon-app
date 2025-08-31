import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { Icons } from "../../constants/icons";
import { getUserSpecialCards } from "../../dojo/queries/getUserSpecialCards";
import { useDojo } from "../../dojo/useDojo";
import { useUsername } from "../../dojo/utils/useUsername";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import CollectionGrid from "./Collection";
import { Collection } from "./types";
export const MyCollectionPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const {
    setup: { client, useBurnerAcc },
    switchToController,
  } = useDojo();

  const [isLoading, setIsLoading] = useState(true);
  const [myCollection, setMyCollection] = useState<Collection[]>([]);

  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-collection",
  });

  const loggedInUser = useUsername();

  useEffect(() => {
    if (loggedInUser) {
      getUserSpecialCards(client, loggedInUser).then((collections) => {
        setIsLoading(false);
        setMyCollection(collections);
      });
    }
  }, [loggedInUser]);

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
          {useBurnerAcc ? (
            <Flex
              w="100%"
              h="100%"
              flexDir="column"
              gap={5}
              justifyContent="center"
              alignItems="center"
            >
              <Text size="lg">{t("no-collection")}</Text>
              <Button size={["md", "sm"]} onClick={() => switchToController()}>
                {t("login")}
                <img
                  src={Icons.CARTRIDGE}
                  width={"16px"}
                  style={{ marginLeft: "8px" }}
                />
              </Button>
            </Flex>
          ) : isLoading ? (
            <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
              <Spinner color="white" />
            </Flex>
          ) : (
            myCollection.map((collection) => (
              <CollectionGrid key={collection.id} collection={collection} />
            ))
          )}
        </Flex>
        <Box h="50px" />
      </Flex>
    </DelayedLoading>
  );
};
