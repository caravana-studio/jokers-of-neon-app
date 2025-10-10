import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage";
import { DelayedLoading } from "../../components/DelayedLoading";
import { LootBoxRateInfo } from "../../components/Info/LootBoxRateInfo";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import Stack from "./CardStack/Stack";
import PackTear from "./PackTear";
import { SplitPackOnce } from "./SplitPackOnce";

export const ExternalPack = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "external-pack",
  });

  const [step, setStep] = useState(0);

  const { isSmallScreen } = useResponsiveValues();

  const packWidth = useMemo(() => (isSmallScreen ? 250 : 360), [isSmallScreen]);
  const extraPackWidth = packWidth + 50;
  const packHeight = useMemo(
    () => (isSmallScreen ? 405 : 583),
    [isSmallScreen]
  );

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
          backgroundColor={step === 0 ? "transparent" : "rgba(0,0,0,0.7)"}
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
            position="relative"
            zIndex={5}
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
                    step={step}
                  />
                  <CachedImage
                    src="/packs/legendary.png"
                    h="100%"
                    // boxShadow={"0 0 20px 0px white, inset 0 0 10px 0px white"}
                  />
                </>
              )}

              {/* Step 2 → pack partido en dos con animación */}
              {step >= 2 && (
                <SplitPackOnce
                  width={packWidth}
                  height={packHeight}
                  src="/packs/legendary.png"
                  onDone={() => {
                    setStep(3);
                    
                    const timer = setTimeout(() => {
                      setStep(4);
                    }, 1000);
                    return () => clearTimeout(timer);
                  }}
                  step={step}
                />
              )}
            </div>
          </Flex>
          <Flex
            position={"absolute"}
            transform={`translateY(${step >= 3 ? 0 : "60vh"})`}
            transition="all 1s ease"
            opacity={step >= 3 ? 1 : 0}
            zIndex={2}
          >
            <Stack
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={true}
              cardDimensions={{
                width: packWidth - 10,
                height: packHeight - 40,
              }}
              cardsData={[
                { id: 1, img: "/Cards/10020.png" },
                { id: 2, img: "/Cards/10021.png" },
                { id: 3, img: "/Cards/10022.png" },
                { id: 4, img: "/Cards/10023.png" },
              ]}
            />
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
