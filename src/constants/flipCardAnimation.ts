import { Speed } from "../enums/settings";

const speedMultiplierMap = {
    [Speed.FASTEST]: 0.5,
    [Speed.FAST]: 0.75,
    [Speed.NORMAL]: 1
};

const baseFlipSpeed = 500;

export const getFlipSpeed = (speed: Speed) =>
{
    return baseFlipSpeed * speedMultiplierMap[speed];
}