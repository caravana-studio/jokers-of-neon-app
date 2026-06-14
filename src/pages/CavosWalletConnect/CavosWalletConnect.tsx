import { Flex, Image, Link, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "../../dojo/WalletContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useSeasonNumber } from "../../constants/season";
import { isNativeAndroid, nativePaddingTop } from "../../utils/capacitorUtils";
import { PreThemeLoadingPage } from "../PreThemeLoadingPage";
import { AuthOptionsView } from "./components/AuthOptionsView";
import { EmailCodeView } from "./components/EmailCodeView";
import { EmailLoginView } from "./components/EmailLoginView";
import { AUTH_VIEW_FADE_DURATION_S, STAGE_DURATION_MS } from "./constants";
import type { OptionsPhase } from "./types";

const bossFloatAnimation = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -20px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_CODE_COOLDOWN_SECONDS = 90;

const normalizeCavosErrorCode = (error: string) =>
  error.trim().toLowerCase().replace(/[\s-]+/g, "_");

export const CavosWalletConnect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const seasonNumber = useSeasonNumber();
  const [optionsPhase, setOptionsPhase] = useState<OptionsPhase>("primary");
  const [authView, setAuthView] = useState<"auth" | "email" | "code">("auth");
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [isGuestLoginSubmitting, setIsGuestLoginSubmitting] = useState(false);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);
  const stageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    switchToController,
    continueAsGuest,
    continueWithCavosOAuth,
    sendCavosEmailOtp,
    verifyCavosEmailOtp,
    resetCavosAuthState,
    allowGuest,
    accountType,
    finalAccount,
    isLoadingLastGameId,
    isLoadingWallet,
    isCavosEnabled,
    isControllerEnabled,
    cavosOAuthProvider,
    cavosError,
  } = useWallet();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "wallet-provider",
  });

  useEffect(() => {
    return () => {
      if (stageTimeoutRef.current) {
        clearTimeout(stageTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (resendCooldownSeconds <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setResendCooldownSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [resendCooldownSeconds]);

  useEffect(() => {
    if (
      finalAccount &&
      (accountType === "controller" || accountType === "cavos") &&
      location.pathname === "/login"
    ) {
      navigate("/", { replace: true });
    }
  }, [finalAccount, accountType, location.pathname, navigate]);

  const handleMoreOptionsToggle = () => {
    if (optionsPhase === "opening" || optionsPhase === "closing") {
      return;
    }

    if (stageTimeoutRef.current) {
      clearTimeout(stageTimeoutRef.current);
    }

    if (optionsPhase === "primary") {
      setOptionsPhase("opening");
      stageTimeoutRef.current = setTimeout(() => {
        setOptionsPhase("secondary");
      }, STAGE_DURATION_MS);
      return;
    }

    setOptionsPhase("closing");
    stageTimeoutRef.current = setTimeout(() => {
      setOptionsPhase("primary");
    }, STAGE_DURATION_MS);
  };

  const handleContinueWithEmailClick = () => {
    resetCavosAuthState();
    setAuthView("email");
  };

  const handleContinueWithOAuthClick = async (provider: "google" | "apple") => {
    await continueWithCavosOAuth(provider);
  };

  const handleContinueWithControllerClick = () => {
    if (!isControllerEnabled) {
      return;
    }

    switchToController();
  };

  const handleGuestModeClick = async () => {
    if (isGuestLoginSubmitting) {
      return;
    }

    setIsGuestLoginSubmitting(true);
    try {
      const started = await continueAsGuest();
      if (started && location.pathname === "/login") {
        navigate("/", { replace: true });
        return;
      }

      if (!started) {
        setIsGuestLoginSubmitting(false);
      }
    } catch (error) {
      console.error("Guest login failed", error);
      setIsGuestLoginSubmitting(false);
    }
  };

  const handleEmailContinue = async () => {
    const normalizedEmail = email.trim();
    if (!EMAIL_REGEX.test(normalizedEmail) || isSendingEmailOtp) {
      return;
    }

    setIsSendingEmailOtp(true);
    try {
      const sent = await sendCavosEmailOtp(normalizedEmail);
      if (!sent) {
        return;
      }

      setSubmittedEmail(normalizedEmail);
      setVerificationCode("");
      setResendCooldownSeconds(RESEND_CODE_COOLDOWN_SECONDS);
      setAuthView("code");
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  const handleVerificationCodeChange = (value: string) => {
    const numericCode = value.replace(/\D/g, "");
    setVerificationCode(numericCode);
  };

  const handleVerificationContinue = async () => {
    if (!isVerificationCodeValid || isVerifyingEmailOtp) {
      return;
    }

    setIsVerifyingEmailOtp(true);
    try {
      await verifyCavosEmailOtp(submittedEmail, verificationCode);
    } finally {
      setIsVerifyingEmailOtp(false);
    }
  };

  const handleUseAnotherEmail = () => {
    setAuthView("email");
    setVerificationCode("");
    setIsSendingEmailOtp(false);
    setIsVerifyingEmailOtp(false);
    setResendCooldownSeconds(0);
    resetCavosAuthState();
  };

  const handleResendCode = async () => {
    if (submittedEmail && !isSendingEmailOtp && resendCooldownSeconds <= 0) {
      setIsSendingEmailOtp(true);
      try {
        const sent = await sendCavosEmailOtp(submittedEmail);
        if (sent) {
          setResendCooldownSeconds(RESEND_CODE_COOLDOWN_SECONDS);
        }
      } finally {
        setIsSendingEmailOtp(false);
      }
    }
  };

  const handleTryAnotherLoginOption = () => {
    setAuthView("auth");
    setOptionsPhase("primary");
    setEmail("");
    setSubmittedEmail("");
    setVerificationCode("");
    setIsSendingEmailOtp(false);
    setIsVerifyingEmailOtp(false);
    setResendCooldownSeconds(0);
    resetCavosAuthState();
  };

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const isVerificationCodeValid = verificationCode.length === 6;
  const isAuthActionInProgress =
    isLoadingWallet ||
    isSendingEmailOtp ||
    isVerifyingEmailOtp ||
    isGuestLoginSubmitting ||
    Boolean(cavosOAuthProvider);
  const isCavosAuthDisabled =
    isAuthActionInProgress || !isCavosEnabled;
  const isControllerActionDisabled =
    isAuthActionInProgress || !isControllerEnabled;
  const isGuestActionDisabled =
    isAuthActionInProgress || isLoadingLastGameId;
  const showAppleLogin = !isNativeAndroid;
  const localizedCavosError =
    normalizeCavosErrorCode(cavosError) === "invalid_code"
      ? t("errors.invalid-code")
      : cavosError;

  return (
    <PreThemeLoadingPage backgroundSize="cover" backgroundPosition="top center">
      <MobileDecoration
        top={nativePaddingTop}
        bottom={"0px"}
      />

      <Flex
        position="fixed"
        top={{ base: "80px", sm: "70px" }}
        left="50%"
        transform="translateX(-50%)"
        w="100%"
        maxW={{ base: "430px", md: "520px", lg: "600px", xl: "700px" }}
        h={{ base: "360px", sm: "430px", md: "500px", lg: "600px", xl: "700px" }}
        justifyContent="center"
        alignItems="flex-end"
        pointerEvents="none"
        zIndex={0}
      >
        <Image
          src={`/boss/s${seasonNumber}.png`}
          alt={`Season ${seasonNumber} boss`}
          h="100%"
          w="auto"
          maxW="100%"
          objectFit="contain"
          objectPosition="center bottom"
          animation={`${bossFloatAnimation} 6.8s ease-in-out infinite`}
          transformOrigin="center bottom"
          willChange="transform"
          opacity={0.95}
        />
      </Flex>

      <Flex
        position="fixed"
        inset={0}
        background="linear-gradient(to top, #000 0%, #000 36%, rgba(0, 0, 0, 0.92) 46%, rgba(0, 0, 0, 0.68) 57%, rgba(0, 0, 0, 0.35) 66%, rgba(0, 0, 0, 0) 76%)"
        pointerEvents="none"
        zIndex={1}
      />

      <Flex
        position="relative"
        zIndex={3}
        h="100svh"
        w="100%"
        flexDir="column"
        justifyContent="space-between"
        alignItems="center"
        px={10}
        pt={{ base: "50px", md: "52px" }}
        pb={{ base: "40px", md: "76px" }}
      >
        <Flex
          position="relative"
          w="100%"
          maxW={{ base: "430px", md: "520px" }}
          h={{ base: "360px", sm: "430px", md: "500px", lg: "600px", xl: "700px" }}
          justifyContent="center"
          alignItems="flex-end"
          pointerEvents="none"
        >
          <Flex
            position="absolute"
            bottom={{ base: "-18px", sm: "-4px", md: "10px" }}
            left="50%"
            transform="translateX(-50%)"
            flexDir="column"
            alignItems="center"
            w="100%"
            gap={{ base: 1, sm: 0 }}
          >
            <Image
              src="/logos/logo.png"
              alt="Jokers of Neon"
              w={{ base: "260px", sm: "410px", md: "450px", lg: "500px", xl: "600px" }}
              h="auto"
            />
            <Text
              color="white"
              fontFamily="Sonara"
              fontStyle="italic"
              fontSize={{ base: "17px", sm: "22px" }}
              lineHeight={1}
              textShadow="0 0 8px rgba(0,0,0,0.9)"
            >
              {t("season-label")} {seasonNumber}
            </Text>
          </Flex>
        </Flex>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={authView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: AUTH_VIEW_FADE_DURATION_S, ease: "easeInOut" }}
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {authView === "auth" ? (
              <AuthOptionsView
                optionsPhase={optionsPhase}
                labels={{
                  continueWithApple: t("continue-with-apple"),
                  continueWithGoogle: t("continue-with-google"),
                  continueWithEmail: t("continue-with-email"),
                  continueWithController: t("continue-with-controller"),
                  justTryQuestion: t("just-try-question"),
                  guestMode: t("guest-mode"),
                  guestModeLoading: t("guest-mode-loading"),
                  guestModeFeedback: t("guest-mode-feedback"),
                  moreOptions: t("more-options"),
                  goBack: t("go-back"),
                }}
                onContinueWithEmailClick={handleContinueWithEmailClick}
                onContinueWithAppleClick={() => handleContinueWithOAuthClick("apple")}
                onContinueWithGoogleClick={() => handleContinueWithOAuthClick("google")}
                onContinueWithControllerClick={handleContinueWithControllerClick}
                onGuestModeClick={handleGuestModeClick}
                onMoreOptionsToggle={handleMoreOptionsToggle}
                showAppleLogin={showAppleLogin}
                showCavosLogin={isCavosEnabled}
                showControllerLogin={isControllerEnabled}
                showGuestMode={allowGuest}
                isCavosAuthDisabled={isCavosAuthDisabled}
                isControllerActionDisabled={isControllerActionDisabled}
                isControllerActionLoading={false}
                isGuestActionDisabled={isGuestActionDisabled}
                isGuestActionLoading={isGuestLoginSubmitting}
                isMoreOptionsDisabled={isAuthActionInProgress}
                cavosOAuthProvider={cavosOAuthProvider}
              />
            ) : authView === "email" ? (
              <EmailLoginView
                email={email}
                labels={{
                  continueWithEmail: t("continue-with-email"),
                  emailPlaceholder: t("email-placeholder"),
                  continue: t("continue"),
                  tryAnotherLoginOption: t("try-another-login-option"),
                }}
                onEmailChange={setEmail}
                onContinue={handleEmailContinue}
                isContinueDisabled={!isEmailValid || !isCavosEnabled}
                isSubmitting={isSendingEmailOtp}
                onTryAnotherLoginOption={handleTryAnotherLoginOption}
              />
            ) : (
              <EmailCodeView
                code={verificationCode}
                labels={{
                  title: t("verify-email-title"),
                  subtitle: t("verify-email-subtitle", {
                    email: submittedEmail,
                    defaultValue:
                      "Enter the 6-digit code sent to {{email}}",
                  }),
                  codePlaceholder: t("verification-code-placeholder"),
                  continue: t("continue"),
                  useAnotherEmail: t("use-another-email"),
                  resendCode:
                    resendCooldownSeconds > 0
                      ? `${t("resend-code")} (${resendCooldownSeconds}s)`
                      : t("resend-code"),
                }}
                onCodeChange={handleVerificationCodeChange}
                onContinue={handleVerificationContinue}
                onUseAnotherEmail={handleUseAnotherEmail}
                onResendCode={handleResendCode}
                isContinueDisabled={
                  !isVerificationCodeValid ||
                  !submittedEmail ||
                  isSendingEmailOtp ||
                  isLoadingWallet
                }
                isSubmitting={isVerifyingEmailOtp || isLoadingWallet}
                isResendDisabled={
                  resendCooldownSeconds > 0 ||
                  isSendingEmailOtp ||
                  isVerifyingEmailOtp ||
                  isLoadingWallet
                }
                isUseAnotherEmailDisabled={
                  isSendingEmailOtp || isVerifyingEmailOtp || isLoadingWallet
                }
              />
            )}
          </motion.div>
        </AnimatePresence>

        {localizedCavosError && (
          <Text
            w={{ base: "90%", md: "70%" }}
            maxW="520px"
            textAlign="center"
            color="#ff9b9b"
            fontFamily="Oxanium"
            fontSize={{ base: "12px", md: "14px" }}
            lineHeight={1.25}
            textShadow="0 0 8px rgba(0,0,0,0.9)"
          >
            {localizedCavosError}
          </Text>
        )}

        <LanguageSwitcher />

        <Text
          w={{ base: "90%", md: "70%" }}
          textAlign="center"
          color="white"
          letterSpacing={0.4}
          fontSize={{ base: "11px", md: "13px" }}
          lineHeight={1.3}
          opacity={0.5}
        >
          {t("terms.agreement")}{" "}
          <Link
            href="https://jokersofneon.com/terms-and-conditions"
            isExternal
            color="white"
            textDecoration="underline"
          >
            {t("terms.link")}
          </Link>
        </Text>
      </Flex>
    </PreThemeLoadingPage>
  );
};
