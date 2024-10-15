import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { SpinePlayer, SpinePlayerConfig } from "@esotericsoftware/spine-player";
import { Flex } from "@chakra-ui/react";
import { useStore } from "../providers/StoreProvider";
import { faL } from "@fortawesome/free-solid-svg-icons";

interface SpineAnimationProps {
  jsonUrl: string;
  atlasUrl: string;
  onClick?: () => void;
  initialAnimation: string;
  hoverAnimation: string;
  loopAnimation: string;
  openBoxAnimation?: string;
  width?: number;
  height?: number;
  xOffset?: number;
  yOffset?: number;
  scale?: number;
  onOpenAnimationStart?: () => void;
  overlayTriggerDelay?: number;
}

export interface SpineAnimationRef {
  playOpenBoxAnimation: () => void;
}

const SpineAnimation = forwardRef<SpineAnimationRef, SpineAnimationProps>(
  (
    {
      jsonUrl,
      atlasUrl,
      onClick,
      initialAnimation,
      hoverAnimation,
      loopAnimation,
      openBoxAnimation,
      width = 400,
      height = 1700,
      xOffset = 0,
      yOffset = -100,
      scale = 1,
      onOpenAnimationStart,
      overlayTriggerDelay = 5500,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<SpinePlayer | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const { setLockRedirection } = useStore();
    const openAnimationSpeed = 0.3;

    useImperativeHandle(ref, () => ({
      playOpenBoxAnimation: () => {
        if (playerRef.current && openBoxAnimation) {
          const player = playerRef.current;
          player.setAnimation(hoverAnimation, false);
          const track = player.setAnimation(openBoxAnimation, false);
          if (track) {
            track.timeScale = openAnimationSpeed;
          }

          if (onOpenAnimationStart) {
            const animationDuration =
              player.skeleton?.data.animations.find(
                (a) => a.name === openBoxAnimation
              )?.duration || 0;
            const adjustedDuration = animationDuration / openAnimationSpeed;
            const triggerTime = Math.max(
              0,
              adjustedDuration * 1000 - overlayTriggerDelay
            );

            setTimeout(() => {
              onOpenAnimationStart();
            }, triggerTime);
          }
        }
      },
    }));

    useEffect(() => {
      if (containerRef.current && !playerRef.current) {
        const config: SpinePlayerConfig = {
          jsonUrl: jsonUrl,
          atlasUrl: atlasUrl,
          alpha: true,
          backgroundColor: "#00000000",
          showControls: false,
          preserveDrawingBuffer: true,
          premultipliedAlpha: true,
          animation: initialAnimation,
          scale: scale,
          success: (player: SpinePlayer) => {
            if (player.skeleton != null) {
              // console.log(player.skeleton.data.animations.map((a) => a.name));
              player.startRendering();
              setPlayerReady(true);

              player.animationState?.addListener({
                complete: function (entry) {
                  if (
                    openBoxAnimation &&
                    entry.animation &&
                    entry.animation.name.includes(openBoxAnimation)
                  ) {
                    setLockRedirection(false);
                  }
                },
              });
            }
          },
          viewport: {
            //   debugRender: true,
            x: xOffset, // Set the x position of the viewport
            y: yOffset, // Set the y position of the viewport
            width: width, // Set the width of the viewport
            height: height, // Set the height of the viewport
          },
        };

        playerRef.current = new SpinePlayer(containerRef.current, config);
      }

      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null; // reset after disposal
        }
      };
    }, [jsonUrl, atlasUrl]);

    // Handle hover state
    useEffect(() => {
      if (playerReady && playerRef.current) {
        if (isHovered) {
          playerRef.current.setAnimation(hoverAnimation, false);
          playerRef.current.addAnimation(loopAnimation, true);
        } else {
          const animState = playerRef.current.animationState;
          const anim = animState?.getCurrent(0)?.animation?.name;

          if (anim && anim != initialAnimation) {
            playerRef.current.setAnimation(initialAnimation, true);
          }
        }
      }
    }, [playerReady, isHovered]);

    return (
      <Flex
        ref={containerRef}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: "100%", height: "100%", cursor: "pointer" }}
      />
    );
  }
);

export default SpineAnimation;
