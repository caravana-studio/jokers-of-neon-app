import { useImperativeHandle, useState, forwardRef } from "react";
import { LoadingProgress } from "../../types/LoadingProgress";
import { BaseLoadingBar } from "./BaseLoadingBar";

export interface RealLoadingBarRef {
  nextStep: () => void;
  setStep: (index: number) => void;
  reset: () => void;
}

interface RealLoadingBarProps {
  steps: LoadingProgress[];
  isOpen?: boolean;
}

export const RealLoadingBar = forwardRef<
  RealLoadingBarRef,
  RealLoadingBarProps
>(({ steps, isOpen = true }, ref) => {
  const [currentStep, setCurrentStep] = useState(0);

  useImperativeHandle(ref, () => ({
    nextStep: () => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    },
    setStep: (index: number) => {
      if (index >= 0 && index < steps.length) {
        setCurrentStep(index);
      }
    },
    reset: () => {
      setCurrentStep(0);
    },
  }));

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStageText = steps[currentStep]?.text ?? "Loading";

  if (!isOpen) return null;

  return (
    <BaseLoadingBar progress={progress} currentStageText={currentStageText} />
  );
});
