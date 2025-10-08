import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage";
import { DelayedLoading } from "../../components/DelayedLoading";
import { LootBoxRateInfo } from "../../components/Info/LootBoxRateInfo";
import { MobileDecoration } from "../../components/MobileDecoration";
import PackTear from "./PackTear";

export const ExternalPack = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "external-pack",
  });

  const [step, setStep] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [computedWidth, setComputedWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const calc = () => {
      const el = contentRef.current;
      if (!el) return;
      const w = Math.round(el.getBoundingClientRect().width);
      setComputedWidth(w || undefined);
    };

    // run once on mount
    calc();

    // update on resize
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

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
          <Flex
            h="50vh"
            width={computedWidth ? `${computedWidth}px` : undefined}
            transform={step === 0 ? "unset" : "translateY(40vh)"}
            transition="all 2s ease"
          >
            <div ref={contentRef} style={{ display: "flex", alignItems: "stretch" }}>
              <PackTear onOpened={() => alert("opened")} width={computedWidth ? computedWidth + 46 : 300} />
              <CachedImage
                src="/packs/legendary.png"
                h="100%"
                boxShadow={"0 0 20px 0px white, inset 0 0 10px 0px white"}
              />
            </div>
          </Flex>
          {step === 0 && (
            <Button
              mt={6}
              onClick={() => {
                setStep(1);
              }}
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
