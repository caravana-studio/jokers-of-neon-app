import { Flex, Input, Text } from "@chakra-ui/react";
import { AuthButton } from "./AuthButton";

interface EmailCodeLabels {
  title: string;
  subtitle: string;
  codePlaceholder: string;
  continue: string;
  useAnotherEmail: string;
  resendCode: string;
}

interface EmailCodeViewProps {
  code: string;
  labels: EmailCodeLabels;
  onCodeChange: (value: string) => void;
  onContinue: () => void;
  onUseAnotherEmail: () => void;
  onResendCode: () => void;
  isContinueDisabled: boolean;
  isSubmitting?: boolean;
  isResendDisabled?: boolean;
  isUseAnotherEmailDisabled?: boolean;
  showCodeInput?: boolean;
}

export const EmailCodeView = ({
  code,
  labels,
  onCodeChange,
  onContinue,
  onUseAnotherEmail,
  onResendCode,
  isContinueDisabled,
  isSubmitting = false,
  isResendDisabled = false,
  isUseAnotherEmailDisabled = false,
  showCodeInput = true,
}: EmailCodeViewProps) => (
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
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      gap={3}
    >
      <Text
        color="white"
        fontFamily="Oxanium"
        fontSize={{ base: "16px", sm: "20px" }}
        lineHeight={1}
        textAlign="center"
      >
        {labels.title}
      </Text>

      <Text
        color="#A3A4AA"
        fontFamily="Oxanium"
        fontSize={{ base: "13px", sm: "15px", md: "16px" }}
        lineHeight={1.2}
        textAlign="center"
      >
        {labels.subtitle}
      </Text>

      {showCodeInput && (
        <>
          <Input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            enterKeyHint="done"
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            placeholder={labels.codePlaceholder}
            disabled={isSubmitting}
            h={{ base: "35px", sm: "40px" }}
            w="100%"
            maxLength={6}
            borderRadius="9999px"
            border="1px solid rgba(255,255,255,0.12)"
            bg="#ECECEC"
            color="#0B0B0D"
            px={4}
            fontFamily="Oxanium"
            fontSize={{ base: "14px", sm: "17px" }}
            textAlign="center"
            letterSpacing="0.08em"
            _placeholder={{ color: "#62646F", opacity: 1 }}
            _focusVisible={{
              borderColor: "#A245BC",
              boxShadow: "0 0 0 1px #A245BC",
            }}
          />

          <AuthButton
            label={labels.continue}
            bg="#A245BC"
            color="white"
            onClick={onContinue}
            disabled={isContinueDisabled}
            isLoading={isSubmitting}
          />
        </>
      )}
    </Flex>

    <Flex
      mt={{ base: 2.5, md: 0.5 }}
      w="100%"
      flexDir="row"
      flexWrap="nowrap"
      alignItems="center"
      justifyContent="center"
      gap={{ base: 6, sm: 8 }}
    >
      <Flex
        as="button"
        type="button"
        alignItems="center"
        justifyContent="center"
        color="#A3A4AA"
        cursor={isUseAnotherEmailDisabled ? "not-allowed" : "pointer"}
        opacity={isUseAnotherEmailDisabled ? 0.55 : 1}
        disabled={isUseAnotherEmailDisabled}
        onClick={onUseAnotherEmail}
      >
        <Text
          fontFamily="Oxanium"
          fontSize={{ base: "13px", sm: "15px", md: "16px" }}
          lineHeight={1}
        >
          {labels.useAnotherEmail}
        </Text>
      </Flex>

      <Flex
        as="button"
        type="button"
        alignItems="center"
        justifyContent="center"
        color="#A3A4AA"
        cursor={isResendDisabled ? "not-allowed" : "pointer"}
        opacity={isResendDisabled ? 0.55 : 1}
        disabled={isResendDisabled}
        onClick={onResendCode}
      >
        <Text
          fontFamily="Oxanium"
          fontSize={{ base: "13px", sm: "15px", md: "16px" }}
          lineHeight={1}
        >
          {labels.resendCode}
        </Text>
      </Flex>
    </Flex>
  </Flex>
);
