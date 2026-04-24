import { Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { MotionBox } from "../../components/MotionBox";
import { BLUE, VIOLET } from "../../theme/colors";

interface PlayDiscardIndicatorProps {
  disabled: boolean;
  on: boolean;
  color: string;
  pulse: boolean;
  pulseDurationMs: number;
}
const PlayDiscardIndicator = ({
  disabled,
  on,
  color,
  pulse,
  pulseDurationMs,
}: PlayDiscardIndicatorProps) => {
  const baseBoxShadow = on && !disabled ? `0px 0px 10px 6px ${color}` : "none";
  const pulseBoxShadow = on ? `0px 0px 16px 10px ${color}` : baseBoxShadow;

  return (
    <MotionBox
      width={["9px", "11px"]}
      height={["9px", "11px"]}
      borderRadius="full"
      backgroundColor={on ? color : "transparent"}
      border="1px solid white"
      animate={
        pulse
          ? {
              scale: [1, 1.3, 1],
              boxShadow: [baseBoxShadow, pulseBoxShadow, baseBoxShadow],
            }
          : {
              scale: 1,
              boxShadow: baseBoxShadow,
            }
      }
      transition={
        pulse
          ? {
              duration: Math.max(pulseDurationMs, 150) / 1000,
              times: [0, 0.45, 1],
              ease: "easeOut",
            }
          : { duration: 0.2 }
      }
    />
  );
};

interface PlayDiscardIndicatorsProps {
  disabled: boolean;
  type: "play" | "discard";
  total: number;
  active: number;
  justifyContent?: string;
  pulseToken?: number;
  pulseDurationMs?: number;
}

export const PlayDiscardIndicators = ({
  disabled,
  type,
  total,
  active,
  justifyContent,
  pulseToken,
  pulseDurationMs = 750,
}: PlayDiscardIndicatorsProps) => {
  const color = type === "play" ? VIOLET : BLUE;
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);
  const [pulseCycle, setPulseCycle] = useState(0);
  const previousPulseTokenRef = useRef<number | undefined>(pulseToken);

  useEffect(() => {
    if (
      pulseToken === undefined ||
      pulseToken === previousPulseTokenRef.current
    ) {
      return;
    }

    previousPulseTokenRef.current = pulseToken;

    if (active <= 0 || total <= 0) {
      return;
    }

    const indexToPulse = Math.min(Math.max(active - 1, 0), total - 1);
    setPulseIndex(indexToPulse);
    setPulseCycle((current) => current + 1);

    const timeoutId = window.setTimeout(() => {
      setPulseIndex((current) => (current === indexToPulse ? null : current));
    }, Math.max(pulseDurationMs, 150));

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [active, pulseDurationMs, pulseToken, total]);

  return (
    <Flex
      w="100%"
      justifyContent={justifyContent ?? "space-around"}
      alignItems="center"
      gap={{ base: 2, sm: 4 }}
    >
      {Array.from({ length: total }).map((_, index) => {
        const isOn = index < active;
        const shouldPulse = isOn && pulseIndex === index;
        return (
          <PlayDiscardIndicator
            key={shouldPulse ? `${index}-${pulseCycle}` : `${index}`}
            disabled={disabled}
            on={isOn}
            color={color}
            pulse={shouldPulse}
            pulseDurationMs={pulseDurationMs}
          />
        );
      })}
    </Flex>
  );
};
