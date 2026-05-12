type TransactionLogContext = Record<string, unknown>;

const MAX_DEPTH = 4;

const serializeValue = (value: unknown, depth = 0): unknown => {
  if (depth >= MAX_DEPTH) {
    return "[MaxDepthExceeded]";
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Error) {
    const errorWithExtras = value as Error & Record<string, unknown>;

    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
      cause: serializeValue(errorWithExtras.cause, depth + 1),
      code: serializeValue(errorWithExtras.code, depth + 1),
      shortMessage: serializeValue(errorWithExtras.shortMessage, depth + 1),
      details: serializeValue(errorWithExtras.details, depth + 1),
      data: serializeValue(errorWithExtras.data, depth + 1),
      response: serializeValue(errorWithExtras.response, depth + 1),
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item, depth + 1));
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).map(
      ([key, nestedValue]) => [key, serializeValue(nestedValue, depth + 1)]
    );
    return Object.fromEntries(entries);
  }

  return value;
};

const getReceiptStatus = (receipt: any) => ({
  executionStatus:
    receipt?.execution_status ??
    receipt?.executionStatus ??
    receipt?.execution_result?.status ??
    null,
  finalityStatus:
    receipt?.finality_status ?? receipt?.finalityStatus ?? null,
  revertReason:
    receipt?.revert_reason ??
    receipt?.revert_error ??
    receipt?.execution_result?.reason ??
    receipt?.reason ??
    receipt?.transaction_failure_reason?.error_message ??
    null,
});

export const logTransactionError = (
  label: string,
  error: unknown,
  context: TransactionLogContext = {}
) => {
  console.error(`[TxDebug] ${label}`, {
    context: serializeValue(context),
    error: serializeValue(error),
  });
};

export const logFailedTransactionReceipt = (
  label: string,
  receipt: unknown,
  context: TransactionLogContext = {}
) => {
  const normalizedReceipt = serializeValue(receipt) as Record<string, unknown>;
  const status = getReceiptStatus(receipt);

  console.error(`[TxDebug] ${label}`, {
    context: serializeValue(context),
    status,
    receipt: normalizedReceipt,
  });
};
