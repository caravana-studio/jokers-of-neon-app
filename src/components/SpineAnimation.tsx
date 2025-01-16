import { Box, Flex, Heading } from "@chakra-ui/react";
import { SpinePlayer, SpinePlayerConfig } from "@esotericsoftware/spine-player";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useStore } from "../providers/StoreProvider";
import { PriceBox } from "./PriceBox";

interface SpineAnimationProps {
  jsonUrl: string;
  atlasUrl: string;
  onClick?: () => void;
  initialAnimation: string;
  hoverAnimation?: string;
  loopAnimation: string;
  openBoxAnimation?: string;
  width?: number;
  height?: number;
  xOffset?: number;
  yOffset?: number;
  scale?: number;
  onOpenAnimationStart?: () => void;
  isPurchased?: boolean;
  price?: number;
  discountPrice?: number;
}

export interface SpineAnimationRef {
  playOpenBoxAnimation: () => void;
  updateAnimationState: () => void;
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
      width = 500,
      height = 1500,
      xOffset = -200,
      yOffset = -150,
      scale = 1,
      onOpenAnimationStart,
      isPurchased,
      price,
      discountPrice,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<SpinePlayer | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const { setLockRedirection } = useStore();
    const openAnimationSpeed = 0.3;
    const { t } = useTranslation(["store"]);
    const [isAnimationRunning, setIsAnimationRunning] = useState(false);

    const fontSize = isMobile
      ? 15
      : discountPrice != undefined && discountPrice > 0
        ? 15
        : 18;

    useImperativeHandle(ref, () => ({
      playOpenBoxAnimation: () => {
        if (playerRef.current && openBoxAnimation) {
          const player = playerRef.current;
          hoverAnimation && player.setAnimation(hoverAnimation, false);
          const track = player.setAnimation(openBoxAnimation, false);
          if (track) {
            track.timeScale = openAnimationSpeed;
          }

          if (onOpenAnimationStart) {
            setTimeout(() => {
              onOpenAnimationStart();
            }, 2);
          }
        }
      },
      updateAnimationState: () => {
        setIsAnimationRunning(true);
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
          showLoading: false,
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
                    setIsAnimationRunning(false);
                  }
                },
              });
            }
          },
          viewport: {
            // debugRender: true,
            x: xOffset,
            y: yOffset,
            width: width,
            height: height,
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
      if (playerReady && playerRef.current && !isPurchased) {
        if (isHovered) {
          hoverAnimation &&
            playerRef.current.setAnimation(hoverAnimation, false);
          playerRef.current.addAnimation(loopAnimation, true);
        } else {
          const animState = playerRef.current.animationState;
          const anim = animState?.getCurrent(0)?.animation?.name;

          if (anim && anim != initialAnimation) {
            playerRef.current.setAnimation(initialAnimation, true);
          }
        }

        if (isPurchased) {
          playerRef.current.setAnimation(initialAnimation, true);
        }
      }
    }, [playerReady, isHovered, isPurchased]);

    return (
      <Box
        position={"relative"}
        width={"100%"}
        height={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {isPurchased && (
          <Box
            sx={{
              position: "absolute",
              bottom: `10%`,
              left: isMobile ? `55%` : `50%`,
              transform: "translate(-65%)",
              zIndex: 10,
            }}
          >
            <Heading
              variant="italic"
              fontSize={isMobile ? 7 : 14 * scale}
              justifyContent={"center"}
            >
              {t("store.labels.purchased").toUpperCase()}
            </Heading>
          </Box>
        )}
        {price && (
          <Box
            sx={{
              position: "absolute",
              bottom: isMobile ? `-20px` : 0,
              left: `45%`,
              zIndex: 10,
            }}
          >
            <PriceBox
              price={price}
              purchased={isPurchased ?? false}
              discountPrice={discountPrice}
              fontSize={fontSize}
            />
          </Box>
        )}
        <Flex
          ref={containerRef}
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            width: "100%",
            height: "100%",
            cursor: isPurchased ? "default" : "pointer",
            opacity: isPurchased && !isAnimationRunning ? 0.3 : 1,
          }}
        ></Flex>
      </Box>
    );
  }
);

export default SpineAnimation;
