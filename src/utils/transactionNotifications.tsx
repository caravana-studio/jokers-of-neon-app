import { shortenHex } from "@dojoengine/utils";
import { isMobile } from "react-device-detect";
import { ExternalToast, toast } from "sonner";
import { ERROR_TOAST, LOADING_TOAST, SUCCESS_TOAST } from "../theme/colors.tsx";
import { getEnvString } from "./getEnvValue.ts";

const TX_ERROR_MESSAGE = "Error processing transaction.";

const TOAST_COMMON_OPTIONS: ExternalToast = {
  id: "transaction",
  position: isMobile ? "top-left" : "bottom-center",
  closeButton: true,
  dismissible: true,
  actionButtonStyle: {
    padding: "3px 6px",
  },
  cancelButtonStyle: {
    marginLeft: "15px",
    marginTop: "15px",
  },
};

const STYLES = {
  color: "white",
  padding: "3px 6px",
  backgroundColor: LOADING_TOAST,
  borderRadius: 0,
};

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

  toast.loading(title, {
    ...TOAST_COMMON_OPTIONS,
    description: transaction_hash
      ? shortenHex(transaction_hash, 15)
      : "Please wait",
    style: STYLES,
    action: transaction_hash ? getToastAction(transaction_hash) : undefined,
  });
};

export const updateTransactionToast = (
  transaction_hash: string,
  succeed: boolean
): boolean => {
  const title = `Transaction ${succeed ? "finished" : "failed"}.`;

  const styles = {
    ...STYLES,
    backgroundColor: succeed ? SUCCESS_TOAST : ERROR_TOAST,
  };

  if (succeed) {
    toast.success(title, {
      ...TOAST_COMMON_OPTIONS,
      description: shortenHex(transaction_hash, 15),
      style: styles,
    });
  } else {
    toast.error(title, {
      ...TOAST_COMMON_OPTIONS,
      description: shortenHex(transaction_hash, 15),
      style: styles,
    });
  }
  return succeed;
};

export const failedTransactionToast = (): boolean => {
  const title = "Transaction failed";

  const styles = {
    ...STYLES,
    backgroundColor: ERROR_TOAST,
  };

  toast.error(title, {
    ...TOAST_COMMON_OPTIONS,
    description: TX_ERROR_MESSAGE,
    style: styles,
  });
  return false;
};
