import { RemoveScroll } from "react-remove-scroll";
import { GameContent } from "./GameContent";

export const GamePage = () => {
  return (
    <>
      <GameContent />
      <RemoveScroll>
        <></>
      </RemoveScroll>
    </>
  );
};
