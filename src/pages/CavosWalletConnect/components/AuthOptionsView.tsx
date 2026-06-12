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
  onContinueWithAppleClick: () => void;
  onContinueWithGoogleClick: () => void;
  onContinueWithControllerClick: () => void;
  onGuestModeClick: () => void;
  onMoreOptionsToggle: () => void;
  showAppleLogin: boolean;
  showControllerLogin: boolean;
  showGuestMode: boolean;
  isCavosAuthDisabled?: boolean;
  isControllerActionDisabled?: boolean;
  isControllerActionLoading?: boolean;
  isGuestActionDisabled?: boolean;
  isMoreOptionsDisabled?: boolean;
  cavosOAuthProvider?: "google" | "apple" | null;
}

export const AuthOptionsView = ({
  optionsPhase,
  labels,
  onContinueWithEmailClick,
  onContinueWithAppleClick,
  onContinueWithGoogleClick,
  onContinueWithControllerClick,
  onGuestModeClick,
  onMoreOptionsToggle,
  showAppleLogin,
  showControllerLogin,
  showGuestMode,
  isCavosAuthDisabled = false,
  isControllerActionDisabled = false,
  isControllerActionLoading = false,
  isGuestActionDisabled = false,
  isMoreOptionsDisabled = false,
  cavosOAuthProvider = null,
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
      gap={0}
      pb={{ base: "16px", md: "8px" }}
      mt={{ base: "8px", md: "10px" }}
    >
      <Flex
        w="100%"
        minH={{ base: "148px", sm: "210px", md: "196px" }}
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
            <Flex flexDir="column" alignItems="center" gap={{ base: 3.5, md: 5 }} w="100%">
              {showAppleLogin && (
                <AuthButton
                  iconSrc={Icons.APPLE}
                  iconAlt="Apple"
                  label={labels.continueWithApple}
                  bg="#ECECEC"
                  color="#0B0B0D"
                  onClick={onContinueWithAppleClick}
                  disabled={isCavosAuthDisabled}
                  isLoading={cavosOAuthProvider === "apple"}
                />
              )}

              <AuthButton
                iconSrc={Icons.GOOGLE}
                iconAlt="Google"
                label={labels.continueWithGoogle}
                bg="#ECECEC"
                color="#0B0B0D"
                onClick={onContinueWithGoogleClick}
                disabled={isCavosAuthDisabled}
                isLoading={cavosOAuthProvider === "google"}
              />

              <AuthButton
                label={labels.continueWithEmail}
                bg="#A245BC"
                color="white"
                onClick={onContinueWithEmailClick}
                disabled={isCavosAuthDisabled}
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
              gap={{ base: 4, md: 5 }}
              w="100%"
              pt={{ base: "26px", md: "70px" }}
            >
              {showControllerLogin && (
                <AuthButton
                  iconComponent={Icons.CONTROLLER}
                  iconAlt="Controller"
                  label={labels.continueWithController}
                  bg="#eeb402"
                  color="#0B0B0D"
                  onClick={onContinueWithControllerClick}
                  disabled={isControllerActionDisabled}
                  isLoading={isControllerActionLoading}
                />
              )}
              {showGuestMode && (
                <Flex flexDir="column" alignItems="center" gap={2.5} w="100%">
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
        disabled={isMoreOptionsDisabled}
      />
    </Flex>
  );
};
