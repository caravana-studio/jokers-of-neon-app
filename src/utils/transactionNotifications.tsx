import { shortenHex } from "@dojoengine/utils";
import { isMobile } from "react-device-detect";
import { ExternalToast, toast } from "sonner";
import { ERROR_TOAST, LOADING_TOAST, SUCCESS_TOAST } from "../theme/colors.tsx";
import { getEnvString } from "./getEnvValue.ts";
import { Box, Spinner, Tooltip } from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

const TX_ERROR_MESSAGE = "Error processing transaction.";

const TOAST_COMMON_OPTIONS: ExternalToast = {
  id: "transaction",
  position: "top-right",
  closeButton: false,
  dismissible: true,
  actionButtonStyle: {
    display: "none",
  },
  cancelButtonStyle: {
    display: "none",
  },
  style: {
    padding: 0,
    backgroundColor: "transparent",
    boxShadow: "none",
    right: "18px",
    width: "50px"
  },
};

type CircularToastProps = {
  backgroundColor: string;
  status: "loading" | "success" | "error";
  description?: string;
};

const CircularToast = ({ backgroundColor, status, description }: CircularToastProps) => (
  <Tooltip 
    hasArrow 
    label={description} 
    isDisabled={!description} 
    closeOnPointerDown 
    color="white" 
    backgroundColor={backgroundColor}
    padding={2}>
    <Box
      width="50px"
      height="50px"
      bg={backgroundColor}
      borderRadius="50%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {status === "loading" ? (
        <Spinner boxSize={24} thickness="2px" speed="0.65s" color="white" size="xl" />
      ) : status === "success" ? (
        <CheckCircleIcon boxSize="24px" color="white" />
      ) : (
        <WarningIcon boxSize="24px" color="white" />
      )}
    </Box>
  </Tooltip>
);

const getToastAction = (transaction_hash: string) => {
  return {
    label: "View",
    onClick: () =>
      window.open(getEnvString("VITE_TRANSACTIONS_URL") + transaction_hash),
  };
};

export const showTransactionToast = (
  transaction_hash?: string,
  message?: string
): void => {
  const title = message || "Transaction in progress...";

  toast.loading(
    <CircularToast backgroundColor={LOADING_TOAST} status="loading" />,
    {
      ...TOAST_COMMON_OPTIONS,
    }
  );
};

export const updateTransactionToast = (
  transaction_hash: string,
  succeed: boolean
): boolean => {
  const backgroundColor = succeed ? SUCCESS_TOAST : ERROR_TOAST;
  const description = shortenHex(transaction_hash, 15);

  if (succeed) {

    toast.success(
      <CircularToast backgroundColor={backgroundColor} status={"success"} description={description}/>,
      {
        ...TOAST_COMMON_OPTIONS,
      }
    );
  } else {

    toast.error(
      <CircularToast backgroundColor={backgroundColor} status={"error"} description={description}/>,
      {
        ...TOAST_COMMON_OPTIONS,
      }
    );
  }
  return succeed;
};

export const failedTransactionToast = (): boolean => {

  toast.error(
    <CircularToast backgroundColor={ERROR_TOAST} status="error" />,
    {
      ...TOAST_COMMON_OPTIONS,
    }
  );

  return false;
};
