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
import { isNative, nativePaddingTop } from "../../utils/capacitorUtils";
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
  const stageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    switchToController,
    continueAsGuest,
    allowGuest,
    accountType,
    finalAccount,
    isSigningInWithApple,
    isLoadingLastGameId,
    isLoadingWallet,
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
      accountType === "controller" &&
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
    setAuthView("email");
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

  const handleEmailContinue = () => {
    const normalizedEmail = email.trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return;
    }

    setSubmittedEmail(normalizedEmail);
    setVerificationCode("");
    setAuthView("code");
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
  };

  const handleResendCode = () => {
    // Placeholder for next phase when resend behavior is wired.
  };

  const handleTryAnotherLoginOption = () => {
    setAuthView("auth");
    setOptionsPhase("primary");
    setEmail("");
    setSubmittedEmail("");
    setVerificationCode("");
  };

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const isVerificationCodeValid = verificationCode.length === 6;
  const isControllerActionDisabled = isLoadingWallet;
  const isGuestActionDisabled =
    isLoadingWallet || isSigningInWithApple || isLoadingLastGameId;

  return (
    <PreThemeLoadingPage backgroundSize="cover" backgroundPosition="top center">
      <MobileDecoration
        top={nativePaddingTop}
        bottom={isNative ? "30px" : "0px"}
      />

      <Flex
        position="fixed"
        top={{ base: "50px", sm: "70px" }}
        left="50%"
        transform="translateX(-50%)"
        w="100%"
        maxW={{ base: "430px", md: "520px" }}
        h={{ base: "360px", sm: "430px", md: "500px" }}
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
        background="linear-gradient(to top, #000 0%, #000 46%, rgba(0, 0, 0, 0.92) 56%, rgba(0, 0, 0, 0.68) 67%, rgba(0, 0, 0, 0.35) 76%, rgba(0, 0, 0, 0) 86%)"
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
        pb={{ base: "45px", md: "76px" }}
      >
        <Flex
          position="relative"
          w="100%"
          maxW={{ base: "430px", md: "520px" }}
          h={{ base: "360px", sm: "430px", md: "500px" }}
          justifyContent="center"
          alignItems="flex-end"
          pointerEvents="none"
        >
          <Flex
            position="absolute"
            bottom={{ base: "-6px", sm: "-4px", md: "10px" }}
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
              w={{ base: "260px", sm: "410px", md: "450px" }}
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
                onContinueWithControllerClick={handleContinueWithControllerClick}
                onGuestModeClick={handleGuestModeClick}
                onMoreOptionsToggle={handleMoreOptionsToggle}
                showGuestMode={allowGuest}
                isControllerActionDisabled={isControllerActionDisabled}
                isGuestActionDisabled={isGuestActionDisabled}
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
                isContinueDisabled={!isEmailValid}
                onTryAnotherLoginOption={handleTryAnotherLoginOption}
              />
            ) : (
              <EmailCodeView
                code={verificationCode}
                labels={{
                  title: t("verify-email-title"),
                  subtitle: t("verify-email-subtitle", { email: submittedEmail }),
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
              />
            )}
          </motion.div>
        </AnimatePresence>

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
