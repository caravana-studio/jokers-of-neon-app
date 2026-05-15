import {
  createUsername,
  fetchUsernameByAddress,
  UsernameApiError,
} from "../api/usernames";
import { LOGGED_USER } from "../constants/localStorage";
import { normalizeStarknetAddress } from "./starknetAddress";

export function guestUsernameForAddress(address: string): string {
  const normalized = normalizeStarknetAddress(address).replace(/^0x/, "");
  return `guest${normalized.slice(-8)}`;
}

export async function ensureGuestUsernameRecord(
  address: string
): Promise<string> {
  const normalizedAddress = normalizeStarknetAddress(address);
  const existingRecord = await fetchUsernameByAddress(normalizedAddress).catch(
    () => null
  );

  if (existingRecord?.username) {
    window.localStorage.setItem(LOGGED_USER, existingRecord.username);
    return existingRecord.username;
  }

  const candidate = guestUsernameForAddress(normalizedAddress);
  window.localStorage.setItem(LOGGED_USER, candidate);

  try {
    const createdRecord = await createUsername(normalizedAddress, candidate);
    return createdRecord.username;
  } catch (error) {
    if (
      error instanceof UsernameApiError &&
      error.code === "ADDRESS_USERNAME_EXISTS"
    ) {
      const record = await fetchUsernameByAddress(normalizedAddress);
      if (record?.username) {
        window.localStorage.setItem(LOGGED_USER, record.username);
        return record.username;
      }
    }

    throw error;
  }
}
