import { Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Trans, useTranslation } from "react-i18next";
import { useDojo } from "../dojo/DojoContext";
import { getGGQuestsCompleted } from "../dojo/queries/getGGQuestsCompleted";
import { AchievementCompleted } from "../types/ScoreData";
import { handleAchievementPush } from "../utils/pushAchievements";
import CachedImage from "./CachedImage";

export const GGBanner = () => {
  const { t } = useTranslation("game", { keyPrefix: "gg-banner" });
  const {
    setup: { client },
    account: { account },
  } = useDojo();

  const syncQuests = () => {
    console.log("syncing quests for user " + account?.address);
    getGGQuestsCompleted(client, account?.address).then((response) => {
      console.log("quests to sync: ", response);
      const achievementEvents: AchievementCompleted[] = response.map(
        (achievementId: string) => ({
          player: account?.address,
          achievementId,
        })
      );
      handleAchievementPush(achievementEvents, () => {}).then(()=> {
        console.log("achievements pushed");
      })
    });
  };
  return (
    <Flex
      flexDir="column"
      position="absolute"
      bottom={{ base: "unset", sm: "70px" }}
      top={{ base: "30px", sm: "unset" }}
      right={{ base: "10px", sm: "20px" }}
      width={{ base: "80%", sm: "400px" }}
      backgroundColor="rgba(0,0,0,0.5)"
      px={{ base: 6, sm: 8 }}
      py={{ base: 3, sm: 4 }}
      borderRadius="20px"
      zIndex={10}
      boxShadow="0px 0px 5px 0px #fff, 0px 0px 5px 0px #fff inset"
      gap={2}
    >
      <Flex flexDir="column" gap={4}>
        <Flex gap={3} alignItems="center">
          <CachedImage
            src="/logos/gg.png"
            height={{ base: "15px", sm: "22px" }}
          />
          <Heading variant="italic" fontSize={{ base: "12px", sm: "18px" }}>
            {t("title")}
          </Heading>
        </Flex>
        <Flex gap={2} justifyContent={"center"} alignItems={"center"}>
          <Text>
            <Trans
              t={t}
              i18nKey="description"
              components={[
                <Link
                  href="https://www.gg.xyz/game/851964?skip=0&take=6"
                  isExternal
                  color="blueLight"
                />,
              ]}
            />
          </Text>
          <Button
            size={{ base: "xs", sm: "sm" }}
            fontSize={{ base: "9px !important", sm: "13px !important" }}
            mb={2}
            onClick={syncQuests}
          >
            Sync
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
