import { Capacitor } from "@capacitor/core";
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getDefaultHapticsEnabled,
  HAPTIC_GLOBAL_IGNORE_ATTR,
  HAPTIC_INTERACTION_ATTR,
  setHapticsEnabled,
  triggerHaptic,
} from "./index";

type HapticsContextValue = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

const HapticsContext = createContext<HapticsContextValue | undefined>(undefined);

const isDisabledElement = (element: Element) =>
  element.matches(":disabled") ||
  element.getAttribute("aria-disabled") === "true" ||
  element.getAttribute("data-disabled") === "true";

const isInteractiveElement = (element: Element) => {
  if (element.hasAttribute(HAPTIC_INTERACTION_ATTR)) {
    return true;
  }

  if (
    element.matches(
      [
        "button",
        "a[href]",
        "summary",
        "[role='button']",
        "input[type='button']",
        "input[type='submit']",
        "input[type='checkbox']",
        "input[type='radio']",
      ].join(", ")
    )
  ) {
    return true;
  }

  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (element.tabIndex >= 0 && element.getAttribute("role") !== "presentation") {
    return true;
  }

  return window.getComputedStyle(element).cursor === "pointer";
};

const resolveInteractionTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    return null;
  }

  let current: Element | null = target;
  while (current && current !== document.body) {
    if (current.getAttribute(HAPTIC_GLOBAL_IGNORE_ATTR) === "true") {
      return null;
    }

    if (isDisabledElement(current)) {
      return null;
    }

    if (isInteractiveElement(current)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
};

export const HapticsProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState(getDefaultHapticsEnabled);

  useEffect(() => {
    setHapticsEnabled(enabled);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !Capacitor.isNativePlatform()) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!resolveInteractionTarget(event.target)) {
        return;
      }

      triggerHaptic("interaction");
    };

    window.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("click", handleClick, true);
    };
  }, [enabled]);

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
    }),
    [enabled]
  );

  return <HapticsContext.Provider value={value}>{children}</HapticsContext.Provider>;
};

export const useHaptics = () => {
  const context = useContext(HapticsContext);

  if (!context) {
    throw new Error("useHaptics must be used within HapticsProvider");
  }

  return context;
};
