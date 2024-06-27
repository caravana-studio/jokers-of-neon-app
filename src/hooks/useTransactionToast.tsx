import { ExternalToast, toast } from 'sonner'
import { shortenHex } from "@dojoengine/utils";
import { getEnvString} from '../utils/getEnvValue.ts'
import { CLUBS, NEON_GREEN, NEON_PINK } from '../theme/colors.tsx'


const TOAST_COMMON_OPTIONS: ExternalToast = {
  id: 'transaction',
  position: 'top-right',
  dismissible: false,
  actionButtonStyle: {
    padding: '3px 6px',
    fontFamily: 'Sys'
  }
}

const STYLES = {
  fontFamily: "Sys",
  marginTop: "4px",
  marginRight: "6px",
  color: "white",
  padding: "3px 6px",
  backgroundColor: NEON_GREEN,
}

const getToastAction = (transaction_hash: string) => {
  return {
    label: "View",
    onClick: () =>
      window.open(
        getEnvString("VITE_TRANSACTIONS_URL") + transaction_hash
      ),
  };
};

export const useTransactionToast = () => {

  const showTransactionToast = ( transaction_hash?: string, message?: string ): void => {
    const title = message || 'Transaction in progress...';

    toast.loading(title, {
      ...TOAST_COMMON_OPTIONS,
      description: transaction_hash ? shortenHex(transaction_hash) : 'Please wait',
      style: STYLES,
      action: transaction_hash ? getToastAction(transaction_hash) : undefined,
    });
  };

  const updateTransactionToast = (transaction_hash: string, type: 'success' | 'error' ): void => {
    const title = `Transaction ${type == 'success' ? "finished" : "failed"}.`;

    const styles = {
      ...STYLES,
      backgroundColor: type == 'success' ? CLUBS : NEON_PINK,
    };

    if (type === 'success') {
      toast.success(title, {
        ...TOAST_COMMON_OPTIONS,
        description: shortenHex(transaction_hash),
        style: styles
      });
    } else {
      toast.error(title, {
        ...TOAST_COMMON_OPTIONS,
        description: shortenHex(transaction_hash),
        style: styles
      });
    }
  };

  return { showTransactionToast, updateTransactionToast };
};
