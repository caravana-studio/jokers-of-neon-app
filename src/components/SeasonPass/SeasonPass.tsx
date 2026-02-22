import { VIOLET } from "../../theme/colors";
import { SEASON_NUMBER } from "../../constants/season";
import CachedImage from "../CachedImage";

interface SeasonPassProps {
  w?: string;
  rotate?: string;
  unlocked?: boolean;
}

export const SeasonPass = ({
  w = "50px",
  rotate = "0deg",
  unlocked = false,
}: SeasonPassProps) => {
  const seasonImageNumber = SEASON_NUMBER > 0 ? SEASON_NUMBER : 1;
  const shadowColor = seasonImageNumber === 2 ? "rgba(255, 255, 255, 0.7)" : VIOLET;

  return (
    <CachedImage
      src={`/season-pass${seasonImageNumber}.png`}
      filter={
        unlocked
          ? `drop-shadow(0 0 7px ${shadowColor}) drop-shadow(0 0 5px ${shadowColor})`
          : "none"
      }
      transform={`rotate(${rotate})`}
      w={w}
    />
  );
};
