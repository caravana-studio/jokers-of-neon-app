import { Button, Flex, Heading, Img, Spinner } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { Background } from "../components/Background";
import { Leaderboard } from "../components/Leaderboard";
import { Menu } from "../components/Menu";
import { PoweredBy } from "../components/PoweredBy";
import { preloadImages } from "../utils/preloadImages";

interface HomeProps {
  loading?: boolean;
}

export const Home = ({ loading = false }: HomeProps) => {
  const [open, setOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const onKeyDown = useCallback((event: { key: string }) => {
    setOpen(true);
    setLeaderboardOpen(false);
  }, []);

  useEffect(() => {
    preloadImages()
      .then(() => {
        console.log("All images preloaded");
      })
      .catch((err) => {
        console.error("Error preloading images:", err);
      });
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, false);

    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
    };
  }, [onKeyDown]);

  return (
    <Background type="home">
      <Flex
        height="100%"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        {open && (
          <Menu
            onClose={() => setOpen(false)}
            onOpenLeaderboardClick={() => {
              setOpen(false);
              setLeaderboardOpen(true);
            }}
          />
        )}
        {leaderboardOpen && (
          <Flex flexDirection="column" alignItems="center" gap={4}>
            <Leaderboard />
            <Heading size="m" color="limegreen">
              PRESS A KEY TO GO BACK TO MENU
            </Heading>
          </Flex>
        )}
        {!open && !leaderboardOpen && (
          <Flex flexDirection="column" alignItems="center" gap={{ base: 6, sm: 8, md: 12 }}>
            <Heading
              size="xl"
              color="white"
              fontSize={{ base: 10, sm: 20, md: 25, lg: 30 }}
            >
              BUIDL YOUR DECK, RULE THE GAME
            </Heading>
            <Img width={{base: '95%', sm: '85%', md: '80%'}} src="/logo.jpg" alt="logo" />
            {loading ? (
              <Spinner color="white" size="xl" />
            ) : (
              <Button
                variant="solid"
                size="md"
                onClick={() => {
                  setOpen(true);
                }}
              >
                CLICK HERE TO START
              </Button>
            )}
          </Flex>
        )}
        <PoweredBy />
      </Flex>
    </Background>
  );
};
