import { keyframes } from "@emotion/react";

export const packAnimation = keyframes`
  0% {
    transform: scale(1) translateY(0) ;
  }
  50% {
    transform: scale(1) translateY(5px);
  }
  100% {
    transform: scale(1) translateY(0) ;
  }
`;

export const packGlowAnimation = keyframes`
  0% {
    filter: drop-shadow(0 0 8px rgba(255,255,255,0.3)) drop-shadow(0 0 15px rgba(255,255,255,0.15));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(255,255,255,0.5)) drop-shadow(0 0 25px rgba(255,255,255,0.25));
  }
  100% {
    filter: drop-shadow(0 0 8px rgba(255,255,255,0.3)) drop-shadow(0 0 15px rgba(255,255,255,0.15));
  }
`;