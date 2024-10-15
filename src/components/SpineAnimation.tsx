import React, { useEffect, useRef, useState } from "react";
import { SpinePlayer, SpinePlayerConfig } from "@esotericsoftware/spine-player";
import { Flex } from "@chakra-ui/react";

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
}

const SpineAnimation: React.FC<SpineAnimationProps> = ({
  jsonUrl,
  atlasUrl,
  onClick,
  initialAnimation,
  hoverAnimation,
  loopAnimation,
  openBoxAnimation,
  width = 400,
  height = 1700,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<SpinePlayer | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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
        success: (player: SpinePlayer) => {
          if (player.skeleton != null) {
            const animationName = player.skeleton.data.animations[4].name;
            // console.log(player.skeleton.data.animations.map((a) => a.name));
            player.startRendering();

            player.animationState?.addListener({
              complete: function (entry) {
                if (
                  openBoxAnimation &&
                  entry.animation &&
                  entry.animation.name.includes(openBoxAnimation)
                ) {
                  if (onClick) {
                    onClick();
                  }
                }
              },
            });
          }
        },
        viewport: {
          //   debugRender: true,
          x: 0, // Set the x position of the viewport
          y: -100, // Set the y position of the viewport
          width: width, // Set the width of the viewport
          height: height, // Set the height of the viewport
        },
      };

      playerRef.current = new SpinePlayer(containerRef.current, config);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [jsonUrl, atlasUrl]);

  // Handle hover state
  useEffect(() => {
    if (playerRef.current) {
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
  }, [isHovered, hoverAnimation, loopAnimation, initialAnimation]);

  const onClickOpen = () => {
    if (playerRef.current && openBoxAnimation) {
      playerRef.current.setAnimation(openBoxAnimation, false);
    }
  };

  return (
    <Flex
      ref={containerRef}
      onClick={onClickOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: "100%", height: "100%", cursor: "pointer" }}
    />
  );
};

export default SpineAnimation;
