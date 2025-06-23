import {
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import CachedImage, { checkImageExists } from "../components/CachedImage";
import { PositionedDiscordLink } from "../components/DiscordLink";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { MobileDecoration } from "../components/MobileDecoration";
import { CLASSIC_MOD_ID } from "../constants/general";
import { IMod, useGameMods } from "../dojo/queries/useGameMods";
import { useGameContext } from "../providers/GameProvider";
import { getJsonFromUrl } from "../utils/loadJsonFromUrl";

const OFFICIAL_MODS: IMod[] = [
  {
    name: "Classic Jokers of Neon",
    id: CLASSIC_MOD_ID,
    image: "/mods/classic.png",
    description: "The classic version of Jokers of Neon",
  },
  {
    name: "Loot Survivor MOD",
    id: "loot-survivor",
    image: "/mods/loot-survivor.png",
    description:
      "Play to die in this Loot Survivor inspired mod. Face obstacles and kill beasts while you explore the dungeon. Live on mainnet!",
    url: "https://ls.jokersofneon.com",
  },
];

export const SelectMod = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens", { keyPrefix: "mods" });

  // const { setModId } = useGameContext();

  useEffect(() => {
    // setModId(CLASSIC_MOD_ID);
  }, []);

  const mods = useGameMods();

  return (
    <>
      <MobileDecoration />
      <AudioPlayer />
      <LanguageSwitcher />
      <PositionedDiscordLink />
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
          sx={{
            zIndex: 1,
          }}
        >
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
          sx={{
            zIndex: 1,
          }}
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
    </>
  );
};

const MOD_URL = import.meta.env.VITE_MOD_URL;

interface IModBoxProps {
  mod: IMod;
  isOfficial?: boolean;
}

const ModBox = ({ mod, isOfficial = false }: IModBoxProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens", { keyPrefix: "mods" });
  // const { setModId } = useGameContext();

  const [loading, setLoading] = useState(!isOfficial);

  const imageUrl = MOD_URL + mod.id + "/resources/thumbnail.png";
  const configUrl = MOD_URL + mod.id + "/resources/config.json";

  useEffect(() => {
    if (!isOfficial) {
      getJsonFromUrl(configUrl).then((response) => {
        if (response) {
          setModConfig(response);
        }
      });
      checkImageExists(imageUrl)
        .then((exists) => {
          if (exists) {
            setImageSrc(imageUrl);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const [modConfig, setModConfig] = useState<{
    name: string;
    description?: string;
  }>({
    name: mod.name,
    description: mod.description,
  });

  const [imageSrc, setImageSrc] = useState<string>(
    mod.image ?? "/thumbnail.png"
  );

  return (
    <Tooltip label={modConfig?.description ?? mod.description}>
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
          zIndex: 1,
        }}
        onClick={() => {
          if (mod.url) {
            window.location.href = mod.url;
          } else {
            // setModId(mod.id);
            navigate(`/login`);
          }
        }}
      >
        <Text size="l">{modConfig?.name ?? mod.name}</Text>
        {loading ? (
          <>loading</>
        ) : (
          <CachedImage
            cursor="pointer"
            src={imageSrc}
            alt={mod.name}
            w="100%"
          />
        )}
      </Flex>
    </Tooltip>
  );
};
