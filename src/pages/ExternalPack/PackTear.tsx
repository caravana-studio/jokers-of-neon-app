import { Flex } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  width?: number; // pack width in px
  height?: number; // visible height (only the top area)
  onOpened?: () => void; // callback when the pack opens
  onFail?: () => void; // optional: callback when a stroke ends without opening
  step: number; // current step of the parent component
};

export default function PackTear({
  width = 360,
  height = 20,
  onOpened,
  onFail,
  step,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [opened, setOpened] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // bins across the tear line to verify horizontal coverage
  const BIN_COUNT = 24; // more bins = finer detection
  const COVERAGE_TARGET = 0.8; // 80% of bins touched
  const TEAR_BAND_HEIGHT = 28; // vertical band where the stroke must pass
  const LINE_THICKNESS = 3; // visual line thickness

  // internal state
  const stateRef = useRef({
    drawing: false,
    binsTouched: new Set<number>(),
    lastX: 0,
    lastY: 0,
    dpr: 1,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // perf hint (some browsers ignore it; it's harmless)
    const ctx = (canvas.getContext("2d", { desynchronized: true } as any) ||
      canvas.getContext("2d")) as CanvasRenderingContext2D;
    const dpr = window.devicePixelRatio || 1;
    stateRef.current.dpr = dpr;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // fully transparent background; we only draw the stroke
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = LINE_THICKNESS;
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
  }, [width, height]);

  const clearCanvas = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
  };

  const resetStroke = () => {
    stateRef.current.binsTouched.clear();
    stateRef.current.drawing = false;
    clearCanvas();
  };

  const xyFromEvent = (
    target: HTMLCanvasElement,
    clientX: number,
    clientY: number
  ) => {
    const rect = target.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // helper: mark every bin crossed between two X positions
  const addBinsCrossed = (x0: number, x1: number) => {
    const binWidth = width / BIN_COUNT;
    let a = Math.floor(Math.min(x0, x1) / binWidth);
    let b = Math.floor(Math.max(x0, x1) / binWidth);
    a = Math.max(0, a);
    b = Math.min(BIN_COUNT - 1, b);
    for (let i = a; i <= b; i++) stateRef.current.binsTouched.add(i);
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (opened || !canvasRef.current) return;
    // single-stroke requirement: every new press starts from zero
    resetStroke();

    setIsDrawing(true);

    (e.target as Element).setPointerCapture(e.pointerId);
    const { x, y } = xyFromEvent(canvasRef.current, e.clientX, e.clientY);
    const st = stateRef.current;
    st.drawing = true;
    st.lastX = x;
    st.lastY = y;
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const st = stateRef.current;
    if (!st.drawing || opened) return;

    const ctx = canvas.getContext("2d")!;
    const bandH = Math.min(TEAR_BAND_HEIGHT, height);
    const bandTop = (height - bandH) / 2;
    const bandBottom = bandTop + bandH;

    // use coalesced events to avoid gaps at high speed
    const nativeEvt = e.nativeEvent as PointerEvent;
    const coalesced = nativeEvt.getCoalescedEvents?.() ?? [nativeEvt];

    for (const pev of coalesced) {
      const { x, y } = xyFromEvent(canvas, pev.clientX, pev.clientY);

      // draw stroke (visual feedback)
      ctx.beginPath();
      ctx.moveTo(st.lastX, st.lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // if the segment intersects the tear band, mark all crossed bins
      // fast + simple check: consider the current point y
      if (y >= bandTop && y <= bandBottom) {
        addBinsCrossed(st.lastX, x);
        const coverage = st.binsTouched.size / BIN_COUNT;
        if (coverage >= COVERAGE_TARGET) {
          openPack();
          return; // stop processing more points after opening
        }
      }

      st.lastX = x;
      st.lastY = y;
    }
  };

  const end = () => {
    const st = stateRef.current;
    if (!opened && st.binsTouched.size / BIN_COUNT < COVERAGE_TARGET) {
      // stroke ended without reaching target → reset (single-stroke requirement)
      onFail?.();
      resetStroke();
      setIsDrawing(false);
    } else {
      st.drawing = false;
    }
  };

  const openPack = () => {
    if (opened) return;
    setOpened(true);
    onOpened?.();
    clearCanvas();
  };

  return (
    <Flex
      style={{
        position: "absolute",
        alignItems: "center",
        marginLeft: "-30px",
        marginTop: "15px",
        width,
        height,
        userSelect: "none",
        touchAction: "none", // prevent page scroll while drawing
      }}
    >
      <Flex
        mx="30px"
        opacity={step === 1 ? 1 : 0}
        transition="all 1s ease"
        backgroundColor={isDrawing ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}
        width="100%"
        height="3px"
        position="relative"
        overflow="hidden"
        borderRadius="md"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: "-30%",
          width: "50%",
          height: "100%",
          background: isDrawing ? '' : "linear-gradient(90deg, transparent, white, transparent)",
          filter: "blur(1px)",
          animation: "glowMove 2s linear infinite",
          animationPlayState: isDrawing ? "paused" : "running",
        }}
        sx={{
          "@keyframes glowMove": {
            "0%": { left: "-30%" },
            "100%": { left: "100%" },
          },
        }}
      />

      <canvas
        ref={canvasRef}
        onPointerDown={step === 1 ? start : undefined}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Debug guide for the tear band: */}
      {/*       <div style={{
        position:"absolute", left:0, right:0,
        top:(height - Math.min(TEAR_BAND_HEIGHT, height))/2,
        height:Math.min(TEAR_BAND_HEIGHT, height),
        border:"1px dashed rgba(255,255,255,0.25)"
      }}/> */}
    </Flex>
  );
}
