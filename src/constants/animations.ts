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
    box-shadow: 0 0 10px 5px rgba(255,255,255,0.2), inset 0 0 10px 5px rgba(255,255,255,0.2);
  }
  50% {
    box-shadow: 0 0 20px 5px rgba(255,255,255,0.3), inset 0 0 20px 5px rgba(255,255,255,0.3);
  }
  100% {
    box-shadow: 0 0 10px 5px rgba(255,255,255,0.2), inset 0 0 10px 5px rgba(255,255,255,0.2);
  }
`;