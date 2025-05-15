import { useEffect, useRef, useState } from "react";
import { LoadingProgress } from "../../types/LoadingProgress";
import { BaseLoadingBar } from "./BaseLoadingBar";

interface SimulatedLoadingBarProps {
  headingStages: LoadingProgress[];
  duration?: number;
  isOpen?: boolean;
}

export const SimulatedLoadingBar = ({
  headingStages,
  duration = 10000,
  isOpen = true,
}: SimulatedLoadingBarProps) => {
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const slowPhaseStartedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;

      const timeElapsed = timestamp - startTimeRef.current;
      setElapsedTime(timeElapsed);

      let newProgress = progress;

      if (timeElapsed <= duration && progress < 95) {
        const linearProgress = Math.min(timeElapsed / duration, 0.95);
        newProgress = applyNaturalEasing(linearProgress) * 100;
      } else {
        if (!slowPhaseStartedRef.current) {
          slowPhaseStartedRef.current = true;
        }
        const slowIncrement = Math.random() * 0.04 + 0.01;
        newProgress = Math.min(99.9, progress + slowIncrement);
      }

      setProgress(newProgress);
      if (newProgress < 99.9) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, duration, progress]);

  const applyNaturalEasing = (p: number) => {
    const jitter = Math.random() * 0.04 - 0.02;
    if (p < 0.2) return Math.min(1, Math.max(0, p * 1.5 + jitter * p));
    if (p < 0.8)
      return Math.min(1, Math.max(0, 0.3 + (p - 0.2) * 0.8 + jitter * (1 - p)));
    return Math.min(
      0.95,
      Math.max(0, 0.78 + (p - 0.8) * 0.85 + jitter * (1 - p))
    );
  };

  const currentStage = [...headingStages]
    .sort((a, b) => b.showAt - a.showAt)
    .find((stage) => elapsedTime >= stage.showAt);

  return (
    <BaseLoadingBar
      progress={progress}
      currentStageText={
        currentStage?.text || headingStages[0]?.text || "Loading"
      }
    />
  );
};
