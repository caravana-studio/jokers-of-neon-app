import { VIOLET } from "../../theme/colors";
import { useSeasonNumber } from "../../constants/season";
import CachedImage from "../CachedImage";

interface SeasonPassProps {
  w?: string;
  rotate?: string;
  unlocked?: boolean;
  seasonNumber?: number;
}

const AVAILABLE_SEASON_PASS_IMAGES = [1, 2, 3] as const;
const FALLBACK_SEASON_PASS_IMAGE =
  AVAILABLE_SEASON_PASS_IMAGES[AVAILABLE_SEASON_PASS_IMAGES.length - 1];

export const SeasonPass = ({
  w = "50px",
  rotate = "0deg",
  unlocked = false,
  seasonNumber,
}: SeasonPassProps) => {
  const currentSeasonNumber = useSeasonNumber();
  const requestedSeasonImageNumber =
    Number.isFinite(seasonNumber) && (seasonNumber ?? 0) > 0
      ? Number(seasonNumber)
      : currentSeasonNumber > 0
        ? currentSeasonNumber
        : 1;
  const seasonImageNumber = AVAILABLE_SEASON_PASS_IMAGES.includes(
    requestedSeasonImageNumber as (typeof AVAILABLE_SEASON_PASS_IMAGES)[number]
  )
    ? requestedSeasonImageNumber
    : FALLBACK_SEASON_PASS_IMAGE;
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
