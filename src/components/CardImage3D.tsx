import { Tooltip } from "@chakra-ui/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import Tilt from "react-parallax-tilt";
import { TILT_OPTIONS } from "../constants/visualProps";
import { useGameContext } from "../providers/GameProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Card } from "../types/Card";
import { getTooltip } from "../utils/getTooltip";
import CachedImage from "./CachedImage";
import { TemporalBadge } from "./TemporalBadge";

interface ICardImage3DProps {
  card: Card;
  small?: boolean;
  hideTooltip?: boolean;
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
}: ICardImage3DProps) => {
  const cid = card.card_id ?? 0;

  const [layer0Available, setLayer0Available] = useState(false);
  const [layer1Available, setLayer1Available] = useState(false);
  const [layer2Available, setLayer2Available] = useState(false);

  useEffect(() => {
    const src0 = `/Cards/3d/${cid}-l0.png`;
    const src1 = `/Cards/3d/${cid}-l1.png`;
    const src2 = `/Cards/3d/${cid}-l2.png`;

    checkImageExists(src0).then(setLayer0Available);
    checkImageExists(src1).then(setLayer1Available);
    checkImageExists(src2).then(setLayer2Available);
  }, [cid]);

  const borderRadius = small ? { base: "5px", sm: "8px" } : "20px";

  const { isSmallScreen } = useResponsiveValues();
  const { isClassic } = useGameContext();

  const showPlain = (isSmallScreen && small) || !isClassic;

  const mainImg = useMemo(() => {
    return <CachedImage
      position={"absolute"}
      borderRadius={borderRadius}
      src={
        layer0Available && !showPlain
          ? `/Cards/3d/${cid}-l0.png`
          : `/Cards/${cid}.png`
      }
      width={"100%"}
      zIndex={-1}
      pointerEvents={isSmallScreen ? "none" : "all"}
    />
  }, [layer0Available, cid, showPlain]);

  return (
    <ConditionalTilt cardId={cid} small={small}>
      {hideTooltip ? (
        mainImg
      ) : (
        <Tooltip hasArrow label={getTooltip(card, false)} closeOnPointerDown>
          {mainImg}
        </Tooltip>
      )}

      {layer1Available && !showPlain && (
        <CachedImage
          position={"absolute"}
          borderRadius={borderRadius}
          src={`/Cards/3d/${cid}-l1.png`}
          width={"100%"}
          pointerEvents="none"
          transform={`scale(0.95) translateZ(${small ? 20 : 60}px)`}
        />
      )}
      {layer2Available && !showPlain && (
        <CachedImage
          position={"absolute"}
          borderRadius={borderRadius}
          src={`/Cards/3d/${cid}-l2.png`}
          width={"100%"}
          pointerEvents="none"
          transform={`scale(0.9) translateZ(${small ? 40 : 80}px)`}
        />
      )}

      <CachedImage
        src={`/Cards/empty.png`}
        pointerEvents="none"
        alt={`empty`}
        width={"100%"}
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
      style={{ transformStyle: "preserve-3d" }}
      glareMaxOpacity={cardId < 100 ? TILT_OPTIONS.glareMaxOpacity : 0.2}
      glareBorderRadius={small ? "7px" : "18px"}
    >
      {children}
    </Tilt>
  );
};
