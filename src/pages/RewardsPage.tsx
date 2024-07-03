import { Box, Image } from "@chakra-ui/react";
import { useEffect } from "react";
import { Background } from "../components/Background";
import { preloadImages } from "../utils/preloadImages";
import { RewardsDetail } from "../components/RewardsDetail";
import { useGameContext } from "../providers/GameProvider";
import { useNavigate } from "react-router-dom";

export const RewardsPage = () => {
  const { roundRewards } = useGameContext();
  const navigate = useNavigate();

  if (!roundRewards) {
    navigate("/")
  }

  useEffect(() => {
    preloadImages()
      .then(() => {
        console.log("All images preloaded");
      })
      .catch((err) => {
        console.error("Error preloading images:", err);
      });
  }, []);

  return (
    <Background type="home">
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box
          height="15%"
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="0 5%"
        >
          <Image
            alignSelf="center"
            justifySelf="end"
            src="/logos/joker-logo.png"
            alt="/logos/joker-logo.png"
            width={"25%"}
            maxW={"150px"}
          />
          <Image
            alignSelf="center"
            justifySelf="end"
            src="/logos/logo-variant.png"
            alt="/logos/logo-variant.png"
            width={"65%"}
            maxW={"400px"}
          />
        </Box>
        <Box
          sx={{
            height: "60%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RewardsDetail roundRewards={roundRewards} />
        </Box>
        <Box
          sx={{
            display: "flex",
            height: "15%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src="/logos/jn-logo.png"
            alt="/logos/jn-logo.png"
            width={"50%"}
            maxW={"250px"}
          />
        </Box>
      </Box>
    </Background>
  );
};
