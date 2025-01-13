import { Button, Flex, Heading, Text, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import CachedImage from "../components/CachedImage";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { PositionedGameMenu } from "../components/GameMenu";

const MODS = [
  {
    title: "Classic Jokers of Neon",
    id: "classic",
    description: "The classic version of Jokers of Neon",
    url: "/login",
  },
  {
    title: "Loot Survivor MOD",
    id: "loot-survivor",
    description:
      "Play to die in this Loot Survivor inspired mod. Face obstacles and kill beasts while you explore the dungeon. Live on mainnet!",
    url: "https://ls.jokersofneon.com",
  },
  {
    title: "Pepe mod",
    id: "pepe",
  },
];

export const SelectMod = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens", { keyPrefix: "mods" });

  return (
    <Background type="home">
      <PositionedGameMenu />
      <Flex
        height="100%"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          w="100%"
        >
          <Heading maxW="80%" lineHeight={1.8} textAlign="center" size="xl" fontSize={{ base: 13, sm: 16, md: 20, lg: 25 }}>
            {t("title")}
          </Heading>
        </Flex>
        <Flex
          w="80%"
          backgroundColor="rgba(0, 0, 0, 0.6)"
          borderRadius="25px"
          mt={[0,4]}
          p={6}
          flexWrap="wrap"
          maxH={"70%"}
          overflowY="auto"
        >
          {MODS.map((mod) => (
            <ModBox key={mod.id} mod={mod} />
          ))}
        </Flex>
        <Button
          onClick={() => {
            navigate("/");
          }}
          minW={["150px", "300px"]}
          mt={6}
        >
          {t("back")}
        </Button>
      </Flex>
    </Background>
  );
};

const ModBox = ({
  mod,
}: {
  mod: { title: string; id: string; description?: string; url?: string };
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens", { keyPrefix: "mods" });

  return (
    <Tooltip label={mod.description}>
      <Flex
        w={{ base: "100%", sm: "33%" }}
        p={4}
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        gap={4}
        onClick={() =>
          mod.url
            ? mod.url.startsWith("http")
              ? (window.location.href = mod.url)
              : navigate(mod.url)
            : navigate(`/play/${mod.id}`)
        }
      >
        <Text size="l">{mod.title}</Text>
        <CachedImage
          cursor="pointer"
          src={`/mods/${mod.id}.png`}
          alt={mod.title}
          w="100%"
        />
      </Flex>
    </Tooltip>
  );
};
