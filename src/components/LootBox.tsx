import { forwardRef, useImperativeHandle, useRef } from "react";
import SpineAnimation, { SpineAnimationRef } from "./SpineAnimation";
import { animationsData } from "../constants/spineAnimations";

export interface LootBoxRef {
  openBox: () => void;
}

interface LootBoxProps {
  boxId: number;
  onOpenAnimationStart?: () => void;
  onOpenAnimationEnd?: () => void;
  onClick?: () => void;
  width?: number;
  height?: number;
  xOffset?: number;
  scale?: number;
  isPurchased?: boolean;
  initialAnimation?: string;
  hoverAnimation?: string;
  price?: number;
  discountPrice?: number;
  freezeOnLastFrame?: boolean;
}

export const LootBox = forwardRef<LootBoxRef, LootBoxProps>(
  (
    {
      boxId,
      onOpenAnimationStart,
      onOpenAnimationEnd,
      width = 1200,
      height = 1500,
      xOffset = -650,
      scale = 1,
      isPurchased,
      initialAnimation,
      hoverAnimation,
      price,
      discountPrice,
      onClick,
      freezeOnLastFrame,
    },
    ref
  ) => {
    const spineAnimationRef = useRef<SpineAnimationRef>(null);

    useImperativeHandle(ref, () => ({
      openBox: () => {
        spineAnimationRef.current?.playOpenBoxAnimation();
      },
    }));

    return (
      <SpineAnimation
        ref={spineAnimationRef}
        jsonUrl={`/spine-animations/loot_box_${boxId}.json`}
        atlasUrl={`/spine-animations/loot_box_${boxId}.atlas`}
        initialAnimation={initialAnimation ?? animationsData.loopAnimation}
        loopAnimation={animationsData.loopAnimation}
        openBoxAnimation={animationsData.openBoxAnimation}
        hoverAnimation={hoverAnimation}
        width={width}
        height={height}
        xOffset={xOffset}
        scale={scale}
        onOpenAnimationStart={onOpenAnimationStart}
        onOpenAnimationEnd={onOpenAnimationEnd}
        isPurchased={isPurchased}
        price={price}
        discountPrice={discountPrice}
        onClick={onClick}
        freezeOnLastFrame={freezeOnLastFrame}
      />
    );
  }
);

LootBox.displayName = "LootBox";
