import { getPowerUpEffect } from "../../constants/powerupEffects";
import { PowerUp } from "../../types/Powerup/PowerUp";
import { PowerUpScore } from "../../types/ScoreData";

interface BuildOptimisticPowerUpEventsParams {
  preSelectedPowerUps: number[];
  powerUps: (PowerUp | null)[];
}

export const buildOptimisticPowerUpEvents = ({
  preSelectedPowerUps,
  powerUps,
}: BuildOptimisticPowerUpEventsParams): PowerUpScore[] => {
  if (preSelectedPowerUps.length === 0) {
    return [];
  }

  const powerUpPositionByIdx = new Map<number, number>();
  powerUps.forEach((powerUp, position) => {
    if (!powerUp) {
      return;
    }

    powerUpPositionByIdx.set(powerUp.idx, position);
  });

  const orderedPreselectedPowerUps = [...preSelectedPowerUps].sort((a, b) => {
    const positionA = powerUpPositionByIdx.get(a);
    const positionB = powerUpPositionByIdx.get(b);

    if (positionA !== undefined && positionB !== undefined) {
      return positionA - positionB;
    }

    if (positionA !== undefined) {
      return -1;
    }

    if (positionB !== undefined) {
      return 1;
    }

    return a - b;
  });

  return orderedPreselectedPowerUps
    .map((powerUpIdx) => {
      const powerUp =
        powerUps.find((item) => item?.idx === powerUpIdx) ??
        powerUps[powerUpIdx] ??
        null;

      if (!powerUp) {
        return undefined;
      }

      const { points, multi } = getPowerUpEffect(powerUp.power_up_id);
      if (!points && !multi) {
        return undefined;
      }

      return {
        idx: powerUpIdx,
        points,
        multi,
      } as PowerUpScore;
    })
    .filter((powerUp): powerUp is PowerUpScore => powerUp !== undefined);
};
