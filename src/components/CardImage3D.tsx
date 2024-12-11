import { ReactNode, useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import { TILT_OPTIONS } from "../constants/visualProps";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Card } from "../types/Card";
import CachedImage from "./CachedImage";
import { TemporalBadge } from "./TiltCard";

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
}: {
  card: Card;
  small?: boolean;
}) => {
  const cid = card.card_id ?? 0;

  const [image1Available, setImage1Available] = useState(false);
  const [image2Available, setImage2Available] = useState(false);

  useEffect(() => {
    const src1 = `Cards/big/${cid}-l1.png`;
    const src2 = `Cards/big/${cid}-l2.png`;

    checkImageExists(src1).then(setImage1Available);
    checkImageExists(src2).then(setImage2Available);
  }, [cid]);

  const borderRadius = small ? { base: "5px", sm: "8px" } : "20px";

  const { isSmallScreen } = useResponsiveValues();

  const showPlain = isSmallScreen && small;

  return (
    <ConditionalTilt cardId={cid} small={small}>
      <CachedImage
        position={"absolute"}
        borderRadius={borderRadius}
        src={`/Cards/${showPlain ? "" : "big/"}${cid}.png`}
        width={"100%"}
        zIndex={-1}
      />
      {!showPlain && image1Available && (
        <CachedImage
          position={"absolute"}
          borderRadius={borderRadius}
          src={`/Cards/big/${cid}-l1.png`}
          width={"100%"}
          transform={`translateZ(${small ? 20 : 60}px)`}
        />
      )}
      {!showPlain && image2Available && (
        <CachedImage
          position={"absolute"}
          borderRadius={borderRadius}
          src={`/Cards/big/${cid}-l2.png`}
          width={"100%"}
          transform={`translateZ(${small ? 40 : 80}px)`}
        />
      )}
      <CachedImage src={`/Cards/big/empty.png`} alt={`empty`} width={"100%"} />
      {card.temporary && card.remaining && (
        <TemporalBadge remaining={card.remaining} scale={1.6} />
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
      glareMaxOpacity={cardId < 53 ? 0.8 : 0.2}
      glareBorderRadius={small ? "7px" : "18px"}
    >
      {children}
    </Tilt>
  );
};
