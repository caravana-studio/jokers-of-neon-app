export interface PowerUpEffect {
  points: number;
  multi: number;
}

export const POWER_UP_EFFECTS: Record<number, PowerUpEffect> = {
  800: { points: 25, multi: 0 },
  801: { points: 50, multi: 0 },
  802: { points: 75, multi: 0 },
  803: { points: 100, multi: 0 },
  804: { points: 0, multi: 3 },
  805: { points: 0, multi: 5 },
  806: { points: 0, multi: 7 },
  807: { points: 0, multi: 10 },
};

export const getPowerUpEffect = (powerUpId: number): PowerUpEffect => {
  return POWER_UP_EFFECTS[powerUpId] ?? { points: 0, multi: 0 };
};

