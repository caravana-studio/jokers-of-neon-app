import { Flex, Input, Text } from "@chakra-ui/react";
import type { KeyboardEvent } from "react";
import { AuthButton } from "./AuthButton";

interface EmailLoginLabels {
  continueWithEmail: string;
  emailPlaceholder: string;
  continue: string;
  tryAnotherLoginOption: string;
}

interface EmailLoginViewProps {
  email: string;
  labels: EmailLoginLabels;
  onEmailChange: (value: string) => void;
  onContinue: () => void;
  isContinueDisabled: boolean;
  isSubmitting?: boolean;
  onTryAnotherLoginOption: () => void;
}

const handleEnterKey =
  (disabled: boolean, onContinue: () => void) =>
  (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    if (!disabled) {
      onContinue();
    }
  };

export const EmailLoginView = ({
  email,
  labels,
  onEmailChange,
  onContinue,
  isContinueDisabled,
  isSubmitting = false,
  onTryAnotherLoginOption,
}: EmailLoginViewProps) => (
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
      gap={{ base: 4, md: 4 }}
    >
      <Text
        color="white"
        fontFamily="Oxanium"
        fontSize={{ base: "16px", sm: "20px" }}
        lineHeight={1}
        textAlign="center"
      >
        {labels.continueWithEmail}
      </Text>

      <Input
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        onKeyDown={handleEnterKey(isContinueDisabled || isSubmitting, onContinue)}
        placeholder={labels.emailPlaceholder}
        h={{ base: "35px", sm: "40px" }}
        w="100%"
        borderRadius="9999px"
        border="1px solid rgba(255,255,255,0.12)"
        bg="#ECECEC"
        color="#0B0B0D"
        px={4}
        fontFamily="Oxanium"
        fontSize={{ base: "14px", sm: "17px" }}
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
    </Flex>

    <Flex
      as="button"
      type="button"
      mt={{ base: 2.5, md: 0.5 }}
      alignItems="center"
      justifyContent="center"
      color="#A3A4AA"
      onClick={onTryAnotherLoginOption}
    >
      <Text
        fontFamily="Oxanium"
        fontSize={{ base: "13px", sm: "15px", md: "16px" }}
        lineHeight={1}
      >
        {labels.tryAnotherLoginOption}
      </Text>
    </Flex>
  </Flex>
);
