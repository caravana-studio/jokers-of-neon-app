export const GPU_EFFECTS_MAX_FPS = 30;
export const GPU_EFFECTS_RESOLUTION_SCALE = 0.5;

interface AnimationFrameScheduler {
  requestAnimationFrame: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame: (handle: number) => void;
}

export interface ThrottledAnimationLoop {
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
}

export const createThrottledAnimationLoop = (
  renderFrame: FrameRequestCallback,
  maxFps = GPU_EFFECTS_MAX_FPS,
  scheduler?: AnimationFrameScheduler,
): ThrottledAnimationLoop => {
  const frameScheduler = scheduler ?? {
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
    cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
  };
  const frameInterval = 1000 / maxFps;
  let animationFrameId: number | null = null;
  let lastRenderTime: number | null = null;
  let running = false;

  const tick: FrameRequestCallback = (time) => {
    if (!running) return;

    const elapsed = lastRenderTime === null ? frameInterval : time - lastRenderTime;
    if (elapsed >= frameInterval) {
      lastRenderTime = time - (elapsed % frameInterval);
      renderFrame(time);
    }

    if (running) {
      animationFrameId = frameScheduler.requestAnimationFrame(tick);
    }
  };

  const start = () => {
    if (running) return;
    running = true;
    lastRenderTime = null;
    animationFrameId = frameScheduler.requestAnimationFrame(tick);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    if (animationFrameId !== null) {
      frameScheduler.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  return {
    start,
    stop,
    isRunning: () => running,
  };
};

export const observeRenderActivity = (
  element: Element,
  onActivityChange: (active: boolean) => void,
): (() => void) => {
  const ownerDocument = element.ownerDocument;
  const observerConstructor = ownerDocument.defaultView?.IntersectionObserver;
  let isIntersecting = true;
  let previousActivity: boolean | undefined;

  const notifyIfChanged = () => {
    const active = isIntersecting && !ownerDocument.hidden;
    if (active !== previousActivity) {
      previousActivity = active;
      onActivityChange(active);
    }
  };

  const intersectionObserver = observerConstructor
    ? new observerConstructor((entries) => {
        const entry = entries.find(({ target }) => target === element);
        if (!entry) return;
        isIntersecting = entry.isIntersecting && entry.intersectionRatio > 0;
        notifyIfChanged();
      })
    : null;

  intersectionObserver?.observe(element);
  ownerDocument.addEventListener("visibilitychange", notifyIfChanged);
  notifyIfChanged();

  return () => {
    intersectionObserver?.disconnect();
    ownerDocument.removeEventListener("visibilitychange", notifyIfChanged);
  };
};
