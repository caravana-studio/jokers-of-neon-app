import { keyframes } from "@emotion/react";
import { VIOLET_RGBA } from "../theme/colors";

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

export const shopPackGlowAnimation = keyframes`
  0% {
    box-shadow: 0 0 10px 5px rgba(255,255,255,0.3), inset 0 0 10px 5px rgba(255,255,255,0.3);
  }
  50% {
    box-shadow: 0 0 20px 5px rgba(255,255,255,0.8), inset 0 0 20px 5px rgba(255,255,255,0.8);
  }
  100% {
    box-shadow: 0 0 10px 5px rgba(255,255,255,0.3), inset 0 0 10px 5px rgba(255,255,255,0.3);
  }
`;

export const limitedEditionPulse = keyframes`
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0));
  }
`;

export const buttonGlowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px 2px ${VIOLET_RGBA(0.6)};
  }
  50% {
    box-shadow: 0 0 15px 7px ${VIOLET_RGBA(1)};
  }
  100% {
    box-shadow: 0 0 5px 2px ${VIOLET_RGBA(0.6)};
  }
`;
