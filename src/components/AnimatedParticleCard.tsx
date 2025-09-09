import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PatternParticleAnimation,
  PatternParticleAnimationRef,
} from "./animations/PatternParticlesAnimation";
import { AnimatedCard, IAnimatedCardProps } from "./AnimatedCard";
import { useCardAnimations } from "../providers/CardAnimationsProvider";
import { VFX_TRIANGLE_MULTI, VFX_TRIANGLE_POINTS } from "../constants/vfx";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps";

interface IAnimatedParticleCardProps extends IAnimatedCardProps {}

export const AnimatedParticleCard = ({
  children,
  idx,
  discarded = false,
  played = false,
  isSpecial = false,
  scale,
}: IAnimatedParticleCardProps) => {
  const { animatedCard } = useCardAnimations();
  const animatedCardIdxArray = useMemo(() => {
    return isSpecial ? [animatedCard?.special_idx] : animatedCard?.idx;
  }, [animatedCard?.idx, animatedCard?.special_idx, isSpecial]);
  const multi = useMemo(() => animatedCard?.multi, [animatedCard?.multi]);
  const isAccumulative = useMemo(
    () => animatedCard?.isAccumulative,
    [animatedCard?.isAccumulative]
  );
  const animationIndex = useMemo(
    () => animatedCard?.animationIndex,
    [animatedCard?.animationIndex]
  );

  const { cardScale, isCardScaleCalculated } = useResponsiveValues();

  const actualScale = useMemo(() => scale || cardScale, [scale, cardScale]);

  const [vfxSrc, setVfxSrc] = useState<string>("");
  const vfxRef = useRef<PatternParticleAnimationRef>(null);

  // Effect 1: Determine if VFX is needed and set the source
  useEffect(() => {
    if (isAccumulative && animatedCardIdxArray?.includes(idx)) {
      const vfx = multi ? VFX_TRIANGLE_MULTI : VFX_TRIANGLE_POINTS;
      if (vfx !== vfxSrc) {
        // Only update state if the source actually changes
        setVfxSrc(vfx);
      }
    } else if (vfxSrc) {
      // If not accumulative/targeted, clear the source to hide particles
      setVfxSrc("");
    }
  }, [isAccumulative, animatedCardIdxArray, idx, multi, vfxSrc]); // Add vfxSrc to dependencies to avoid unnecessary updates

  // Effect 2: Play/Stop the animation based on vfxSrc and vfxRef availability
  useEffect(() => {
    if (vfxSrc && vfxRef.current) {
      console.log(
        `[AnimatedParticleCard] Playing VFX for idx: ${idx}, src: ${vfxSrc}`
      );
      vfxRef.current.play();
    } else if (!vfxSrc && vfxRef.current) {
      console.log(`[AnimatedParticleCard] Stopping VFX for idx: ${idx}`);
      vfxRef.current.stop();
    }
  }, [vfxSrc, idx]); // Trigger when vfxSrc changes or vfxRef.current becomes available

  if (!isCardScaleCalculated) return null;

  // The condition to render PatternParticleAnimation:
  // It MUST be based on `vfxSrc` being present, because that's what triggers the mount
  const shouldRenderParticles = !!vfxSrc; // Only render the wrapper if a source is set

  if (!shouldRenderParticles) {
    return (
      <AnimatedCard
        idx={idx}
        discarded={discarded}
        played={played}
        isSpecial={isSpecial}
        scale={actualScale}
      >
        {children}
      </AnimatedCard>
    );
  }

  return (
    <PatternParticleAnimation
      width={CARD_WIDTH * actualScale}
      height={CARD_HEIGHT * actualScale}
      spriteSrc={vfxSrc}
      particleSize={30 * actualScale}
      duration={3}
      speed={3}
      bottomOffset={1}
      ref={vfxRef}
      // Consider adding 'active' prop if you want to control it that way,
      // but current imperative calls with ref are fine if setup correctly.
    >
      <AnimatedCard
        idx={idx}
        discarded={discarded}
        played={played}
        isSpecial={isSpecial}
        scale={actualScale}
      >
        {children}
      </AnimatedCard>
    </PatternParticleAnimation>
  );
};
