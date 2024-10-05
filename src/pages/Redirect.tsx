import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate, useParams } from "react-router-dom";
import { Background } from "../components/Background";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { GameMenu } from "../components/GameMenu";
import { Loading } from "../components/Loading";
import { useGame } from "../dojo/queries/useGame";
import { getLSGameId } from "../dojo/utils/getLSGameId";

export const Redirect = () => {
  const game = useGame();
  const state = game?.state;
  const navigate = useNavigate();
  const { page } = useParams();

  useEffect(() => {
    if (state === "FINISHED") {
      navigate(`/gameover/${getLSGameId()}`);
    } else if (state === "IN_GAME" && page === "demo") {
      navigate("/demo");
    } else if (state === "AT_SHOP" && page === "store") {
      navigate("/store");
    } else if (state === "OPEN_BLISTER_PACK" && page === "open-pack") {
      navigate("/open-pack");
    }
  }, [state, page, navigate]);

  return (
    <Background type={"game"}>
      <Loading />
      {isMobile ? (
        <Box
          sx={{
            position: "fixed",
            bottom: "5px",
            right: "5px",
            zIndex: 1000,
            transform: "scale(0.7)",
          }}
        >
          <GameMenu />
        </Box>
      ) : (
        <Box
          sx={{
            position: "fixed",
            bottom: 14,
            left: "70px",
            zIndex: 1000,
          }}
        >
          <GameMenu />
        </Box>
      )}
      <PositionedDiscordLink  />
    </Background>
  );
};
