import { Button, Flex, Heading } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Leaderboard } from "../components/Leaderboard";
import { Menu } from "../components/Menu";
import { PoweredBy } from "../components/PoweredBy";
import { noisyTv } from "../scripts/noisyTv";
import { preloadImages } from "../utils/preloadImages";

export const Home = () => {
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

  useEffect(() => {
    noisyTv(1000);
  }, []);

  return (
    <>
      <div className="text av1">
        <span>AV-1</span>
        <span>AV-1</span>
        <span>AV-1</span>
        <span>AV-1</span>
        <span>AV-1</span>
      </div>
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
      {!open &&
        !leaderboardOpen &&
        (isMobile ? (
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            CLICK HERE TO START
          </Button>
        ) : (
          <div className="text press">
            <span>PRESS A KEY TO START</span>
            <span>PRESS A KEY TO START</span>
            <span>PRESS A KEY TO START</span>
            <span>PRESS A KEY TO START</span>
            <span>PRESS A KEY TO START</span>
          </div>
        ))}
      <PoweredBy />
    </>
  );
};
