import { PowerUp } from "../../types/Powerup/PowerUp";
import { createHighlightContext } from "./HighlightProvider";

const { useHighlight, HighlightProvider } = createHighlightContext<PowerUp>();

export const usePowerupHighlight = useHighlight;
export const PowerupHighlightProvider = HighlightProvider;
