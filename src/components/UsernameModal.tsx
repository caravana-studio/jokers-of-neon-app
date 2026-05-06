import {
  Flex,
  FormControl,
  FormHelperText,
  Input,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import {
  checkUsernameAvailable,
  UsernameApiError,
  validateUsername,
} from "../api/usernames";
import { ConfirmationModal } from "./ConfirmationModal";

type UsernameModalProps = {
  isOpen: boolean;
  initialUsername?: string | null;
  currentUsername?: string | null;
  title?: string;
  isRequired?: boolean;
  isSaving?: boolean;
  onSave: (username: string) => Promise<void>;
  onClose?: () => void;
};

type AvailabilityStatus =
  | "idle"
  | "invalid"
  | "checking"
  | "available"
  | "taken"
  | "error";

function validateUsernameInput(
  username: string,
  t: TFunction<"game">
): string | null {
  if (username.length < 3) {
    return t("username-modal.errors.min-length");
  }

  if (!/^[A-Za-z0-9._-]+$/.test(username)) {
    return t("username-modal.errors.invalid-characters");
  }

  return null;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof UsernameApiError || error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export const UsernameModal = ({
  isOpen,
  initialUsername,
  currentUsername,
  title,
  isRequired = false,
  isSaving = false,
  onSave,
  onClose,
}: UsernameModalProps) => {
  const { t } = useTranslation("game");
  const [value, setValue] = useState(initialUsername ?? "");
  const [status, setStatus] = useState<AvailabilityStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const checkIdRef = useRef(0);
  const normalizedCurrentUsername = (currentUsername ?? "").trim().toLowerCase();

  useEffect(() => {
    if (isOpen) {
      const nextValue = initialUsername ?? "";
      setValue(nextValue);
      if (!nextValue) {
        setStatus("idle");
        setMessage(null);
      } else {
        setStatus("checking");
        setMessage(null);
      }
      checkIdRef.current += 1;
    }
  }, [initialUsername, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const nextUsername = value.trim();
    const validationError = validateUsernameInput(nextUsername, t);
    checkIdRef.current += 1;
    const checkId = checkIdRef.current;

    if (!nextUsername) {
      setStatus("idle");
      setMessage(null);
      return;
    }

    if (validationError) {
      setStatus("invalid");
      setMessage(validationError);
      return;
    }

    if (
      normalizedCurrentUsername &&
      nextUsername.toLowerCase() === normalizedCurrentUsername
    ) {
      setStatus("available");
      setMessage(t("username-modal.available"));
      return;
    }

    setStatus("checking");
    setMessage(null);

    const timeoutId = window.setTimeout(() => {
      checkUsernameAvailable(nextUsername)
        .then((available) => {
          if (checkIdRef.current !== checkId) return;
          setStatus(available ? "available" : "taken");
          setMessage(
            available
              ? t("username-modal.available")
              : t("username-modal.taken")
          );
        })
        .catch((error) => {
          if (checkIdRef.current !== checkId) return;
          setStatus("error");
          setMessage(getErrorMessage(error, t("username-modal.errors.save-failed")));
        });
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen, normalizedCurrentUsername, t, value]);

  const handleSubmit = async () => {
    if (status !== "available" || isSaving) return;

    try {
      const username = validateUsername(value);
      await onSave(username);
    } catch (error) {
      setStatus("error");
      setMessage(getErrorMessage(error, t("username-modal.errors.save-failed")));
    }
  };

  const isPositive = status === "available";
  const isNegative = ["invalid", "taken", "error"].includes(status);
  const borderColor = isPositive ? "#22C55E" : isNegative ? "#EF4444" : "#20C6ED";
  const messageColor = isPositive ? "#22C55E" : "#EF4444";
  const saveDisabled = status !== "available" || isSaving;
  const checking = status === "checking";

  return (
    <ConfirmationModal
      isOpen={isOpen}
      close={isRequired ? () => {} : onClose ?? (() => {})}
      closeOnOverlayClick={!isRequired}
      title={title ?? t("username-modal.title.pick")}
      confirmText={t("username-modal.save")}
      onConfirm={() => void handleSubmit()}
      isConfirmDisabled={saveDisabled}
      isConfirmLoading={checking || isSaving}
      showCancelButton={!isRequired}
      onCancel={onClose}
      contentMaxW={["calc(100vw - 16px)", "md"]}
      titleFontSize={["16px", "26px"]}
      titleLineHeight={["1.3", "1.3"]}
    >
      <Flex flexDir="column" gap={2}>
        <Text
          color="whiteAlpha.600"
          fontSize="xs"
          lineHeight={["1.1", "normal"]}
          mb={[2, 0]}
          textAlign="left"
        >
          {t("username-modal.info")}
        </Text>
        <FormControl>
          <Input
            value={value}
            maxLength={15}
            autoFocus
            placeholder={t("username-modal.placeholder")}
            borderColor={borderColor}
            _hover={{ borderColor }}
            _focus={{ borderColor, boxShadow: `0 0 0 1px ${borderColor}` }}
            _focusVisible={{
              borderColor,
              boxShadow: `0 0 0 1px ${borderColor}`,
            }}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleSubmit();
              }
            }}
          />
          <FormHelperText mt={1} minH="18px">
            <Text
              as="span"
              color={messageColor}
              fontSize="xs"
              visibility={message ? "visible" : "hidden"}
            >
              {message ?? t("username-modal.available")}
            </Text>
          </FormHelperText>
        </FormControl>
      </Flex>
    </ConfirmationModal>
  );
};
