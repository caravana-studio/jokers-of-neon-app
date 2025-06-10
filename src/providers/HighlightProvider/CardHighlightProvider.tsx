import { Card } from "../../types/Card";
import { createHighlightContext } from "./HighlightProvider";

const { useHighlight, HighlightProvider } = createHighlightContext<Card>();

export const useCardHighlight = useHighlight;
export const CardHighlightProvider = HighlightProvider;
