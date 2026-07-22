import { describe, expect, it } from "vitest";
import {
  createThrottledAnimationLoop,
  GPU_EFFECTS_MAX_FPS,
  GPU_EFFECTS_RESOLUTION_SCALE,
  observeRenderActivity,
} from "./renderLifecycle";

const createScheduler = () => {
  let nextId = 1;
  const callbacks = new Map<number, FrameRequestCallback>();

  return {
    scheduler: {
      requestAnimationFrame: (callback: FrameRequestCallback) => {
        const id = nextId++;
        callbacks.set(id, callback);
        return id;
      },
      cancelAnimationFrame: (id: number) => callbacks.delete(id),
    },
    flush: (time: number) => {
      const pending = [...callbacks.entries()];
      callbacks.clear();
      pending.forEach(([, callback]) => callback(time));
    },
    pendingCount: () => callbacks.size,
  };
};

describe("renderLifecycle", () => {
  it("uses the reduced GPU defaults", () => {
    expect(GPU_EFFECTS_MAX_FPS).toBe(30);
    expect(GPU_EFFECTS_RESOLUTION_SCALE).toBe(0.5);
  });

  it("limits rendering to the configured frame rate", () => {
    const { scheduler, flush } = createScheduler();
    const renderedAt: number[] = [];
    const loop = createThrottledAnimationLoop(
      (time) => renderedAt.push(time),
      30,
      scheduler,
    );

    loop.start();
    flush(0);
    flush(16);
    flush(34);
    flush(50);
    flush(68);

    expect(renderedAt).toEqual([0, 34, 68]);
  });

  it("does not duplicate loops and cancels pending work when stopped", () => {
    const { scheduler, flush, pendingCount } = createScheduler();
    const renderedAt: number[] = [];
    const loop = createThrottledAnimationLoop(
      (time) => renderedAt.push(time),
      30,
      scheduler,
    );

    loop.start();
    loop.start();
    expect(pendingCount()).toBe(1);

    flush(0);
    loop.stop();
    expect(loop.isRunning()).toBe(false);
    expect(pendingCount()).toBe(0);

    flush(40);
    expect(renderedAt).toEqual([0]);
  });

  it("reports activity only while the element and document are visible", () => {
    let intersectionCallback: IntersectionObserverCallback | undefined;
    let disconnected = false;
    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }

      observe() {}
      disconnect() {
        disconnected = true;
      }
    }

    const ownerDocument = new EventTarget() as EventTarget & {
      hidden: boolean;
      defaultView: { IntersectionObserver: typeof IntersectionObserver };
    };
    ownerDocument.hidden = false;
    ownerDocument.defaultView = {
      IntersectionObserver: MockIntersectionObserver as unknown as typeof IntersectionObserver,
    };
    const element = { ownerDocument } as unknown as Element;
    const activity: boolean[] = [];
    const stopObserving = observeRenderActivity(element, (active) => activity.push(active));

    intersectionCallback?.(
      [{ target: element, isIntersecting: false, intersectionRatio: 0 } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    ownerDocument.hidden = true;
    ownerDocument.dispatchEvent(new Event("visibilitychange"));
    intersectionCallback?.(
      [{ target: element, isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    ownerDocument.hidden = false;
    ownerDocument.dispatchEvent(new Event("visibilitychange"));

    expect(activity).toEqual([true, false, true]);
    stopObserving();
    expect(disconnected).toBe(true);
  });
});
