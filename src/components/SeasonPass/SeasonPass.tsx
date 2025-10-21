import { VIOLET } from "../../theme/colors";
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
  return (
    <CachedImage
      src="/season-pass.png"
      boxShadow={unlocked ? `0 0 7px 4px ${VIOLET}, inset 0 0 5px 4px ${VIOLET}` : "none"}
      transform={`rotate(${rotate})`}
      w={w}
    />
  );
};
