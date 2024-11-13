import { Speed } from "../enums/speed";

export const getMinimumDuration = (level: number, speed: Speed) => {
  if (Speed.NORMAL === speed) {
    return !level || level <= 15 ? 400 : level > 20 ? 300 : 350;
  } else if (Speed.FAST === speed) {
    return 300;
  } else if (Speed.FASTEST === speed) {
    return 250;
  }
  return 300;
};

export const getPlayAnimationDuration = (level: number, speed: Speed) => {
  const minimumDuration = getMinimumDuration(level, speed);
  if (Speed.FAST === speed) {
    return Math.max(400 - ((level ?? 1) - 1) * 50, minimumDuration);
  } else if (Speed.FASTEST === speed) {
    return Math.max(350 - ((level ?? 1) - 1) * 50, minimumDuration);
  } else {
    return Math.max(700 - ((level ?? 1) - 1) * 50, minimumDuration);
  }
};
