import { keyframes } from "@emotion/react";

export const coinPulse = keyframes`
  0% {
    transform: scale(1.5) rotate(0deg);
  }
  50% {
    transform: scale(1.6) rotate(3deg);
  }
  100% {
    transform: scale(1.5) rotate(0deg);
  }
`;

export const coinPulseBack = keyframes`
  0% {
    transform: scale(1.3) rotate(0deg);
  }
  50% {
    transform: scale(1.4) rotate(-3deg);
  }
  100% {
    transform: scale(1.3) rotate(0deg);
  }
`;

export const seasonPassPulse = keyframes`
  0% {
    transform: scale(1) translateY(0) rotate(0deg);
  }
  50% {
    transform: scale(1.05) translateY(-5px) rotate(-2deg);
  }
  100% {
    transform: scale(1) translateY(0) rotate(0deg);
  }
`;
