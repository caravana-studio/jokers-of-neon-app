import { forwardRef } from "react";
import SpineAnimation, { SpineAnimationRef } from "./SpineAnimation";
import { BlisterPackItem } from "../dojo/typescript/models.gen";
import { animationsData } from "../constants/spineAnimations";

interface LootBoxProps {
  pack: BlisterPackItem;
  onOpenAnimationStart?: () => void;
  width?: number;
  height?: number;
  xOffset?: number;
  scale?: number;
}

export const LootBox = forwardRef<SpineAnimationRef, LootBoxProps>(
  (
    {
      pack,
      onOpenAnimationStart,
      width = 1200,
      height = 1500,
      xOffset = -650,
      scale = 1,
    },
    ref
  ) => {
    return (
      <SpineAnimation
        ref={ref}
        jsonUrl={`/spine-animations/loot_box_${pack.blister_pack_id}.json`}
        atlasUrl={`/spine-animations/loot_box_${pack.blister_pack_id}.atlas`}
        initialAnimation={animationsData.loopAnimation}
        loopAnimation={animationsData.loopAnimation}
        openBoxAnimation={animationsData.openBoxAnimation}
        width={width}
        height={height}
        xOffset={xOffset}
        scale={scale}
        onOpenAnimationStart={onOpenAnimationStart}
      />
    );
  }
);

LootBox.displayName = "LootBox";
