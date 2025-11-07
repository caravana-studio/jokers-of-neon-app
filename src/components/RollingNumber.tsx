import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { animated, useSpring } from "react-spring";
import {
  rolling15ms,
  rolling1s,
  rolling2s,
  rolling3s,
  rolling4s,
  rolling5s,
} from "../constants/sfx";
import { useAudio } from "../hooks/useAudio";
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
  const { sfxVolume } = useSettings();

  const { play: playRolling15ms } = useAudio(rolling15ms, sfxVolume);
  const { play: playRolling1s } = useAudio(rolling1s, sfxVolume);
  const { play: playRolling2s } = useAudio(rolling2s, sfxVolume);
  const { play: playRolling3s } = useAudio(rolling3s, sfxVolume);
  const { play: playRolling4s } = useAudio(rolling4s, sfxVolume);
  const { play: playRolling5s } = useAudio(rolling5s, sfxVolume);

  const lastValueRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sound) return;

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

    const getSoundPlayer = () => {
      if (animationDuration <= 200) return playRolling15ms;
      if (animationDuration <= 1500) return playRolling1s;
      if (animationDuration <= 2500) return playRolling2s;
      if (animationDuration <= 3500) return playRolling3s;
      if (animationDuration <= 4500) return playRolling4s;
      return playRolling5s;
    };

    const playSound = getSoundPlayer();
    const timeout = setTimeout(() => {
      playSound();
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [n]);

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
