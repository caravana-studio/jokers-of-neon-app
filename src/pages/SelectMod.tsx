import {
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import CachedImage from "../components/CachedImage";
import { PositionedGameMenu } from "../components/GameMenu";
import { IMod, useGameMods } from "../dojo/queries/useGameMods";
import { useGameContext } from "../providers/GameProvider";

const OFFICIAL_MODS: IMod[] = [
  {
    name: "Classic Jokers of Neon",
    id: 1,
    image: "classic",
    description: "The classic version of Jokers of Neon",
  },
  {
    name: "Loot Survivor MOD",
    id: 0,
    image: "loot-survivor",
    description:
      "Play to die in this Loot Survivor inspired mod. Face obstacles and kill beasts while you explore the dungeon. Live on mainnet!",
    url: "https://ls.jokersofneon.com",
  },
];

export const SelectMod = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens", { keyPrefix: "mods" });

  const mods = useGameMods();

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
        <Flex flexDirection="column" alignItems="center" w="100%">
          <Heading
            maxW="80%"
            lineHeight={1.8}
            textAlign="center"
            size="xl"
            fontSize={{ base: 13, sm: 16, md: 20, lg: 25 }}
          >
            {t("title")}
          </Heading>
        </Flex>
        <Flex
          w="80%"
          backgroundColor="rgba(0, 0, 0, 0.6)"
          borderRadius="25px"
          mt={[0, 4]}
          p={6}
          flexWrap="wrap"
          maxH={"70%"}
          overflowY="auto"
        >
          {OFFICIAL_MODS.map((mod: IMod) => (
            <ModBox key={mod.id} mod={mod} isOfficial />
          ))}
          {mods.length > 0 && (
            <>
              <Divider orientation="horizontal" borderColor="white" my={6} />
              <Heading
                w="100%"
                size={{ base: "sm", sm: "lg" }}
                textAlign="center"
                variant="italic"
                mt={4}
                mb={2}
              >
                {t("community-mods")}
              </Heading>

              {mods.map((mod) => (
                <ModBox key={mod.id} mod={mod} />
              ))}
            </>
          )}
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

interface IModBoxProps {
  mod: IMod;
  isOfficial?: boolean;
}

const ModBox = ({ mod, isOfficial = false }: IModBoxProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens", { keyPrefix: "mods" });
  const { setModId } = useGameContext();

  return (
    <Tooltip label={mod.description}>
      <Flex
        w={{
          base: isOfficial ? "100%" : "50%",
          sm: isOfficial ? "50%" : "33%",
        }}
        p={4}
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        gap={4}
        sx={{
          _hover: {
            transform: "scale(1.05)",
            transition: "all 0.2s ease-in-out",
          },
        }}
        onClick={() => {
          if (mod.url) {
            window.location.href = mod.url;
          } else {
            setModId(mod.id);
            navigate(`/login`);
          }
        }}
      >
        <Text size="l">{mod.name}</Text>
        <CachedImage
          cursor="pointer"
          src={`/mods/${mod.image}.png`}
          alt={mod.name}
          w="100%"
        />
      </Flex>
    </Tooltip>
  );
};
