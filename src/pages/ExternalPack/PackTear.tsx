import { Flex } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  width?: number; // pack width in px
  height?: number; // visible height (only the top area)
  onOpened?: () => void; // callback when the pack opens
  onFail?: () => void; // optional: callback when a stroke ends without opening
};

export default function PackTear({
  width = 360,
  height = 20,
  onOpened,
  onFail,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [opened, setOpened] = useState(false);

  // “Bins” across the tear line to verify horizontal coverage
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
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    // HiDPI support
    const dpr = window.devicePixelRatio || 1;
    stateRef.current.dpr = dpr;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Fully transparent background; we only draw the stroke
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = LINE_THICKNESS;
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
  }, [width, height]);

  const clearCanvas = () => {
    const c = canvasRef.current!;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
  };

  const resetStroke = () => {
    stateRef.current.binsTouched.clear();
    stateRef.current.drawing = false;
    clearCanvas();
  };

  const xyFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (opened) return;
    // single-stroke requirement: every new press starts from zero
    resetStroke();

    (e.target as Element).setPointerCapture(e.pointerId);
    const { x, y } = xyFromEvent(e);
    const st = stateRef.current;
    st.drawing = true;
    st.lastX = x;
    st.lastY = y;
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const st = stateRef.current;
    if (!st.drawing || opened) return;

    const { x, y } = xyFromEvent(e);
    const ctx = canvasRef.current!.getContext("2d")!;

    // draw stroke (visual feedback)
    ctx.beginPath();
    ctx.moveTo(st.lastX, st.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    st.lastX = x;
    st.lastY = y;

    // mark bins if within the tear band
    const bandH = Math.min(TEAR_BAND_HEIGHT, height);
    const bandTop = (height - bandH) / 2;
    const bandBottom = bandTop + bandH;

    if (y >= bandTop && y <= bandBottom) {
      const binWidth = width / BIN_COUNT;
      const idx = Math.min(
        BIN_COUNT - 1,
        Math.max(0, Math.floor(x / binWidth))
      );
      st.binsTouched.add(idx);

      const coverage = st.binsTouched.size / BIN_COUNT;
      if (coverage >= COVERAGE_TARGET) {
        openPack();
      }
    }
  };

  const end = () => {
    const st = stateRef.current;
    if (!opened && st.binsTouched.size / BIN_COUNT < COVERAGE_TARGET) {
      // stroke ended without reaching target → reset (single-stroke requirement)
      onFail?.();
      resetStroke();
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
        // backgroundColor: "rgba(255,255,255,0.1)", // debug only
      }}
    >
      <Flex mx="30px" backgroundColor="rgba(255,255,255,0.4)" width="100%" height="3px"></Flex>
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
        style={{ position: "absolute", inset: 0 }}
      />
      {/* Debug guide for the tear band:
      <div style={{
        position:"absolute", left:0, right:0,
        top:(height - Math.min(TEAR_BAND_HEIGHT, height))/2,
        height:Math.min(TEAR_BAND_HEIGHT, height),
        border:"1px dashed rgba(255,255,255,0.25)"
      }}/> */}
    </Flex>
  );
}
