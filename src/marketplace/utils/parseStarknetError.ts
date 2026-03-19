/**
 * Converts raw Starknet / Cairo error messages into readable strings.
 * The raw errors come from the RPC or Cartridge Controller and often contain
 * Cairo panic codes, contract revert data, or low-level overflow names.
 */
export function parseStarknetError(err: unknown): string {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === "string"
      ? err
      : JSON.stringify(err);

  const msg = raw.toLowerCase();

  // ── User-cancelled ───────────────────────────────────────────────────────
  if (
    msg.includes("user abort") ||
    msg.includes("user rejected") ||
    msg.includes("user denied") ||
    msg.includes("rejected by user") ||
    msg.includes("aborted by user")
  ) {
    return "Transaction cancelled.";
  }

  // ── Insufficient balance ─────────────────────────────────────────────────
  // Our explicit assert ('Insufficient balance') + legacy Cairo underflow panics
  if (
    msg.includes("insufficient balance") ||
    msg.includes("insufficient_balance") ||
    msg.includes("sub_overflow") ||
    msg.includes("suboverflow") ||
    msg.includes("erc20: transfer amount exceeds balance") ||
    msg.includes("transfer amount exceeds balance") ||
    msg.includes("balance too low")
  ) {
    return "Insufficient balance. Top up your STRK or ETH and try again.";
  }

  // ── Insufficient allowance ───────────────────────────────────────────────
  if (msg.includes("insufficient allowance") || msg.includes("insufficient_allowance")) {
    return "Token approval too low. Please try again — the approve step may have failed.";
  }

  // ── Gas / fee too low ────────────────────────────────────────────────────
  if (
    msg.includes("max fee") ||
    msg.includes("max_fee") ||
    msg.includes("fee too low") ||
    msg.includes("not enough fee") ||
    msg.includes("felt_sub_overflow") // fee arithmetic underflow
  ) {
    return "Insufficient funds to cover network fees. Top up your account and try again.";
  }

  // ── Listing already filled ───────────────────────────────────────────────
  if (msg.includes("already filled") || msg.includes("order_filled")) {
    return "This listing has already been purchased.";
  }

  // ── Listing cancelled or expired ─────────────────────────────────────────
  if (msg.includes("order_cancelled") || msg.includes("already cancelled")) {
    return "This listing has already been cancelled.";
  }
  if (msg.includes("order_expired") || msg.includes("listing expired")) {
    return "This listing has expired.";
  }

  // ── Invalid signature / nonce ────────────────────────────────────────────
  if (msg.includes("invalid signature") || msg.includes("invalid_signature")) {
    return "Invalid listing signature. The listing may be corrupt.";
  }
  if (msg.includes("nonce")) {
    return "Nonce error. Please refresh and try again.";
  }

  // ── Network / RPC ────────────────────────────────────────────────────────
  if (
    msg.includes("failed to fetch") ||
    msg.includes("network error") ||
    msg.includes("timeout")
  ) {
    return "Network error. Check your connection and try again.";
  }

  // ── Fallback: return a cleaned-up version of the original message ─────────
  // Strip hex addresses and JSON noise so it's at least readable.
  return raw
    .replace(/0x[0-9a-f]{20,}/gi, "…") // long hex blobs
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}
