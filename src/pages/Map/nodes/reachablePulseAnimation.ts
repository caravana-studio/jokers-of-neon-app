import { keyframes } from "@emotion/react";
import { VIOLET, VIOLET_RGBA } from "../../../theme/colors";

const reachableBreathe = keyframes`
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 6px ${VIOLET_RGBA(0.4)});
  }
  50% {
    transform: scale(1.15);
    filter: drop-shadow(0 0 14px ${VIOLET_RGBA(0.7)});
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 6px ${VIOLET_RGBA(0.4)});
  }
`;

const reachablePulseRing = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  70% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
`;

export const getReachablePulseSx = (
  borderRadius: string | number,
  inset: string
) => ({
  animation: `${reachableBreathe} 1.8s ease-in-out infinite`,
  "&::after": {
    content: '""',
    position: "absolute",
    inset,
    borderRadius,
    border: `2px solid ${VIOLET}`,
    animation: `${reachablePulseRing} 1.8s ease-out infinite`,
    pointerEvents: "none",
    opacity: 0.8,
    zIndex: -1,
    transformOrigin: "center",
  },
});
