import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage";
import { DelayedLoading } from "../../components/DelayedLoading";
import { LootBoxRateInfo } from "../../components/Info/LootBoxRateInfo";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import PackTear from "./PackTear";
import { SplitPackOnce } from "./SplitPackOnce";

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
