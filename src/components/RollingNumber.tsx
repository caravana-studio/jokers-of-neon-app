import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { animated, useSpring } from "react-spring";
import AudioManager from "../audio/AudioManager";
import {
  rolling15ms,
  rolling1s,
  rolling2s,
  rolling3s,
  rolling4s,
  rolling5s,
} from "../constants/sfx";
import { useSettings } from "../providers/SettingsProvider";

interface RollingNumberProps {
  n: number;
  className?: string;
  delay?: number;
  sound?: boolean;
}

export const RollingNumber = ({
  n,
  className = "headline",
  delay = 100,
  sound = false,
}: RollingNumberProps) => {
  const { sfxOn } = useSettings();
  const lastValueRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sound || !sfxOn) return;

    let animationDuration;
    const safeValue = Math.abs(Math.trunc(n));

    if (safeValue === 0) {
      return;
    } else {
      const digits = safeValue.toString().length;
      const clampedDigits = Math.min(Math.max(digits, 1), 5);

      animationDuration = clampedDigits * 500;
    }

    const previousValue = lastValueRef.current;
    const valueChanged = previousValue === null || previousValue !== n;
    lastValueRef.current = n;

    if (!valueChanged) return;

    const getSoundPath = () => {
      if (animationDuration <= 200) return rolling15ms;
      if (animationDuration <= 1500) return rolling1s;
      if (animationDuration <= 2500) return rolling2s;
      if (animationDuration <= 3500) return rolling3s;
      if (animationDuration <= 4500) return rolling4s;
      return rolling5s;
    };

    const soundPath = getSoundPath();
    const timeout = setTimeout(() => {
      AudioManager.getInstance().play(soundPath);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [n, sound, sfxOn, delay]);

  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay,
    config: { mass: 1, tension: 26, friction: 10 },
  });
  return (
    <Box as="span" sx={{ display: "inline-block" }}>
      <animated.span className={className}>
        {number.to((n) => n.toFixed(0))}
      </animated.span>
    </Box>
  );
};
