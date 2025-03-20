import { Speed } from "../enums/settings";

export const animationSpeedLabels: Record<Speed, string> = {
    [Speed.NORMAL]: "speed.normal",
    [Speed.FAST]: "speed.fast",
    [Speed.FASTEST]: "speed.fastest",
  };

  export const lootboxTransitionLabels: Record<string, string> = {
    "white": "loot-box-transition-colors.white",
    "black": "loot-box-transition-colors.black",
  };