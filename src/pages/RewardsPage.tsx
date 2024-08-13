import { Box, Image, Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { RewardsDetail } from "../components/RewardsDetail";
import { useGameContext } from "../providers/GameProvider";

export const RewardsPage = () => {
  const { roundRewards } = useGameContext();
  const navigate = useNavigate();

  if (!roundRewards) {
    navigate("/redirect/store");
  }

  return (
    <Background type="game" dark>
      <Box sx={{ width: "100%", height: "100%" }}>
        {!isMobile && (
          <Image
            src="/borders/top.png"
            height="8%"
            width="100%"
            maxHeight="70px"
            position="fixed"
            top={0}
          />
        )}
        <Box
          height="15%"
          width="100%"
          display="flex"
          justifyContent={isMobile ? "center" : "space-between"}
          alignItems="center"
          padding={isMobile ? "0 50px" : "25px 50px 0px 50px"}
        >
          <Image
            alignSelf="center"
            justifySelf="end"
            src="/logos/logo-variant.png"
            alt="/logos/logo-variant.png"
            width={"65%"}
            maxW={"350px"}
          />
          {!isMobile && (
            <Image
              alignSelf="center"
              justifySelf="end"
              src="/logos/joker-logo.png"
              alt="/logos/joker-logo.png"
              width={"25%"}
              maxW={"150px"}
            />
          )}
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
        {!isMobile && (
          <>
            <Image
              src="/borders/bottom.png"
              height="8%"
              width="100%"
              maxHeight="70px"
              position="fixed"
              bottom={0}
            />
            <Box
              sx={{
                position: "fixed",
                bottom: 16,
                left: 12,
              }}
            >
              <Text size="m">BUIDL YOUR DECK</Text>
            </Box>
            <Box
              sx={{
                position: "fixed",
                bottom: 16,
                right: 12,
              }}
            >
              <Text size="m">RULE THE GAME</Text>
            </Box>
          </>
        )}
      </Box>
    </Background>
  );
};
