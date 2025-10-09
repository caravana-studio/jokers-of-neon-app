import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage";
import { DelayedLoading } from "../../components/DelayedLoading";
import { LootBoxRateInfo } from "../../components/Info/LootBoxRateInfo";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import PackTear from "./PackTear";

export const ExternalPack = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "external-pack",
  });

  const [step, setStep] = useState(0);

  const { isSmallScreen } = useResponsiveValues()

  const packWidth = useMemo(() => isSmallScreen ? 250 : 360, [isSmallScreen])
  const extraPackWidth = packWidth + 50
  const packHeight = useMemo(() => isSmallScreen ? 405 : 583, [isSmallScreen])

  return (
    <DelayedLoading ms={100}>
      <Flex flexDirection={"column"} width={"100%"} height={"100%"}>
        <MobileDecoration />
        <Flex
          flexDirection={"column"}
          gap={4}
          justifyContent={"center"}
          alignItems={"center"}
          p={4}
          height={"100%"}
          width={"100%"}
          transition="all 2s ease"
          backgroundColor={step === 0 ? "transparent" : "rgba(0,0,0,0.6)"}
        >
          {step === 0 && (
            <>
              <Flex flexDirection="column" textAlign="center">
                <Heading
                  fontWeight={500}
                  size="l"
                  letterSpacing={1.3}
                  variant="italic"
                  textTransform="unset"
                >
                  LEGENDARY
                </Heading>
                <Text size="l" fontWeight={600}>
                  - PLAYER PACK -
                </Text>
              </Flex>
              <LootBoxRateInfo name={"test"} details={"details"} />
            </>
          )}

          {/* PACK AREA */}
          <Flex
            h={packHeight}
            width={`${packWidth}px`}
            transform={
              step === 0
                ? "unset"
                : step === 1
                  ? "translateY(40vh)"
                  : step === 2
                    ? "translateY(40vh)"
                    : "translateY(50vh)"
            }
            transition="all 2s ease"
            // important: keep visible on step 2 so the split animation is seen
            opacity={step >= 3 ? 0 : 1}
          >
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                position: "relative",
              }}
            >
              {/* Step < 2 → pack normal + overlay de corte */}
              {step < 2 && (
                <>
                  <PackTear
                    onOpened={() => setStep(2)}
                    width={extraPackWidth}
                  />
                  <CachedImage
                    src="/packs/legendary.png"
                    h="100%"
                    // boxShadow={"0 0 20px 0px white, inset 0 0 10px 0px white"}
                  />
                </>
              )} 

              {/* Step 2 → pack partido en dos con animación */}
              {step === 2 && (
                <SplitPackOnce
                  width={packWidth}
                  height={packHeight}
                  src="/packs/legendary.png"
                  onDone={() => {}/* setStep(3) */} // cuando termina la animación, continuás tu flujo
                />
               )}
            </div>
          </Flex>

          {step === 0 && (
            <Button
              mt={6}
              onClick={() => setStep(1)}
              width="40%"
              variant={"secondarySolid"}
              fontFamily="Oxanium"
              fontSize={14}
            >
              BUY · $9.99
            </Button>
          )}
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};

/**
 * Renders the same image twice and clips each half with CSS.
 * Then animates top half up and bottom half down.
 */
function SplitPackOnce({
  src,
  onDone,
  cutRatio = 0.07,
  durationMs = 650,
  width,
  height
}: {
  src: string;
  onDone?: () => void;
  cutRatio?: number;
  durationMs?: number;
  width?: number;
  height?: number;
}) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const rAF = requestAnimationFrame(() => setRun(true));
    const id = setTimeout(() => onDone?.(), durationMs + 80);
    return () => {
      cancelAnimationFrame(rAF);
      clearTimeout(id);
    };
  }, [durationMs, onDone]);

  const cutPercent = Math.max(0, Math.min(100, cutRatio * 100));

  return (
    // <Box position="relative" w="100%" h="100%" pointerEvents="none">
      <Flex flexDir="column" 
        width={width} height={height}>

      <Box
        // position="absolute"
        inset={0}
        sx={{ clipPath: `inset(0 0 ${100 - cutPercent}% 0)` }}
        willChange="transform, clip-path"
        transform={run ? "translateY(-18px) rotate(-0.4deg)" : "translateY(0)"}
        transition={`transform ${durationMs}ms cubic-bezier(0.22,1,0.36,1)`}
        filter="drop-shadow(0 6px 8px rgba(0,0,0,0.55))"
        zIndex={2}
      >
        <CachedImage src={src} h="100%" 
        width={width} objectFit="contain" />
      </Box>

      <Box
        position="absolute"
        inset={0}
        width={width}
        sx={{ clipPath: `inset(${cutPercent}% 0 0 0)` }}
        willChange="transform, clip-path"
        transform={run ? "translateY(12px)" : "translateY(0)"}
        transition={`transform ${durationMs}ms cubic-bezier(0.22,1,0.36,1)`}
        filter="drop-shadow(0 10px 16px rgba(0,0,0,0.6))"
        zIndex={3}
      >
        <CachedImage src={src} h="100%" w="100%" objectFit="contain" />
      </Box>
      </Flex>
    // </Box>
  );
}