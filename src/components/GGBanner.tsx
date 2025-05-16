import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Trans, useTranslation } from "react-i18next";
import CachedImage from "./CachedImage";

export const GGBanner = () => {
  const { t } = useTranslation("game", { keyPrefix: "gg-banner" });
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
      <Flex gap={3} alignItems="center">
        <CachedImage
          src="/logos/gg.png"
          height={{ base: "15px", sm: "22px" }}
        />
        <Heading variant="italic" fontSize={{ base: "12px", sm: "18px" }}>
          {t('title')}
        </Heading>
      </Flex>
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
    </Flex>
  );
};
