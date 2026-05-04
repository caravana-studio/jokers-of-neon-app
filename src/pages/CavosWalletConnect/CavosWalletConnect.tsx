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

export const CavosWalletConnect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const seasonNumber = useSeasonNumber();
  const [optionsPhase, setOptionsPhase] = useState<OptionsPhase>("primary");
  const [authView, setAuthView] = useState<"auth" | "email" | "code">("auth");
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const stageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    switchToController,
    continueAsGuest,
    continueWithCavosOAuth,
    sendCavosMagicLink,
    resetCavosAuthState,
    allowGuest,
    accountType,
    finalAccount,
    isSigningInWithApple,
    isLoadingLastGameId,
    isLoadingWallet,
    isCavosEnabled,
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
    switchToController();
  };

  const handleGuestModeClick = async () => {
    const started = await continueAsGuest();
    if (started && location.pathname === "/login") {
      navigate("/", { replace: true });
    }
  };

  const handleEmailContinue = async () => {
    const normalizedEmail = email.trim();
    if (!EMAIL_REGEX.test(normalizedEmail) || isSendingMagicLink) {
      return;
    }

    setIsSendingMagicLink(true);
    try {
      const sent = await sendCavosMagicLink(normalizedEmail);
      if (!sent) {
        return;
      }

      setSubmittedEmail(normalizedEmail);
      setVerificationCode("");
      setAuthView("code");
    } finally {
      setIsSendingMagicLink(false);
    }
  };

  const handleVerificationCodeChange = (value: string) => {
    const numericCode = value.replace(/\D/g, "");
    setVerificationCode(numericCode);
  };

  const handleVerificationContinue = () => {
    // Placeholder for next phase when verification behavior is wired.
  };

  const handleUseAnotherEmail = () => {
    setAuthView("email");
    setVerificationCode("");
    setIsSendingMagicLink(false);
    resetCavosAuthState();
  };

  const handleResendCode = () => {
    if (submittedEmail) {
      sendCavosMagicLink(submittedEmail);
    }
  };

  const handleTryAnotherLoginOption = () => {
    setAuthView("auth");
    setOptionsPhase("primary");
    setEmail("");
    setSubmittedEmail("");
    setVerificationCode("");
    setIsSendingMagicLink(false);
    resetCavosAuthState();
  };

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const isVerificationCodeValid = verificationCode.length === 6;
  const isAuthActionInProgress =
    isLoadingWallet ||
    isSendingMagicLink ||
    isSigningInWithApple ||
    Boolean(cavosOAuthProvider);
  const isCavosAuthDisabled =
    isAuthActionInProgress || !isCavosEnabled;
  const isControllerActionDisabled = isAuthActionInProgress;
  const isGuestActionDisabled =
    isAuthActionInProgress || isLoadingLastGameId;
  const showAppleLogin = !isNativeAndroid;

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
                showGuestMode={allowGuest}
                isCavosAuthDisabled={isCavosAuthDisabled}
                isControllerActionDisabled={isControllerActionDisabled}
                isControllerActionLoading={false}
                isGuestActionDisabled={isGuestActionDisabled}
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
                isSubmitting={isSendingMagicLink}
                onTryAnotherLoginOption={handleTryAnotherLoginOption}
              />
            ) : (
              <EmailCodeView
                code={verificationCode}
                labels={{
                  title: t("verify-email-title"),
                  subtitle: t("magic-link-subtitle", {
                    email: submittedEmail,
                    defaultValue:
                      "We sent a secure login link to {{email}}. Open it to continue.",
                  }),
                  codePlaceholder: t("verification-code-placeholder"),
                  continue: t("continue"),
                  useAnotherEmail: t("use-another-email"),
                  resendCode: t("resend-code"),
                }}
                onCodeChange={handleVerificationCodeChange}
                onContinue={handleVerificationContinue}
                onUseAnotherEmail={handleUseAnotherEmail}
                onResendCode={handleResendCode}
                isContinueDisabled={!isVerificationCodeValid}
                showCodeInput={false}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {cavosError && (
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
            {cavosError}
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
