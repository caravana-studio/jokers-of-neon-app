import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { MobileDecoration } from "../../components/MobileDecoration";
import { Icons } from "../../constants/icons";
import { useCavosSafe } from "../../dojo/cavos/CavosBridgeContext";
import { CAVOS_ENABLED } from "../../dojo/cavos/CavosConfig";
import { WalletContext } from "../../dojo/WalletContext";
import { AppType, useAppContext } from "../../providers/AppContextProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { isNativeAndroid, nativePaddingTop } from "../../utils/capacitorUtils";
import { AuthButton } from "../CavosWalletConnect/components/AuthButton";
import { EmailCodeView } from "../CavosWalletConnect/components/EmailCodeView";
import { EmailLoginView } from "../CavosWalletConnect/components/EmailLoginView";
import { AUTH_VIEW_FADE_DURATION_S } from "../CavosWalletConnect/constants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_CODE_COOLDOWN_SECONDS = 90;

const normalizeCavosErrorCode = (error: string) =>
  error
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const formatAddress = (address?: string | null) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const clearCavosStorage = () => {
  localStorage.removeItem("cavos_auth_result");
  localStorage.removeItem("cavos_magic_link_pre_auth");
  localStorage.removeItem("cavos_pending_verification");
  localStorage.removeItem("cavos_pending_deploy_tx");
  localStorage.removeItem("cavos_pending_slot_deploy_tx");
  sessionStorage.removeItem("cavos_oauth_session");
  sessionStorage.removeItem("cavos_oauth_pre_auth");
  sessionStorage.removeItem("cavos_session_data");
  sessionStorage.removeItem("cavos_fallback_redirect");
  sessionStorage.removeItem("cavos_native_auth_redirect_received");
};

const useMigrateWalletConnection = () => {
  const appWallet = useContext(WalletContext);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    account: directControllerAccount,
    isConnected: isDirectControllerConnected,
    isConnecting: isDirectControllerConnecting,
  } = useAccount();
  const cavos = useCavosSafe();
  const [directAccountType, setDirectAccountType] = useState<
    "controller" | "cavos" | null
  >(null);
  const [directCavosError, setDirectCavosError] = useState("");
  const [directCavosOAuthProvider, setDirectCavosOAuthProvider] = useState<
    "google" | "apple" | null
  >(null);
  const [
    isDirectControllerConnectAttemptActive,
    setIsDirectControllerConnectAttemptActive,
  ] = useState(false);
  const directControllerSuccessCallbackRef = useRef<
    ((payload: { username: string; account: any }) => void) | null
  >(null);

  useEffect(() => {
    if (!isDirectControllerConnected || !directControllerAccount) {
      return;
    }

    setDirectAccountType("controller");
    setIsDirectControllerConnectAttemptActive(false);
    directControllerSuccessCallbackRef.current?.({
      username: "",
      account: directControllerAccount,
    });
    directControllerSuccessCallbackRef.current = null;
  }, [directControllerAccount, isDirectControllerConnected]);

  useEffect(() => {
    if (cavos?.isAuthenticated && cavos.address) {
      setDirectAccountType("cavos");
      setDirectCavosOAuthProvider(null);
    }
  }, [cavos?.address, cavos?.isAuthenticated]);

  if (appWallet) {
    return {
      ...appWallet,
      disconnectController: async () => {
        if (appWallet.accountType === "controller") {
          await appWallet.logout();
          return;
        }

        disconnect();
      },
      disconnectCavos: async () => {
        if (appWallet.accountType === "cavos") {
          await appWallet.logout();
          return;
        }

        await cavos?.logout?.();
        clearCavosStorage();
      },
    };
  }

  const isDirectCavosReady =
    cavos?.isAuthenticated === true && Boolean(cavos?.address);

  return {
    finalAccount:
      directAccountType === "controller" && directControllerAccount
        ? directControllerAccount
        : directAccountType === "cavos" && isDirectCavosReady
          ? ({ address: cavos.address } as any)
          : null,
    accountType: directAccountType,
    switchToController: (
      onSuccess?: (payload: { username: string; account: any }) => void,
    ) => {
      if (isDirectControllerConnected && directControllerAccount) {
        onSuccess?.({ username: "", account: directControllerAccount });
        return;
      }

      directControllerSuccessCallbackRef.current = onSuccess ?? null;
      setIsDirectControllerConnectAttemptActive(true);
      if (connectors[0]) {
        connect({ connector: connectors[0] });
      }
    },
    continueWithCavosOAuth: async (provider: "google" | "apple") => {
      if (!cavos?.login) {
        setDirectCavosError("Cavos login not available");
        return false;
      }

      setDirectCavosError("");
      setDirectCavosOAuthProvider(provider);
      try {
        await cavos.login(provider);
        return true;
      } catch (error) {
        setDirectCavosError(
          error instanceof Error ? error.message : "Error during social login",
        );
        setDirectCavosOAuthProvider(null);
        return false;
      }
    },
    sendCavosEmailOtp: async (email: string) => {
      if (!cavos?.sendOtp) {
        setDirectCavosError("Cavos email login not available");
        return false;
      }

      setDirectCavosError("");
      setDirectCavosOAuthProvider(null);
      try {
        await cavos.sendOtp(email);
        return true;
      } catch (error) {
        setDirectCavosError(
          error instanceof Error
            ? error.message
            : "Error sending verification code",
        );
        return false;
      }
    },
    verifyCavosEmailOtp: async (email: string, code: string) => {
      if (!cavos?.verifyOtp) {
        setDirectCavosError("Cavos email verification not available");
        return false;
      }

      setDirectCavosError("");
      setDirectCavosOAuthProvider(null);
      try {
        await cavos.verifyOtp(email, code);
        return true;
      } catch (error) {
        setDirectCavosError(
          error instanceof Error ? error.message : "Error verifying code",
        );
        return false;
      }
    },
    resetCavosAuthState: () => {
      setDirectCavosError("");
      setDirectCavosOAuthProvider(null);
    },
    disconnectController: async () => {
      disconnect();
      setDirectAccountType((current) =>
        current === "controller" ? null : current,
      );
      setIsDirectControllerConnectAttemptActive(false);
      directControllerSuccessCallbackRef.current = null;
    },
    disconnectCavos: async () => {
      await cavos?.logout?.();
      clearCavosStorage();
      setDirectAccountType((current) => (current === "cavos" ? null : current));
      setDirectCavosError("");
      setDirectCavosOAuthProvider(null);
    },
    continueAsGuest: async () => false,
    logout: async () => {},
    isLoadingWallet: false,
    burnerAccount: null,
    controllerAccount: directControllerAccount,
    isControllerConnected: isDirectControllerConnected,
    isControllerConnecting:
      isDirectControllerConnecting || isDirectControllerConnectAttemptActive,
    isLoadingLastGameId: false,
    allowGuest: false,
    shouldBlockWithWalletScreen: false,
    isCavosEnabled: CAVOS_ENABLED,
    isCavosEmailOtpSent: false,
    cavosEmailOtpEmail: "",
    cavosError: directCavosError,
    cavosOAuthProvider: directCavosOAuthProvider,
    onSuccessCallback: { current: null },
  };
};

export const MigrateWalletPage = () => {
  const { t } = useTranslation("migrate");
  const { t: tWallet } = useTranslation("intermediate-screens", {
    keyPrefix: "wallet-provider",
  });
  const navigate = useNavigate();
  const appType = useAppContext();
  const [step, setStep] = useState<"intro" | "connect">("intro");
  const [authView, setAuthView] = useState<"auth" | "email" | "code">("auth");
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);
  const [controllerAddress, setControllerAddress] = useState("");
  const [jokersAddress, setJokersAddress] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const controllerSuccessHandledRef = useRef(false);

  const { isSmallScreen } = useResponsiveValues();

  const {
    switchToController,
    continueWithCavosOAuth,
    sendCavosEmailOtp,
    verifyCavosEmailOtp,
    resetCavosAuthState,
    disconnectController,
    disconnectCavos,
    accountType,
    finalAccount,
    controllerAccount,
    isControllerConnected,
    isControllerConnecting,
    isLoadingWallet,
    isCavosEnabled,
    cavosOAuthProvider,
    cavosError,
  } = useMigrateWalletConnection();

  useEffect(() => {
    if (resendCooldownSeconds <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setResendCooldownSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [resendCooldownSeconds]);

  useEffect(() => {
    if (isControllerConnected && controllerAccount?.address) {
      setControllerAddress(controllerAccount.address);
    }
  }, [controllerAccount?.address, isControllerConnected]);

  useEffect(() => {
    if (accountType === "controller" && finalAccount?.address) {
      setControllerAddress(finalAccount.address);
    }

    if (accountType === "cavos" && finalAccount?.address) {
      setJokersAddress(finalAccount.address);
      setAuthView("auth");
    }
  }, [accountType, finalAccount?.address]);

  const handleConnectController = () => {
    controllerSuccessHandledRef.current = false;
    switchToController(({ account }) => {
      if (controllerSuccessHandledRef.current) return;
      controllerSuccessHandledRef.current = true;
      setControllerAddress(account.address);
    });
  };

  const handleContinueWithEmailClick = () => {
    resetCavosAuthState();
    setAuthView("email");
  };

  const handleContinueWithOAuthClick = async (provider: "google" | "apple") => {
    await continueWithCavosOAuth(provider);
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

  const handleVerificationContinue = async () => {
    if (verificationCode.length !== 6 || isVerifyingEmailOtp) {
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
    if (!submittedEmail || isSendingEmailOtp || resendCooldownSeconds > 0) {
      return;
    }

    setIsSendingEmailOtp(true);
    try {
      const sent = await sendCavosEmailOtp(submittedEmail);
      if (sent) {
        setResendCooldownSeconds(RESEND_CODE_COOLDOWN_SECONDS);
      }
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  const handleTryAnotherLoginOption = () => {
    setAuthView("auth");
    setEmail("");
    setSubmittedEmail("");
    setVerificationCode("");
    setIsSendingEmailOtp(false);
    setIsVerifyingEmailOtp(false);
    setResendCooldownSeconds(0);
    resetCavosAuthState();
  };

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const isAuthActionInProgress =
    isLoadingWallet ||
    isSendingEmailOtp ||
    isVerifyingEmailOtp ||
    Boolean(cavosOAuthProvider);
  const isCavosAuthDisabled = isAuthActionInProgress || !isCavosEnabled;
  const localizedCavosError =
    normalizeCavosErrorCode(cavosError) === "invalid_code"
      ? tWallet("errors.invalid-code")
      : cavosError;
  const canMigrate = Boolean(controllerAddress && jokersAddress);
  const showAppleLogin = !isNativeAndroid;
  const shouldShowLoginCancel = appType === AppType.FULL_GAME;

  return (
    <Box
      position="relative"
      w="100vw"
      h="100svh"
      minH="100svh"
      overflow="hidden"
      overflowX="hidden"
      bg="transparent"
      color="white"
    >
      <Box
        position="fixed"
        inset={0}
        bg="linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.72) 54%, rgba(0,0,0,0.92) 82%, rgba(0,0,0,1) 100%)"
        pointerEvents="none"
      />
      <MobileDecoration fadeToBlack top={nativePaddingTop} bottom="0px" />
      <LanguageSwitcher />

      {step === "intro" ? (
        <Flex
          position="relative"
          zIndex={1}
          h="100svh"
          minH="100svh"
          w="100%"
          px={{ base: 8, md: 10 }}
          py={{ base: 8, md: 16 }}
          alignItems="center"
          justifyContent="center"
        >
          <Flex
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            gap={{ base: 7, md: 5 }}
            w="100%"
            maxW="680px"
            textAlign="center"
          >
            <Image
              src="/logos/logo.png"
              alt="Jokers of Neon"
              w={{ base: "270px", sm: "360px", md: "460px" }}
              h="auto"
            />
            <Heading
              as="h1"
              fontFamily="Orbitron"
              fontSize={{ base: "13px", sm: "15px", md: "18px" }}
              lineHeight={1.5}
              fontWeight={100}
              letterSpacing={8}
              textShadow="0 0 18px rgba(162,69,188,0.55)"
            >
              {t("intro.title")}
            </Heading>
            <Button
              onClick={() => setStep("connect")}
              variant="secondarySolid"
              minW={{ base: "180px", md: "220px" }}
              h={{ base: "44px", md: "50px" }}
              fontSize={{ base: "16px", md: "18px" }}
              boxShadow="0 0 18px rgba(162,69,188,0.75)"
              mt={{ base: 2, md: 4 }}
            >
              {t("intro.start")}
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Flex
          position="relative"
          zIndex={1}
          h="100svh"
          minH="100svh"
          w="100%"
          overflow="hidden"
        >
          <Flex
            flex={1}
            minH={0}
            overflowY={{ base: "auto", lg: "visible" }}
            overflowX="hidden"
            justifyContent={{ base: "flex-start", lg: "center" }}
            px={{ base: 8, md: 10 }}
            py={{ base: 8, md: 16 }}
            sx={{ WebkitOverflowScrolling: "touch" }}
          >
            <Flex
              position="relative"
              flexDir="column"
              w="100%"
              maxW={{ base: "100%", xl: "1480px" }}
              gap={{ base: 5, md: 6 }}
              pb={{ base: 40, md: 10 }}
              mx="auto"
            >
              <Image
                display={{ base: "none", md: "block" }}
                position="absolute"
                top={{ md: "2px" }}
                right={{ base: "0px", md: "0px" }}
                src="/logos/logo.png"
                alt="Jokers of Neon"
                w={{ md: "220px" }}
                h="auto"
              />
              <Text
                fontSize="0"
                aria-hidden="true"
                h={{ base: "0px", md: "48px" }}
                w="100%"
              >
                spacer
              </Text>
              <Flex
                flexDir="column"
                alignItems="center"
                gap={3}
                textAlign="center"
              >
                <Heading
                  as="h1"
                  fontFamily="Orbitron"
                  fontSize={{ base: "26px", md: "42px" }}
                  lineHeight={1.1}
                  letterSpacing={0}
                >
                  {t("connect.title")}
                </Heading>
                <Text
                  maxW="980px"
                  color="whiteAlpha.700"
                  fontSize={{ base: "12px", md: "15px" }}
                  lineHeight={{ base: 1.1, md: 1.45 }}
                >
                  {t("connect.disclaimer")}
                </Text>
              </Flex>

              <Flex
                direction={{ base: "column", lg: "row" }}
                gap={{ base: 4, md: 5 }}
                alignItems="stretch"
                w="100%"
              >
                <ConnectionPanel title={t("controller.title")}>
                  <Flex
                    flexDir="column"
                    alignItems="center"
                    gap={4}
                    w="100%"
                    maxW={{ base: "356px", sm: "420px", md: "520px" }}
                  >
                    <AuthButton
                      iconComponent={Icons.CONTROLLER}
                      iconAlt="Controller"
                      label={
                        controllerAddress
                          ? t("controller.connected")
                          : t("controller.connect")
                      }
                      bg="#eeb402"
                      color="#0B0B0D"
                      onClick={handleConnectController}
                      disabled={
                        Boolean(controllerAddress) || isAuthActionInProgress
                      }
                      isLoading={isControllerConnecting}
                    />
                    {controllerAddress && (
                      <>
                        <ConnectedAddress
                          label={t("connected-address")}
                          address={controllerAddress}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            void disconnectController();
                            setControllerAddress("");
                          }}
                        >
                          {t("disconnect")}
                        </Button>
                      </>
                    )}
                  </Flex>
                </ConnectionPanel>

                <ConnectionPanel title={t("jokers.title")}>
                  {jokersAddress ? (
                    <Flex flexDir="column" alignItems="center" gap={4} w="100%">
                      <AuthButton
                        label={t("jokers.connected")}
                        bg="#A245BC"
                        color="white"
                        disabled
                      />
                      <ConnectedAddress
                        label={t("connected-address")}
                        address={jokersAddress}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          void disconnectCavos();
                          setJokersAddress("");
                          setAuthView("auth");
                          setEmail("");
                          setSubmittedEmail("");
                          setVerificationCode("");
                          setIsSendingEmailOtp(false);
                          setIsVerifyingEmailOtp(false);
                          setResendCooldownSeconds(0);
                        }}
                      >
                        {t("disconnect")}
                      </Button>
                    </Flex>
                  ) : (
                    <Flex flexDir="column" alignItems="center" w="100%">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={authView}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: AUTH_VIEW_FADE_DURATION_S,
                            ease: "easeInOut",
                          }}
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {authView === "auth" ? (
                            <Flex
                              flexDir="column"
                              alignItems="center"
                              gap={{ base: 3.5, md: 5 }}
                              w="100%"
                              maxW={{ base: "356px", sm: "420px", md: "520px" }}
                            >
                              {showAppleLogin && (
                                <AuthButton
                                  iconSrc={Icons.APPLE}
                                  iconAlt="Apple"
                                  label={tWallet("continue-with-apple")}
                                  bg="#ECECEC"
                                  color="#0B0B0D"
                                  onClick={() =>
                                    handleContinueWithOAuthClick("apple")
                                  }
                                  disabled={isCavosAuthDisabled}
                                  isLoading={cavosOAuthProvider === "apple"}
                                />
                              )}
                              <AuthButton
                                iconSrc={Icons.GOOGLE}
                                iconAlt="Google"
                                label={tWallet("continue-with-google")}
                                bg="#ECECEC"
                                color="#0B0B0D"
                                onClick={() =>
                                  handleContinueWithOAuthClick("google")
                                }
                                disabled={isCavosAuthDisabled}
                                isLoading={cavosOAuthProvider === "google"}
                              />
                              <AuthButton
                                label={tWallet("continue-with-email")}
                                bg="#A245BC"
                                color="white"
                                onClick={handleContinueWithEmailClick}
                                disabled={isCavosAuthDisabled}
                              />
                            </Flex>
                          ) : authView === "email" ? (
                            <EmailLoginView
                              email={email}
                              labels={{
                                continueWithEmail: tWallet(
                                  "continue-with-email",
                                ),
                                emailPlaceholder: tWallet("email-placeholder"),
                                continue: tWallet("continue"),
                                tryAnotherLoginOption: tWallet(
                                  "try-another-login-option",
                                ),
                              }}
                              onEmailChange={setEmail}
                              onContinue={handleEmailContinue}
                              isContinueDisabled={
                                !isEmailValid || !isCavosEnabled
                              }
                              isSubmitting={isSendingEmailOtp}
                              onTryAnotherLoginOption={
                                handleTryAnotherLoginOption
                              }
                            />
                          ) : (
                            <EmailCodeView
                              code={verificationCode}
                              labels={{
                                title: tWallet("verify-email-title"),
                                subtitle: tWallet("verify-email-subtitle", {
                                  email: submittedEmail,
                                }),
                                codePlaceholder: tWallet(
                                  "verification-code-placeholder",
                                ),
                                continue: tWallet("continue"),
                                useAnotherEmail: tWallet("use-another-email"),
                                resendCode:
                                  resendCooldownSeconds > 0
                                    ? `${tWallet("resend-code")} (${resendCooldownSeconds}s)`
                                    : tWallet("resend-code"),
                              }}
                              onCodeChange={(value) =>
                                setVerificationCode(value.replace(/\D/g, ""))
                              }
                              onContinue={handleVerificationContinue}
                              onUseAnotherEmail={handleUseAnotherEmail}
                              onResendCode={handleResendCode}
                              isContinueDisabled={
                                verificationCode.length !== 6 ||
                                !submittedEmail ||
                                isSendingEmailOtp ||
                                isLoadingWallet
                              }
                              isSubmitting={
                                isVerifyingEmailOtp || isLoadingWallet
                              }
                              isResendDisabled={
                                resendCooldownSeconds > 0 ||
                                isSendingEmailOtp ||
                                isVerifyingEmailOtp ||
                                isLoadingWallet
                              }
                              isUseAnotherEmailDisabled={
                                isSendingEmailOtp ||
                                isVerifyingEmailOtp ||
                                isLoadingWallet
                              }
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>
                      {!isCavosEnabled && (
                        <Text color="#ffb3b3" fontSize="12px" textAlign="center">
                          {t("jokers.unavailable")}
                        </Text>
                      )}
                      {localizedCavosError && (
                        <Text color="#ff9b9b" fontSize="12px" textAlign="center">
                          {localizedCavosError}
                        </Text>
                      )}
                    </Flex>
                  )}
                </ConnectionPanel>
              </Flex>

              <Flex justifyContent="center" gap={3} wrap="wrap">
                {shouldShowLoginCancel && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/login")}
                    minW={{ base: "190px", md: "240px" }}
                    h={{ base: "44px", md: "50px" }}
                    fontSize={{ base: "16px", md: "18px" }}
                  >
                    {t("connect.cancel")}
                  </Button>
                )}
                <Button
                  variant="secondarySolid"
                  onClick={() => setIsConfirmationOpen(true)}
                  isDisabled={!canMigrate}
                  minW={{ base: "190px", md: "240px" }}
                  h={{ base: "44px", md: "50px" }}
                  fontSize={{ base: "16px", md: "18px" }}
                  boxShadow={
                    canMigrate ? "0 0 18px rgba(162,69,188,0.75)" : "none"
                  }
                >
                  {t("connect.migrate")}
                </Button>
              </Flex>
              <Box
                aria-hidden="true"
                h={{ base: "56px", md: "0px" }}
                flexShrink={0}
              />
            </Flex>
          </Flex>
        </Flex>
      )}

      {isConfirmationOpen && (
        <ConfirmationModal
          close={() => setIsConfirmationOpen(false)}
          title={t("confirmation.title")}
          confirmText={t("confirmation.continue")}
          cancelText={t("confirmation.cancel")}
          onCancel={() => setIsConfirmationOpen(false)}
          onConfirm={() => {}}
          contentMaxW="560px"
          titleFontSize={["20px", "26px"]}
          titleLineHeight={["1.15", "1.2"]}
        >
          <Text textAlign="center" color="whiteAlpha.800" lineHeight={1.5}>
            {t("confirmation.description")}
          </Text>
        </ConfirmationModal>
      )}
    </Box>
  );
};

const ConnectionPanel = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Flex
    flex={1}
    flexDir="column"
    alignItems="center"
    justifyContent="center"
    gap={6}
    minH={{ base: "260px", md: "360px" }}
    p={{ base: 5, md: 8 }}
    border="1px solid rgba(255,255,255,0.14)"
    bg="rgba(6, 7, 16, 0.72)"
    backdropFilter="blur(12px)"
    borderRadius="8px"
    boxShadow="0 18px 60px rgba(0,0,0,0.38)"
  >
    <Heading
      as="h2"
      fontFamily="Orbitron"
      fontSize={{ base: "18px", md: "24px" }}
      lineHeight={1.2}
      letterSpacing={0}
      textAlign="center"
    >
      {title}
    </Heading>
    {children}
  </Flex>
);

const ConnectedAddress = ({
  label,
  address,
}: {
  label: string;
  address: string;
}) => (
  <Flex
    flexDir="column"
    alignItems="center"
    gap={1}
    color="whiteAlpha.700"
    fontSize={{ base: "12px", md: "13px" }}
  >
    <Text>{label}</Text>
    <Text color="white" fontFamily="Orbitron" letterSpacing={0}>
      {formatAddress(address)}
    </Text>
  </Flex>
);
