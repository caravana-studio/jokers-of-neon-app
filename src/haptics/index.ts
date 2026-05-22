import {
  Haptics,
  ImpactStyle,
  NotificationType,
} from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";

export type HapticAction =
  | "interaction"
  | "deal-card-step"
  | "points"
  | "multi"
  | "cash"
  | "reroll"
  | "buy-item"
  | "lose"
  | "win"
  | "open-pack-drag-step"
  | "open-pack-opened"
  | "open-pack-pass-card"
  | "gain-xp"
  | "score-low"
  | "score-mid"
  | "score-high"
  | "score-extra-high";

export const HAPTIC_GLOBAL_IGNORE_ATTR = "data-haptic-ignore-global";
export const HAPTIC_INTERACTION_ATTR = "data-haptic-interaction";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const throttles = new Map<string, number>();
let scorePriorityUntil = 0;

let hapticsEnabled = Capacitor.isNativePlatform();

const canUseHaptics = () =>
  hapticsEnabled &&
  Capacitor.isNativePlatform() &&
  Capacitor.isPluginAvailable("Haptics");

const isIOS = () => Capacitor.getPlatform() === "ios";
const isAndroid = () => Capacitor.getPlatform() === "android";

const runSelectionPulse = async () => {
  await Haptics.selectionStart();
  await Haptics.selectionChanged();
  await Haptics.selectionEnd();
};

const runPulseSequence = async (durations: number[], pause = 70) => {
  for (let index = 0; index < durations.length; index += 1) {
    await Haptics.vibrate({ duration: durations[index] });
    if (index < durations.length - 1) {
      await sleep(pause);
    }
  }
};

const runSelectionSequence = async (steps: number, pause = 40) => {
  await Haptics.selectionStart();
  for (let index = 0; index < steps; index += 1) {
    await Haptics.selectionChanged();
    if (index < steps - 1) {
      await sleep(pause);
    }
  }
  await Haptics.selectionEnd();
};

const runSuccessCelebration = async () => {
  await Haptics.notification({ type: NotificationType.Success });
  await sleep(80);
  await Haptics.impact({ style: ImpactStyle.Light });
  await sleep(80);
  await Haptics.impact({ style: ImpactStyle.Medium });
};

const runWinBurst = async () => {
  await Haptics.notification({ type: NotificationType.Success });
  await sleep(100);
  await Haptics.impact({ style: ImpactStyle.Medium });
  await sleep(80);
  await Haptics.impact({ style: ImpactStyle.Heavy });
};

const runInteraction = async () => {
  if (isIOS()) {
    await runSelectionPulse();
    return;
  }

  await Haptics.vibrate({ duration: 10 });
};

const runOpenPackDragStep = async () => {
  if (isIOS()) {
    await runSelectionPulse();
    return;
  }

  await Haptics.vibrate({ duration: 10 });
};

const runScoreHaptic = async (
  level: "low" | "mid" | "high" | "extra-high"
) => {
  if (level === "low") {
    if (isIOS()) {
      await runSelectionSequence(10, 40);
      return;
    }

    await runPulseSequence(
      [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      16
    );
    return;
  }

  if (level === "mid") {
    if (isIOS()) {
      await runSelectionSequence(14, 40);
      return;
    }

    await runPulseSequence(
      [
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      ],
      16
    );
    return;
  }

  if (level === "high") {
    await Haptics.vibrate({ duration: isIOS() ? 850 : 950 });
    return;
  }

  if (isIOS()) {
    await Haptics.vibrate({ duration: 1300 });
    await Haptics.impact({ style: ImpactStyle.Heavy });
    return;
  }

  await Haptics.vibrate({ duration: 1450 });
};

const shouldThrottle = (key: string, minIntervalMs: number) => {
  const now = Date.now();
  const lastTrigger = throttles.get(key) ?? 0;

  if (now - lastTrigger < minIntervalMs) {
    return true;
  }

  throttles.set(key, now);
  return false;
};

const isScorePriorityAction = (action: HapticAction) =>
  action === "score-low" ||
  action === "score-mid" ||
  action === "score-high" ||
  action === "score-extra-high";

const getScorePriorityWindowMs = (action: HapticAction) => {
  if (action === "score-low") return 420;
  if (action === "score-mid") return 640;
  if (action === "score-high") return 980;
  return 1480;
};

const shouldSkipForScorePriority = (action: HapticAction) => {
  if (isScorePriorityAction(action)) {
    return false;
  }

  return Date.now() < scorePriorityUntil;
};

const runAction = async (action: HapticAction) => {
  if (shouldSkipForScorePriority(action)) {
    return;
  }

  if (action === "interaction") {
    if (shouldThrottle("interaction", 60)) return;
    await runInteraction();
    return;
  }

  if (action === "deal-card-step") {
    await runInteraction();
    return;
  }

  if (action === "points") {
    if (isIOS()) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return;
    }

    await Haptics.vibrate({ duration: 25 });
    return;
  }

  if (action === "multi") {
    if (isIOS()) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return;
    }

    await Haptics.vibrate({ duration: 25 });
    return;
  }

  if (action === "cash") {
    if (isIOS()) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return;
    }

    await Haptics.vibrate({ duration: 25 });
    return;
  }

  if (action === "reroll") {
    await Haptics.impact({ style: ImpactStyle.Light });
    await sleep(isAndroid() ? 45 : 80);
    await Haptics.impact({ style: ImpactStyle.Medium });
    await sleep(isAndroid() ? 55 : 90);
    await Haptics.impact({ style: ImpactStyle.Heavy });
    return;
  }

  if (action === "buy-item") {
    await Haptics.notification({ type: NotificationType.Success });
    return;
  }

  if (action === "lose") {
    await Haptics.notification({ type: NotificationType.Error });
    return;
  }

  if (action === "win") {
    if (isIOS()) {
      await runSuccessCelebration();
      return;
    }

    await runWinBurst();
    return;
  }

  if (action === "open-pack-drag-step") {
    if (shouldThrottle("open-pack-drag-step", isIOS() ? 35 : 16)) return;
    await runOpenPackDragStep();
    return;
  }

  if (action === "open-pack-opened") {
    if (isIOS()) {
      await runSuccessCelebration();
      return;
    }

    await Haptics.notification({ type: NotificationType.Success });
    await sleep(70);
    await Haptics.impact({ style: ImpactStyle.Light });
    return;
  }

  if (action === "open-pack-pass-card") {
    if (isIOS()) {
      await Haptics.impact({ style: ImpactStyle.Light });
      await sleep(75);
      await Haptics.impact({ style: ImpactStyle.Light });
      return;
    }

    await Haptics.vibrate({ duration: 10 });
    return;
  }

  if (action === "gain-xp") {
    await Haptics.notification({ type: NotificationType.Success });
    return;
  }

  if (action === "score-low") {
    scorePriorityUntil = Date.now() + getScorePriorityWindowMs(action);
    await runScoreHaptic("low");
    return;
  }

  if (action === "score-mid") {
    scorePriorityUntil = Date.now() + getScorePriorityWindowMs(action);
    await runScoreHaptic("mid");
    return;
  }

  if (action === "score-high") {
    scorePriorityUntil = Date.now() + getScorePriorityWindowMs(action);
    await runScoreHaptic("high");
    return;
  }

  scorePriorityUntil = Date.now() + getScorePriorityWindowMs(action);
  await runScoreHaptic("extra-high");
};

export const setHapticsEnabled = (enabled: boolean) => {
  hapticsEnabled = Capacitor.isNativePlatform() && enabled;
};

export const getDefaultHapticsEnabled = () => Capacitor.isNativePlatform();

export const triggerHaptic = (action: HapticAction) => {
  if (!canUseHaptics()) return;

  void runAction(action).catch((error) => {
    console.warn("[haptics] Failed to trigger action", action, error);
  });
};
