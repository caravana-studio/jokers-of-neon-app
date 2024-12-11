import { useParams } from "react-router-dom";
import PreviewCard from "./PreviewCard";
import { PreviewLootBox } from "./PreviewLootBox";
import { PreviewSlot } from "./PreviewSlot";
import { PreviewPowerUp } from "./PreviewPowerUp";

export const PreviewPage = () => {
  const { type } = useParams();

  if (type === "card") {
    return <PreviewCard />;
  } else if (type === "loot-box") {
    return <PreviewLootBox />;
  } else if (type === "slot") {
    return <PreviewSlot />;
  } else if (type === "power-up") {
    return <PreviewPowerUp />;
  } else {
    return <p>Page not found.</p>;
  }
};
