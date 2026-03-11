import { Box } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Image } from "@chakra-ui/react";

const lerpCos = (a: number, b: number, t: number) =>
  a + (1 - Math.cos(Math.PI * t)) * 0.5 * (b - a);

const makeRand = (seed = 1337) => {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
};

function catmullRomToBezier(p0: number[], p1: number[], p2: number[], p3: number[], t = 0.5) {
  const d1 = [(p2[0] - p0[0]) * t, (p2[1] - p0[1]) * t];
  const d2 = [(p3[0] - p1[0]) * t, (p3[1] - p1[1]) * t];
  const c1 = [p1[0] + d1[0] / 3, p1[1] + d1[1] / 3];
  const c2 = [p2[0] - d2[0] / 3, p2[1] - d2[1] / 3];
  return { c1, c2 };
}

function useSmoothClipPaths({
  width,
  height,
  cutRatio,
  amplitudePx = 5,
  frequency = 1.6,
  samples = 28,
  seed = 42,
}: {
  width: number;
  height: number;
  cutRatio: number;
  amplitudePx?: number;
  frequency?: number;
  samples?: number;
  seed?: number;
}) {
  return useMemo(() => {
    const w = Math.max(1, width);
    const h = Math.max(1, height);
    const cutY = Math.max(0, Math.min(h, h * cutRatio));

    const rand = makeRand(seed);
    const octave = Math.max(2, Math.round(frequency * 3));
    const anchors = new Array(octave + 1).fill(0).map(() => rand() * 2 - 1);

    const noiseAt = (t: number) => {
      const x = t * octave;
      const i = Math.floor(x);
      const f = x - i;
      const a = anchors[Math.min(i, octave)];
      const b = anchors[Math.min(i + 1, octave)];
      return lerpCos(a, b, f);
    };

    const pts: number[][] = [];
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const x = t * w;
      const y = cutY + Math.sin(t * Math.PI * 2 * frequency) * (amplitudePx * 0.45) + noiseAt(t) * (amplitudePx * 0.55);
      pts.push([x, y]);
    }
    pts[0][1] = cutY + (pts[0][1] - cutY) * 0.2;
    pts[pts.length - 1][1] = cutY + (pts[pts.length - 1][1] - cutY) * 0.2;

    const forward = (() => {
      const P = [pts[0], ...pts, pts[pts.length - 1]];
      let d = `M ${P[1][0].toFixed(2)} ${P[1][1].toFixed(2)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = P[i], p1 = P[i + 1], p2 = P[i + 2], p3 = P[i + 3];
        const { c1, c2 } = catmullRomToBezier(p0, p1, p2, p3, 0.6);
        d += ` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)}, ${c2[0].toFixed(2)} ${c2[1].toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
      }
      return d;
    })();

    const reversed = (() => {
      const R = [...pts].reverse();
      const P = [R[0], ...R, R[R.length - 1]];
      let d = `M ${P[1][0].toFixed(2)} ${P[1][1].toFixed(2)}`;
      for (let i = 0; i < R.length - 1; i++) {
        const p0 = P[i], p1 = P[i + 1], p2 = P[i + 2], p3 = P[i + 3];
        const { c1, c2 } = catmullRomToBezier(p0, p1, p2, p3, 0.6);
        d += ` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)}, ${c2[0].toFixed(2)} ${c2[1].toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
      }
      return d;
    })();

    const topPath = [`M 0 0`, `L ${w} 0`, `L ${w} ${pts[pts.length - 1][1].toFixed(2)}`, reversed.replace(/^M /, "L "), `L 0 ${pts[0][1].toFixed(2)}`, `Z`].join(" ");
    const bottomPath = [forward, `L ${w} ${h}`, `L 0 ${h}`, `Z`].join(" ");

    return { topPath, bottomPath };
  }, [width, height, cutRatio, amplitudePx, frequency, samples, seed]);
}

export function SplitPackOnce({
  src,
  onDone,
  cutRatio = 0.07,
  durationMs = 650,
  width = 360,
  height = 583,
  amplitudePx = 4,
  frequency = 1.5,
  samples = 28,
  step,
}: {
  src: string;
  onDone?: () => void;
  cutRatio?: number;
  durationMs?: number;
  width?: number;
  height?: number;
  amplitudePx?: number;
  frequency?: number;
  samples?: number;
  step: number;
}) {
  const [run, setRun] = useState(false);
  useEffect(() => {
    const rAF = requestAnimationFrame(() => setRun(true));
    const id = setTimeout(() => onDone?.(), durationMs + 80);
    return () => {
      cancelAnimationFrame(rAF);
      clearTimeout(id);
    };
  }, []);

  const { topPath, bottomPath } = useSmoothClipPaths({ width, height, cutRatio, amplitudePx, frequency, samples });

  const supportsPath =
    typeof CSS !== "undefined" &&
    CSS.supports?.("clip-path", 'path("M0,0 L10,0 L10,10 L0,10 Z")');

  return (
    <Box position="relative" w={width} h={height} pointerEvents="none">
      {/* TOP */}
      <Box
        position="absolute"
        inset={0}
        sx={supportsPath ? { clipPath: `path("${topPath}")` } : { clipPath: `inset(0 0 ${(1 - cutRatio) * 100}% 0)` }}
        willChange="transform, clip-path"
        transform={run ? "translateY(-18px) rotate(-0.4deg)" : "translateY(0)"}
        transition={`transform ${durationMs}ms cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease`}
        filter="drop-shadow(0 6px 8px rgba(0,0,0,0.55))"
        zIndex={1}
        opacity={step >= 3 ? 0 : 1}
      >
        <Image src={src} h="100%" w="100%" objectFit="contain" alt="" />
      </Box>

      {/* BOTTOM */}
      <Box
        position="absolute"
        inset={0}
        sx={supportsPath ? { clipPath: `path("${bottomPath}")` } : { clipPath: `inset(${cutRatio * 100}% 0 0 0)` }}
        willChange="transform, clip-path"
        transform={run ? "translateY(90px)" : "translateY(0)"}
        transition={`transform ${durationMs}ms cubic-bezier(0.22,1,0.36,1), opacity 1s ease`}
        filter="drop-shadow(0 10px 16px rgba(0,0,0,0.6))"
        zIndex={200}
        opacity={step >= 4 ? 0 : 1}
      >
        <Image src={src} h="100%" w="100%" objectFit="contain" alt="" />
      </Box>
    </Box>
  );
}
