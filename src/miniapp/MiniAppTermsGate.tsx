import { Box, Button, Checkbox, Flex, Heading, Text } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { MobileBottomBar } from "../components/MobileBottomBar";
import { MobileDecoration } from "../components/MobileDecoration";
import SpineAnimation from "../components/SpineAnimation";
import { MINIAPP_TERMS_ACCEPTED } from "../constants/localStorage";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { nativePaddingTop } from "../utils/capacitorUtils";
import { MiniAppTermsDocument } from "./MiniAppTermsDocument";

type GateStep = "intro" | "terms";
const MotionFlex = motion(Flex);

const hasAcceptedMiniAppTerms = () => {
  try {
    return window.localStorage.getItem(MINIAPP_TERMS_ACCEPTED) === "true";
  } catch (error) {
    console.warn("Could not read miniapp terms acceptance flag", error);
    return false;
  }
};

export const MiniAppTermsGate = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { t } = useTranslation("miniapp", { keyPrefix: "terms-gate" });
  const { isSmallScreen } = useResponsiveValues();
  const [step, setStep] = useState<GateStep>("intro");
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(
    hasAcceptedMiniAppTerms
  );
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [hasAcceptedConditions, setHasAcceptedConditions] = useState(false);
  const canAcceptTerms = isAdultConfirmed && hasAcceptedConditions;

  const handleAccept = () => {
    if (!canAcceptTerms) {
      return;
    }

    try {
      window.localStorage.setItem(MINIAPP_TERMS_ACCEPTED, "true");
    } catch (error) {
      console.warn("Could not persist miniapp terms acceptance flag", error);
    }

    setHasAcceptedTerms(true);
  };

  if (hasAcceptedTerms) {
    return <>{children}</>;
  }

  return (
    <Flex
      width="100%"
      height="100%"
      minH={0}
      position="relative"
      flexDirection="column"
      pt={nativePaddingTop}
      overflow="hidden"
    >
      <MobileDecoration />
      <LanguageSwitcher />
      <AnimatePresence>
        {step === "terms" && (
          <motion.div
            key="terms-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.48)",
              pointerEvents: "none",
              zIndex: 4,
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {step === "intro" ? (
          <MotionFlex
            key="intro"
            width="100%"
            flex={1}
            minH={0}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            px={4}
            zIndex={10}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.985 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Flex
              width="100%"
              maxW={isSmallScreen ? "330px" : "420px"}
              minH={isSmallScreen ? "140px" : "240px"}
              justifyContent="center"
            >
              <SpineAnimation
                jsonUrl="/spine-animations/logo/JokerLogo.json"
                atlasUrl="/spine-animations/logo/JokerLogo.atlas"
                initialAnimation="animation"
                loopAnimation="animation"
                scale={2.5}
                yOffset={-800}
              />
            </Flex>

            <Button
              mt={{ base: -3, md: -5 }}
              minW={{ base: "220px", md: "280px" }}
              onClick={() => setStep("terms")}
            >
              {t("intro.start")}
            </Button>
          </MotionFlex>
        ) : (
          <MotionFlex
            key="terms"
            width="100%"
            flex={1}
            minH={0}
            flexDirection="column"
            px={{ base: 4, md: 8 }}
            pt={{ base: 16, md: 20 }}
            zIndex={10}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
          >
            <Heading
              variant="italic"
              size={isSmallScreen ? "sm" : "md"}
              textAlign="center"
              mb={6}
              zIndex={10}
            >
              {t("title")}
            </Heading>

            <Box
              flex={1}
              minH={0}
              overflowY="auto"
              pr={{ base: 1, md: 3 }}
              pb={6}
              zIndex={10}
              sx={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.35) transparent",
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(255,255,255,0.35)",
                  borderRadius: "999px",
                },
              }}
            >
              <Flex
                maxW="720px"
                mx="auto"
                flexDirection="column"
                gap={4}
              >
                <MiniAppTermsDocument />
                <Flex
                  pt={2}
                  flexDirection="column"
                  gap={3}
                >
                  <Checkbox
                    isChecked={isAdultConfirmed}
                    onChange={(event) =>
                      setIsAdultConfirmed(event.target.checked)
                    }
                    colorScheme="green"
                  >
                    <Text
                      fontFamily="Oxanium"
                      fontSize={{ base: "13px", md: "16px" }}
                      color="whiteAlpha.900"
                    >
                      {t("checkboxes.isAdult")}
                    </Text>
                  </Checkbox>

                  <Checkbox
                    isChecked={hasAcceptedConditions}
                    onChange={(event) =>
                      setHasAcceptedConditions(event.target.checked)
                    }
                    colorScheme="green"
                  >
                    <Text
                      fontFamily="Oxanium"
                      fontSize={{ base: "13px", md: "16px" }}
                      color="whiteAlpha.900"
                    >
                      {t("checkboxes.acceptTerms")}
                    </Text>
                  </Checkbox>
                </Flex>
              </Flex>
            </Box>

            {isSmallScreen ? (
              <MobileBottomBar
                firstButton={{
                  label: t("actions.cancel"),
                  onClick: () => setStep("intro"),
                  variant: "secondarySolid",
                }}
                secondButton={{
                  label: t("actions.accept"),
                  onClick: handleAccept,
                  variant: "solid",
                  disabled: !canAcceptTerms,
                }}
              />
            ) : (
              <Flex
                width="100%"
                justifyContent="center"
                gap={4}
                pb="70px"
                pt={4}
                zIndex={10}
              >
                <Button
                  minW="220px"
                  variant="secondarySolid"
                  onClick={() => setStep("intro")}
                >
                  {t("actions.cancel")}
                </Button>
                <Button
                  minW="220px"
                  onClick={handleAccept}
                  isDisabled={!canAcceptTerms}
                >
                  {t("actions.accept")}
                </Button>
              </Flex>
            )}
          </MotionFlex>
        )}
      </AnimatePresence>
    </Flex>
  );
};
