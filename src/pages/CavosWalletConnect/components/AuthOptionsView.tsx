import { Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Icons } from "../../../constants/icons";
import { MORE_OPTIONS_LIFT, OPTIONS_FADE_DURATION_S, STAGE1_DURATION_S } from "../constants";
import type { OptionsPhase } from "../types";
import { AuthButton } from "./AuthButton";
import { MoreOptionsToggle } from "./MoreOptionsToggle";

interface AuthOptionsLabels {
  continueWithApple: string;
  continueWithGoogle: string;
  continueWithEmail: string;
  continueWithController: string;
  justTryQuestion: string;
  guestMode: string;
  moreOptions: string;
  goBack: string;
}

interface AuthOptionsViewProps {
  optionsPhase: OptionsPhase;
  labels: AuthOptionsLabels;
  onContinueWithEmailClick: () => void;
  onContinueWithControllerClick: () => void;
  onGuestModeClick: () => void;
  onMoreOptionsToggle: () => void;
  showGuestMode: boolean;
  isControllerActionDisabled?: boolean;
  isGuestActionDisabled?: boolean;
}

export const AuthOptionsView = ({
  optionsPhase,
  labels,
  onContinueWithEmailClick,
  onContinueWithControllerClick,
  onGuestModeClick,
  onMoreOptionsToggle,
  showGuestMode,
  isControllerActionDisabled = false,
  isGuestActionDisabled = false,
}: AuthOptionsViewProps) => {
  const isLifted = optionsPhase === "opening" || optionsPhase === "secondary";
  const isBackLabel = optionsPhase === "secondary" || optionsPhase === "closing";
  const showPrimaryOptions =
    optionsPhase === "primary" || optionsPhase === "opening";
  const showSecondaryOptions =
    optionsPhase === "secondary" || optionsPhase === "closing";

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      w="100%"
      maxW={{ base: "356px", sm: "420px", md: "520px" }}
      gap={{ base: 6, md: 0 }}
      pb={{ base: "16px", md: "8px" }}
      mt={{ base: "20px", md: "10px" }}
    >
      <Flex
        w="100%"
        minH={{ base: "170px", sm: "210px", md: "196px" }}
        position="relative"
      >
        {showPrimaryOptions && (
          <motion.div
            initial={{
              opacity: optionsPhase === "opening" ? 1 : 0,
              y: optionsPhase === "opening" ? 0 : 8,
            }}
            animate={{
              opacity: optionsPhase === "opening" ? 0 : 1,
              y: optionsPhase === "opening" ? -8 : 0,
            }}
            transition={{ duration: STAGE1_DURATION_S, ease: "easeInOut" }}
            style={{
              width: "100%",
              position: "absolute",
              inset: 0,
            }}
          >
            <Flex flexDir="column" alignItems="center" gap={{ base: 6, md: 5 }} w="100%">
              <AuthButton
                iconSrc={Icons.APPLE}
                iconAlt="Apple"
                label={labels.continueWithApple}
                bg="#ECECEC"
                color="#0B0B0D"
              />

              <AuthButton
                iconSrc={Icons.GOOGLE}
                iconAlt="Google"
                label={labels.continueWithGoogle}
                bg="#ECECEC"
                color="#0B0B0D"
              />

              <AuthButton
                label={labels.continueWithEmail}
                bg="#A245BC"
                color="white"
                onClick={onContinueWithEmailClick}
              />
            </Flex>
          </motion.div>
        )}

        {showSecondaryOptions && (
          <motion.div
            initial={{
              opacity: optionsPhase === "secondary" ? 0 : 1,
              y: optionsPhase === "secondary" ? 10 : 0,
            }}
            animate={{
              opacity: optionsPhase === "closing" ? 0 : 1,
              y: optionsPhase === "closing" ? -8 : 0,
            }}
            transition={{
              duration: OPTIONS_FADE_DURATION_S,
              ease: "easeOut",
            }}
            style={{
              width: "100%",
              position: "absolute",
              inset: 0,
            }}
          >
            <Flex
              flexDir="column"
              alignItems="center"
              gap={{ base: 6, md: 5 }}
              w="100%"
              pt={{ base: "86px", md: "70px" }}
            >
              <AuthButton
                iconComponent={Icons.CONTROLLER}
                iconAlt="Controller"
                label={labels.continueWithController}
                bg="#eeb402"
                color="#0B0B0D"
                onClick={onContinueWithControllerClick}
                disabled={isControllerActionDisabled}
              />
              {showGuestMode && (
                <Flex flexDir="column" alignItems="center" gap={3} w="100%">
                  <Text
                    color="#A3A4AA"
                    fontFamily="Oxanium"
                    fontSize={{ base: "13px", sm: "15px", md: "16px" }}
                    lineHeight={1}
                  >
                    {labels.justTryQuestion}
                  </Text>
                  <AuthButton
                    label={labels.guestMode}
                    bg="#A245BC"
                    color="white"
                    onClick={onGuestModeClick}
                    disabled={isGuestActionDisabled}
                  />
                </Flex>
              )}
            </Flex>
          </motion.div>
        )}
      </Flex>

      <MoreOptionsToggle
        isLifted={isLifted}
        isBackLabel={isBackLabel}
        moreOptionsLabel={labels.moreOptions}
        goBackLabel={labels.goBack}
        onToggle={onMoreOptionsToggle}
        liftDistance={MORE_OPTIONS_LIFT}
        moveDuration={STAGE1_DURATION_S}
      />
    </Flex>
  );
};
