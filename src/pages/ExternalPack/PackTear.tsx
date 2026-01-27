import { Flex } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  width?: number;
  height?: number;
  packWidth?: number; // actual pack width for clipping
  onOpened?: () => void;
  onFail?: () => void;
  step: number;
  color: "white" | "black";
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  opacity: number;
}

interface TrailPoint {
  x: number;
  y: number;
  time: number;
  velocity: number;
}

export default function PackTear({
  width = 360,
  height = 40,
  packWidth,
  onOpened,
  onFail,
  step,
  color,
}: Props) {
  // Calculate clip boundaries (pack area within the canvas)
  const clipLeft = 32; // marginLeft offset + small inset
  const clipRight = clipLeft + (packWidth ?? width - 50) - 4;
  const clipPadding = 0; // no padding - strict clipping
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const guideCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [opened, setOpened] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const BIN_COUNT = 24;
  const COVERAGE_TARGET = 0.8;
  const TEAR_BAND_HEIGHT = 40;

  const TRAIL_DURATION = 900;
  const PARTICLE_SPAWN_RATE = 0.25;

  // Smoother color palette
  const colors = color === "white"
    ? { primary: [180, 220, 255], secondary: [220, 180, 255], accent: [255, 255, 255] }
    : { primary: [255, 120, 80], secondary: [255, 180, 100], accent: [255, 255, 200] };

  const stateRef = useRef({
    drawing: false,
    binsTouched: new Set<number>(),
    lastX: 0,
    lastY: 0,
    dpr: 1,
    particles: [] as Particle[],
    trail: [] as TrailPoint[],
    cursorPos: { x: 0, y: 0 },
    lastTime: 0,
    animationId: 0,
    guideAnimationId: 0,
    velocity: 0,
    smoothVelocity: 0,
  });

  // Interpolate between trail points for smoother curves
  const getInterpolatedTrail = useCallback((trail: TrailPoint[], now: number) => {
    if (trail.length < 2) return trail;

    const result: TrailPoint[] = [];
    for (let i = 0; i < trail.length - 1; i++) {
      const p0 = trail[Math.max(0, i - 1)];
      const p1 = trail[i];
      const p2 = trail[i + 1];
      const p3 = trail[Math.min(trail.length - 1, i + 2)];

      result.push(p1);

      // Add interpolated points using Catmull-Rom spline
      const steps = 3;
      for (let t = 1; t <= steps; t++) {
        const s = t / (steps + 1);
        const tt = s * s;
        const ttt = tt * s;

        const x = 0.5 * (
          (2 * p1.x) +
          (-p0.x + p2.x) * s +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * ttt
        );
        const y = 0.5 * (
          (2 * p1.y) +
          (-p0.y + p2.y) * s +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * ttt
        );

        result.push({
          x,
          y,
          time: p1.time + (p2.time - p1.time) * s,
          velocity: p1.velocity + (p2.velocity - p1.velocity) * s,
        });
      }
    }
    result.push(trail[trail.length - 1]);
    return result;
  }, []);

  const spawnParticles = useCallback((x: number, y: number, count: number, velocity: number) => {
    const st = stateRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (1 + Math.random() * 3) * (1 + velocity * 0.4);
      st.particles.push({
        x: x + (Math.random() - 0.5) * 3,
        y: y + (Math.random() - 0.5) * 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        life: 1,
        maxLife: 400 + Math.random() * 500,
        size: 1.5 + Math.random() * 2.5, // Much bigger sparkles
        hue: Math.random(),
        opacity: 0.8 + Math.random() * 0.2,
      });
    }
  }, []);

  const renderFrame = useCallback((ctx: CanvasRenderingContext2D, deltaTime: number) => {
    const st = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width / st.dpr;
    const h = canvas.height / st.dpr;

    ctx.clearRect(0, 0, w, h);

    // Apply clipping to keep effects within pack boundaries
    ctx.save();
    ctx.beginPath();
    ctx.rect(clipLeft - clipPadding, 0, clipRight - clipLeft + clipPadding * 2, h);
    ctx.clip();

    const now = performance.now();

    // Smooth velocity interpolation
    st.smoothVelocity += (st.velocity - st.smoothVelocity) * 0.15;

    // Filter old trail points
    st.trail = st.trail.filter(point => (now - point.time) < TRAIL_DURATION);

    // Get interpolated trail for smoother rendering
    const smoothTrail = getInterpolatedTrail(st.trail, now);

    // Draw smooth trail using quadratic bezier curves
    if (smoothTrail.length > 1) {
      ctx.globalCompositeOperation = 'lighter';

      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.moveTo(smoothTrail[0].x, smoothTrail[0].y);

        // Use quadratic bezier curves for ultra-smooth rendering
        for (let i = 1; i < smoothTrail.length - 1; i++) {
          const curr = smoothTrail[i];
          const next = smoothTrail[i + 1];
          const midX = (curr.x + next.x) / 2;
          const midY = (curr.y + next.y) / 2;
          ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
        }
        // Connect to last point
        if (smoothTrail.length > 1) {
          const last = smoothTrail[smoothTrail.length - 1];
          ctx.lineTo(last.x, last.y);
        }

        const layerConfigs = [
          { width: 8, opacity: 0.12, color: colors.secondary },
          { width: 4, opacity: 0.35, color: colors.primary },
          { width: 1.5, opacity: 1, color: colors.accent },
        ];

        const config = layerConfigs[layer];
        const lastPoint = smoothTrail[smoothTrail.length - 1];
        const age = now - lastPoint.time;
        const fadeStart = TRAIL_DURATION * 0.6;
        const globalAlpha = age > fadeStart
          ? Math.max(0, 1 - (age - fadeStart) / (TRAIL_DURATION - fadeStart))
          : 1;

        ctx.strokeStyle = `rgba(${config.color.join(',')}, ${config.opacity * globalAlpha})`;
        ctx.lineWidth = config.width + st.smoothVelocity * (layer === 0 ? 2 : layer === 1 ? 1 : 0);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';
    }

    // Update and render sparkles - much more visible
    ctx.globalCompositeOperation = 'lighter';

    st.particles = st.particles.filter(p => {
      p.life -= deltaTime / p.maxLife;
      if (p.life <= 0) return false;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.vx *= 0.97;
      p.vy *= 0.97;

      const alpha = p.life * p.opacity;
      const size = p.size * (0.6 + p.life * 0.4);

      // Bright sparkle with sharp center
      const particleColor = p.hue > 0.5 ? colors.primary : colors.secondary;

      // Outer glow
      const outerGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
      outerGrad.addColorStop(0, `rgba(${particleColor.join(',')}, ${alpha * 0.6})`);
      outerGrad.addColorStop(0.4, `rgba(${particleColor.join(',')}, ${alpha * 0.2})`);
      outerGrad.addColorStop(1, `rgba(${particleColor.join(',')}, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
      ctx.fillStyle = outerGrad;
      ctx.fill();

      // Bright white core - this makes sparkles pop
      const coreGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 1);
      coreGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      coreGrad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.7})`);
      coreGrad.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      return true;
    });

    ctx.globalCompositeOperation = 'source-over';

    // Draw cursor glow when drawing
    if (st.drawing) {
      const { x, y } = st.cursorPos;
      const pulse = 1 + Math.sin(now * 0.008) * 0.1;
      const glowSize = (9 + st.smoothVelocity * 3) * pulse;

      ctx.globalCompositeOperation = 'lighter';

      // Soft outer glow
      const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
      outerGlow.addColorStop(0, `rgba(${colors.primary.join(',')}, 0.35)`);
      outerGlow.addColorStop(0.4, `rgba(${colors.secondary.join(',')}, 0.12)`);
      outerGlow.addColorStop(1, `rgba(${colors.secondary.join(',')}, 0)`);

      ctx.beginPath();
      ctx.arc(x, y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Bright core
      const coreGlow = ctx.createRadialGradient(x, y, 0, x, y, glowSize * 0.3);
      coreGlow.addColorStop(0, `rgba(255, 255, 255, 0.9)`);
      coreGlow.addColorStop(0.5, `rgba(${colors.accent.join(',')}, 0.5)`);
      coreGlow.addColorStop(1, `rgba(${colors.primary.join(',')}, 0)`);

      ctx.beginPath();
      ctx.arc(x, y, glowSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = coreGlow;
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.restore(); // Restore from clipping
  }, [colors, getInterpolatedTrail, TRAIL_DURATION, clipLeft, clipRight, clipPadding]);

  // Separate animation for the guide line light beam
  const renderGuide = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvas = guideCanvasRef.current;
    if (!canvas || step !== 1 || isDrawing) return;

    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    const now = performance.now();

    ctx.clearRect(0, 0, w, h);

    // Apply clipping to keep effects within pack boundaries
    ctx.save();
    ctx.beginPath();
    ctx.rect(clipLeft - clipPadding, 0, clipRight - clipLeft + clipPadding * 2, h);
    ctx.clip();

    // Line boundaries
    const lineY = h / 2;
    const lineStartX = clipLeft + 5;
    const lineEndX = clipRight - 5;
    const lineLength = lineEndX - lineStartX;
    const LINE_THICKNESS = 6; // Thicker line

    // Colors
    const baseColor = color === "white" ? [140, 160, 200] : [200, 80, 60];
    const highlightColor = color === "white" ? [200, 220, 255] : [255, 160, 120];

    // Draw the main line with vertical gradient (internal glow effect)
    const verticalGrad = ctx.createLinearGradient(0, lineY - LINE_THICKNESS / 2, 0, lineY + LINE_THICKNESS / 2);
    verticalGrad.addColorStop(0, `rgba(${baseColor.join(',')}, 0.3)`);
    verticalGrad.addColorStop(0.3, `rgba(${baseColor.join(',')}, 0.5)`);
    verticalGrad.addColorStop(0.5, `rgba(${highlightColor.join(',')}, 0.7)`);
    verticalGrad.addColorStop(0.7, `rgba(${baseColor.join(',')}, 0.5)`);
    verticalGrad.addColorStop(1, `rgba(${baseColor.join(',')}, 0.3)`);

    ctx.beginPath();
    ctx.moveTo(lineStartX, lineY);
    ctx.lineTo(lineEndX, lineY);
    ctx.strokeStyle = verticalGrad;
    ctx.lineWidth = LINE_THICKNESS;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Animated highlight that travels along the line (internal only)
    const beamSpeed = 0.0004;
    const beamWidth = 0.3;
    const beamPos = ((now * beamSpeed) % 1.4) - 0.2;

    const beamCenterX = lineStartX + lineLength * (beamPos + beamWidth / 2);
    const beamStartX = lineStartX + lineLength * beamPos;
    const beamEndX = beamStartX + lineLength * beamWidth;

    // Horizontal gradient for the traveling highlight
    const beamGrad = ctx.createLinearGradient(beamStartX, 0, beamEndX, 0);
    beamGrad.addColorStop(0, `rgba(255, 255, 255, 0)`);
    beamGrad.addColorStop(0.1, `rgba(255, 255, 255, 0.1)`);
    beamGrad.addColorStop(0.3, `rgba(255, 255, 255, 0.6)`);
    beamGrad.addColorStop(0.1, `rgba(255, 255, 255, 0.1)`);
    beamGrad.addColorStop(1, `rgba(255, 255, 255, 0)`);

    // Draw highlight on top of line (same thickness - stays within line)
    ctx.beginPath();
    ctx.moveTo(beamStartX, lineY);
    ctx.lineTo(beamEndX, lineY);
    ctx.strokeStyle = beamGrad;
    ctx.lineWidth = LINE_THICKNESS - 1; // Slightly smaller to stay inside
    ctx.lineCap = 'round';
    ctx.stroke();

    // Thin bright center line for the highlight
    ctx.beginPath();
    ctx.moveTo(beamStartX, lineY);
    ctx.lineTo(beamEndX, lineY);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(now * 0.005) * 0.2})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore(); // Restore from clipping
  }, [step, isDrawing, color, clipLeft, clipRight, clipPadding]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    const st = stateRef.current;
    st.lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const deltaTime = Math.min(now - st.lastTime, 50); // Cap delta to avoid jumps
      st.lastTime = now;

      renderFrame(ctx, deltaTime);
      st.animationId = requestAnimationFrame(animate);
    };

    st.animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(st.animationId);
    };
  }, [renderFrame]);

  // Guide line animation loop
  useEffect(() => {
    const canvas = guideCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    const st = stateRef.current;

    const animateGuide = () => {
      renderGuide(ctx);
      st.guideAnimationId = requestAnimationFrame(animateGuide);
    };

    st.guideAnimationId = requestAnimationFrame(animateGuide);

    return () => {
      cancelAnimationFrame(st.guideAnimationId);
    };
  }, [renderGuide]);

  // Setup canvases
  useEffect(() => {
    const setupCanvas = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: true })!;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return dpr;
    };

    const dpr = setupCanvas(canvasRef.current);
    setupCanvas(guideCanvasRef.current);
    if (dpr) stateRef.current.dpr = dpr;
  }, [width, height]);

  const resetStroke = () => {
    const st = stateRef.current;
    st.binsTouched.clear();
    st.drawing = false;
    st.trail = [];
    st.particles = [];
    st.velocity = 0;
    st.smoothVelocity = 0;
  };

  const xyFromEvent = (
    target: HTMLCanvasElement,
    clientX: number,
    clientY: number
  ) => {
    const rect = target.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

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
    resetStroke();

    setIsDrawing(true);

    (e.target as Element).setPointerCapture(e.pointerId);
    const { x, y } = xyFromEvent(canvasRef.current, e.clientX, e.clientY);
    const st = stateRef.current;
    st.drawing = true;
    st.lastX = x;
    st.lastY = y;
    st.cursorPos = { x, y };

    spawnParticles(x, y, 8, 0);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const st = stateRef.current;
    if (!st.drawing || opened) return;

    const bandH = Math.min(TEAR_BAND_HEIGHT, height);
    const bandTop = (height - bandH) / 2;
    const bandBottom = bandTop + bandH;

    const nativeEvt = e.nativeEvent as PointerEvent;
    const coalesced = nativeEvt.getCoalescedEvents?.() ?? [nativeEvt];
    const now = performance.now();

    for (const pev of coalesced) {
      const { x, y } = xyFromEvent(canvas, pev.clientX, pev.clientY);

      const dx = x - st.lastX;
      const dy = y - st.lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      st.velocity = Math.min(distance / 8, 4);

      st.trail.push({
        x,
        y,
        time: now,
        velocity: st.velocity,
      });

      const particleCount = Math.floor(distance * PARTICLE_SPAWN_RATE);
      if (particleCount > 0) {
        spawnParticles(x, y, particleCount, st.velocity);
      }

      st.cursorPos = { x, y };

      if (y >= bandTop && y <= bandBottom) {
        addBinsCrossed(st.lastX, x);
        const coverage = st.binsTouched.size / BIN_COUNT;
        if (coverage >= COVERAGE_TARGET) {
          openPack(x, y);
          return;
        }
      }

      st.lastX = x;
      st.lastY = y;
    }
  };

  const end = () => {
    const st = stateRef.current;
    if (!opened && st.binsTouched.size / BIN_COUNT < COVERAGE_TARGET) {
      onFail?.();
      resetStroke();
      setIsDrawing(false);
    } else {
      st.drawing = false;
    }
  };

  const openPack = (x: number, y: number) => {
    if (opened) return;

    spawnParticles(x, y, 25, 4);

    setOpened(true);
    onOpened?.();

    setTimeout(() => {
      resetStroke();
    }, 150);
  };

  return (
    <Flex
      style={{
        position: "absolute",
        alignItems: "center",
        marginLeft: "-30px",
        marginTop: "5px",
        width,
        height,
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* Guide line canvas */}
      <canvas
        ref={guideCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: step === 1 && !isDrawing ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Main effects canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={step === 1 ? start : undefined}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
        style={{
          position: "absolute",
          inset: 0,
        }}
      />
    </Flex>
  );
}
