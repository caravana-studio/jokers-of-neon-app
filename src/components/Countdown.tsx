import { ReactNode, useEffect, useState } from "react";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const HOUR_IN_MS = 1000 * 60 * 60;
const MINUTE_IN_MS = 1000 * 60;
const SECOND_IN_MS = 1000;

export interface CountdownParts {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export type CountdownFormatter = (parts: CountdownParts) => string;

export interface CountdownProps {
  targetDate: Date;
  intervalMs?: number;
  formatter?: CountdownFormatter;
  children?: (data: CountdownParts & { formatted: string }) => ReactNode;
}

const defaultFormatter: CountdownFormatter = ({ days, hours, minutes }) => {
  const dayPrefix = days !== 0 ? `${days}d ` : "";
  const minuteSuffix = days !== 0 ? "" : `${minutes}m`;
  return `${dayPrefix}${hours}h ${minuteSuffix}`;
};

const getCountdownParts = (targetTime: number): CountdownParts => {
  const now = Date.now();
  const diff = Number.isFinite(targetTime) ? Math.max(targetTime - now, 0) : 0;

  const days = Math.floor(diff / DAY_IN_MS);
  const hours = Math.floor((diff % DAY_IN_MS) / HOUR_IN_MS);
  const minutes = Math.floor((diff % HOUR_IN_MS) / MINUTE_IN_MS);
  const seconds = Math.floor((diff % MINUTE_IN_MS) / SECOND_IN_MS);

  return {
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
  };
};

export const Countdown = ({
  targetDate,
  intervalMs = 60000,
  formatter,
  children,
}: CountdownProps) => {
  const targetTime = targetDate.getTime();
  const [parts, setParts] = useState(() => getCountdownParts(targetTime));
  const format = formatter ?? defaultFormatter;

  useEffect(() => {
    const tick = () => {
      setParts(getCountdownParts(targetTime));
    };

    tick();

    const safeInterval = intervalMs > 0 ? intervalMs : 1000;
    const intervalId = window.setInterval(tick, safeInterval);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [targetTime, intervalMs]);

  const formatted = format(parts);

  if (children) {
    return <>{children({ ...parts, formatted })}</>;
  }

  return <>{formatted}</>;
};
