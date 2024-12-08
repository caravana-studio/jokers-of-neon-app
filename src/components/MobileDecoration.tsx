import { useGameContext } from "../providers/GameProvider";
import CachedImage from "./CachedImage";

export const MobileDecoration = () => {
  const { isRageRound } = useGameContext();
  return (
    <>
      <CachedImage
        src={`/borders/top${isRageRound ? "-rage" : ""}.png`}
        width="100%"
        maxHeight="70px"
        position="fixed"
        top={1}
        zIndex={0}
      />
      <CachedImage
        src={`/borders/bottom${isRageRound ? "-rage" : ""}.png`}
        width="100%"
        maxHeight="70px"
        position="fixed"
        bottom={1}
        zIndex={0}
      />
    </>
  );
};
