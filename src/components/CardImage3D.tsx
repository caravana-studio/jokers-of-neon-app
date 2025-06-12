import { ReactNode, useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import { TILT_OPTIONS } from "../constants/visualProps";
import { useGameContext } from "../providers/GameProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Card } from "../types/Card";
import CachedImage from "./CachedImage";
import { CardTooltip } from "./CardTooltip";
import { TemporalBadge } from "./TemporalBadge";

interface ICardImage3DProps {
  card: Card;
  small?: boolean;
  hideTooltip?: boolean;
  height?: string;
  width?: string;
  layerCount?: number;
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
  height,
  width = "100%",
  layerCount = 4,
}: ICardImage3DProps) => {
  const cid = card.card_id ?? 0;

  const [availableLayers, setAvailableLayers] = useState<boolean[]>([]);

  useEffect(() => {
    const checkLayers = async () => {
      const results = await Promise.all(
        Array.from({ length: layerCount }, (_, i) =>
          checkImageExists(`/Cards/3d/${cid}-l${i}.png`)
        )
      );
      setAvailableLayers(results);
    };
    checkLayers();
  }, [cid]);

  const borderRadius = small ? { base: "5px", sm: "8px" } : "20px";

  const { isSmallScreen } = useResponsiveValues();
  const { isClassic } = useGameContext();

  const showPlain = (isSmallScreen && small) || !isClassic;

  const calculatedHeight = height ?? "100%";

  const plainImg = (
    <CachedImage
      position={"absolute"}
      borderRadius={borderRadius}
      src={`/Cards/${cid}.png`}
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
      src={`/Cards/3d/${cid}-l0.png`}
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
        src={`/Cards/3d/${cid}-l${index}.png`}
        width={width}
        height={calculatedHeight}
        pointerEvents="none"
        transform={`scale(${scale}) translateZ(${translateZ}px)`}
      />
    );
  };

  return (
    <ConditionalTilt cardId={cid} small={small}>
      {hideTooltip ? (
        availableLayers[0] && !showPlain ? (
          layer0Img
        ) : (
          plainImg
        )
      ) : (
        <CardTooltip card={card}>
          {availableLayers[0] && !showPlain ? layer0Img : plainImg}
        </CardTooltip>
      )}

      {availableLayers
        .map((exists, i) => exists && i > 0 && !showPlain && getLayerImage(i))
        .filter(Boolean)}

      <CachedImage
        src={`/Cards/empty.png`}
        pointerEvents="none"
        alt={`empty`}
        width={width}
        height={calculatedHeight}
      />

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
}: {
  children: ReactNode;
  cardId: number;
  small: boolean;
}) => {
  const { isSmallScreen } = useResponsiveValues();
  return isSmallScreen && small ? (
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
