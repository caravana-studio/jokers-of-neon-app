import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import Tilt from "react-parallax-tilt";
import { TILT_OPTIONS } from "../constants/visualProps";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useGameStore } from "../state/useGameStore";
import { useSkinPreferencesStore } from "../state/useSkinPreferencesStore";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Card } from "../types/Card";
import { BrokenCard } from "./BrokenCard";
import CachedImage from "./CachedImage";
import { CardTooltip } from "./CardTooltip";
import { TemporalBadge } from "./TemporalBadge";

const specialEffectOverrideSweep = keyframes`
  0% {
    clip-path: inset(0 0 100% 0);
  }
  32.258% {
    clip-path: inset(0 0 100% 0);
  }
  48.387% {
    clip-path: inset(0 0 0 0);
  }
  51.613% {
    clip-path: inset(0 0 0 0);
  }
  67.742% {
    clip-path: inset(100% 0 0 0);
  }
  100% {
    clip-path: inset(100% 0 0 0);
  }
`;

const specialEffectOverrideSweepLine = keyframes`
  0% {
    top: -18%;
    opacity: 0;
  }
  32.258% {
    top: -18%;
    opacity: 0;
  }
  32.4% {
    top: -10%;
    opacity: 1;
  }
  48.387% {
    top: 100%;
    opacity: 1;
  }
  48.55% {
    top: 100%;
    opacity: 0;
  }
  51.613% {
    top: -18%;
    opacity: 0;
  }
  51.75% {
    top: -10%;
    opacity: 1;
  }
  67.742% {
    top: 100%;
    opacity: 1;
  }
  67.9% {
    top: 100%;
    opacity: 0;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
`;

interface ICardImage3DProps {
  card: Card;
  small?: boolean;
  hideTooltip?: boolean;
  showCumulativeProgress?: boolean;
  height?: string;
  width?: string;
  layerCount?: number;
  disableTilt?: boolean;
  imageSrc?: string;
  skinId?: number;
}

const checkImageExists = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};

export const CardImage3D = ({
  card,
  small = false,
  hideTooltip = false,
  showCumulativeProgress = false,
  height,
  width = "100%",
  layerCount = 4,
  disableTilt = false,
  imageSrc,
  skinId,
}: ICardImage3DProps) => {
  const cid = card.card_id ?? 0;
  const shouldUse3dLayers = !imageSrc;
  const storeSkinId = useSkinPreferencesStore((store) =>
    card.card_id !== undefined ? store.getSkinFor(card.card_id) : 0
  );

  const [availableLayers, setAvailableLayers] = useState<boolean[]>([]);
  const layersCheckIdRef = useRef(0);
  const preferredSkinId =
    typeof skinId === "number" ? skinId : storeSkinId;
  const resolvedSkinId = preferredSkinId > 0 ? preferredSkinId : 0;
  const layerPrefix =
    shouldUse3dLayers && resolvedSkinId > 0
      ? `${cid}_sk${resolvedSkinId}`
      : `${cid}`;

  useEffect(() => {
    if (!shouldUse3dLayers) {
      setAvailableLayers([]);
      return;
    }

    layersCheckIdRef.current += 1;
    const checkId = layersCheckIdRef.current;
    const checkLayers = async () => {
      setAvailableLayers([]);
      const results = await Promise.all(
        Array.from({ length: layerCount }, (_, i) =>
          checkImageExists(`/Cards/3d/${layerPrefix}-l${i}.png`)
        )
      );
      if (layersCheckIdRef.current !== checkId) return;
      setAvailableLayers(results);
    };
    checkLayers();
  }, [layerCount, layerPrefix, shouldUse3dLayers]);

  const borderRadius = small ? { base: "5px", sm: "8px" } : "20px";

  const { isSmallScreen } = useResponsiveValues();
  const { isClassic, state } = useGameStore();
  const showSilencedEffect = Boolean(
    card.isSpecial && card.silenced && state === GameStateEnum.Rage
  );
  const hasSpecialEffectOverrideBlend =
    card.isSpecial &&
    typeof card.specialEffectOverrideOriginalEffectCardId === "number" &&
    typeof card.specialEffectOverrideCopiedEffectCardId === "number";

  const showPlain =
    (isSmallScreen && small) ||
    !isClassic ||
    showSilencedEffect ||
    hasSpecialEffectOverrideBlend;

  const calculatedHeight = height ?? "100%";
  const plainImageSrc =
    imageSrc ??
    `/Cards/${cid}${resolvedSkinId > 0 ? `_sk${resolvedSkinId}` : ""}.png`;
  // Keep copied_effect_card_id visible most of the cycle.
  const baseEffectImageSrc = `/Cards/${card.specialEffectOverrideCopiedEffectCardId}${
    resolvedSkinId > 0 ? `_sk${resolvedSkinId}` : ""
  }.png`;
  const sweepEffectImageSrc = `/Cards/${card.specialEffectOverrideOriginalEffectCardId}${
    resolvedSkinId > 0 ? `_sk${resolvedSkinId}` : ""
  }.png`;
  const overrideSweepImage = (
    <Box
      position="absolute"
      width={width}
      height={calculatedHeight}
      borderRadius={borderRadius}
      zIndex={-1}
      overflow="hidden"
      pointerEvents={isSmallScreen ? "none" : "all"}
    >
      <CachedImage
        position="absolute"
        inset={0}
        borderRadius={borderRadius}
        src={baseEffectImageSrc}
        width={width}
        height={calculatedHeight}
      />
      <Box
        position="absolute"
        inset={0}
        borderRadius={borderRadius}
        sx={{
          animation: `${specialEffectOverrideSweep} 6.2s linear infinite`,
          willChange: "clip-path, opacity",
          overflow: "hidden",
        }}
      >
        <CachedImage
          position="absolute"
          inset={0}
          borderRadius={borderRadius}
          src={sweepEffectImageSrc}
          width={width}
          height={calculatedHeight}
          sx={{
            filter: "saturate(1.05)",
          }}
        />
      </Box>
      <Box
        position="absolute"
        left={0}
        right={0}
        height="20%"
        pointerEvents="none"
        sx={{
          animation: `${specialEffectOverrideSweepLine} 6.2s linear infinite`,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))",
          mixBlendMode: "screen",
          filter: "blur(6px)",
          willChange: "top, opacity",
        }}
      />
    </Box>
  );

  const plainImg = (
    <CachedImage
      position={"absolute"}
      borderRadius={borderRadius}
      src={plainImageSrc}
      width={width}
      height={calculatedHeight}
      zIndex={-1}
      pointerEvents={isSmallScreen ? "none" : "all"}
    />
  );

  const layer0Img = (
    <CachedImage
      position={"absolute"}
      borderRadius={borderRadius}
      src={`/Cards/3d/${layerPrefix}-l0.png`}
      width={width}
      height={calculatedHeight}
      zIndex={-1}
      pointerEvents={isSmallScreen ? "none" : "all"}
    />
  );

  const getLayerImage = (index: number) => {
    const scale = 1 - index * 0.05;
    const translateZ = (small ? 20 : 40) * index;

    return (
      <CachedImage
        key={`layer-${index}`}
        position="absolute"
        borderRadius={borderRadius}
        src={`/Cards/3d/${layerPrefix}-l${index}.png`}
        width={width}
        height={calculatedHeight}
        pointerEvents="none"
        transform={`scale(${scale}) translateZ(${translateZ}px)`}
      />
    );
  };

  return (
    <ConditionalTilt cardId={cid} small={small} disableTilt={disableTilt}>
      {/** Only render layered stack when layer 0 exists to avoid mixed skins */}
      {/** availableLayers[0] is checked below before rendering additional layers */}
      {hideTooltip ? (
        hasSpecialEffectOverrideBlend ? (
          overrideSweepImage
        ) : availableLayers[0] && !showPlain && shouldUse3dLayers ? (
          layer0Img
        ) : (
          plainImg
        )
      ) : (
        <CardTooltip
          card={card}
          showCumulativeProgress={showCumulativeProgress}
        >
          {hasSpecialEffectOverrideBlend
            ? overrideSweepImage
            : availableLayers[0] && !showPlain && shouldUse3dLayers
            ? layer0Img
            : plainImg}
        </CardTooltip>
      )}

      {shouldUse3dLayers &&
        availableLayers
          .map(
            (exists, i) =>
              availableLayers[0] && exists && i > 0 && !showPlain && getLayerImage(i)
          )
          .filter(Boolean)}

      <CachedImage
        src={`/Cards/empty.png`}
        pointerEvents="none"
        alt={`empty`}
        width={width}
        height={calculatedHeight}
      />

      {showSilencedEffect && <BrokenCard onDeck={false} isPack={false} isSpecial />}

      {card.temporary && card.remaining && (
        <TemporalBadge
          remaining={card.remaining}
          size={isSmallScreen ? (small ? "sm" : "lg") : "md"}
        />
      )}
    </ConditionalTilt>
  );
};

const ConditionalTilt = ({
  children,
  cardId,
  small,
  disableTilt = false,
}: {
  children: ReactNode;
  cardId: number;
  small: boolean;
  disableTilt?: boolean;
}) => {
  const { isSmallScreen } = useResponsiveValues();
  return (isSmallScreen && small) || disableTilt ? (
    <>{children}</>
  ) : (
    <Tilt
      {...TILT_OPTIONS}
      style={{
        transformStyle: "preserve-3d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      glareMaxOpacity={cardId < 100 ? TILT_OPTIONS.glareMaxOpacity : 0.2}
      glareBorderRadius={small ? "7px" : "18px"}
    >
      {children}
    </Tilt>
  );
};
