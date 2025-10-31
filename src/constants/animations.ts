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