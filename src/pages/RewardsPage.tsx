import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { RewardsDetail } from "../components/RewardsDetail";
import { useGameContext } from "../providers/GameProvider";
import { runConfettiAnimation } from "../utils/runConfettiAnimation";
import { BackgroundDecoration } from "../components/Background";

export const RewardsPage = () => {
  const { roundRewards } = useGameContext();
  const navigate = useNavigate();

  useEffect(() => {
    runConfettiAnimation();
  }, []);

  if (!roundRewards) {
    navigate("/redirect/store");
  }

  return (
    <BackgroundDecoration>
      <RewardsDetail roundRewards={roundRewards} />
      <PositionedDiscordLink />
    </BackgroundDecoration>
  );
};
