import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { LOGGED_USER } from "../../constants/localStorage";
import { useCustomToast } from "../../hooks/useCustomToast";
import { useUsernameStore } from "../../state/useUsernameStore";
import { addressKey, normalizeStarknetAddress } from "../../utils/starknetAddress";
import { Loading } from "../../components/Loading";
import { UsernameModal } from "../../components/UsernameModal";
import { useMiniAppIdentity } from "./useMiniAppSession";

type EnsureUsernameOptions = {
  required?: boolean;
};

function isValidStoredGuestUsername(username: string | null): username is string {
  return Boolean(
    username &&
      username.length >= 3 &&
      username.length <= 15 &&
      /^[A-Za-z0-9._-]+$/.test(username)
  );
}

function getValidPrefill(value?: string | null): string {
  const candidate = String(value ?? "")
    .trim()
    .split("@")[0]
    .replace(/[^A-Za-z0-9._-]/g, "")
    .slice(0, 15);

  return candidate.length >= 3 ? candidate : "";
}

export function useMiniAppUsernameRequirement() {
  const { userAddress } = useMiniAppIdentity();
  const normalizedUsernameAddress = normalizeStarknetAddress(userAddress);
  const storeAddress = useUsernameStore((store) => store.address);
  const status = useUsernameStore((store) => store.status);
  const username = useUsernameStore((store) => store.username);
  const error = useUsernameStore((store) => store.error);
  const loadUsername = useUsernameStore((store) => store.loadUsername);
  const createUsernameForAddress = useUsernameStore(
    (store) => store.createUsernameForAddress
  );
  const { showErrorToast } = useCustomToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [prefill, setPrefill] = useState("");
  const [saving, setSaving] = useState(false);
  const pendingResolveRef = useRef<((value: boolean) => void) | null>(null);
  const pendingPromiseRef = useRef<Promise<boolean> | null>(null);

  const hasUsername =
    Boolean(username) &&
    addressKey(storeAddress) === addressKey(normalizedUsernameAddress);

  const resolvePending = useCallback((value: boolean) => {
    pendingResolveRef.current?.(value);
    pendingResolveRef.current = null;
    pendingPromiseRef.current = null;
  }, []);

  const openPrompt = useCallback(
    (required: boolean) => {
      setIsRequired(required);
      setIsOpen(true);

      if (pendingPromiseRef.current) {
        return pendingPromiseRef.current;
      }

      pendingPromiseRef.current = new Promise<boolean>((resolve) => {
        pendingResolveRef.current = resolve;
      });

      return pendingPromiseRef.current;
    },
    []
  );

  const ensureUsername = useCallback(
    async ({ required = false }: EnsureUsernameOptions = {}) => {
      if (!normalizedUsernameAddress) {
        return true;
      }

      const currentState = useUsernameStore.getState();

      if (
        currentState.username &&
        addressKey(currentState.address) === addressKey(normalizedUsernameAddress)
      ) {
        return true;
      }

      let currentStatus =
        addressKey(currentState.address) === addressKey(normalizedUsernameAddress)
          ? currentState.status
          : "idle";

      if (
        currentStatus === "idle" ||
        currentStatus === "loading" ||
        currentStatus === "error"
      ) {
        const loadedUsername = await loadUsername(normalizedUsernameAddress);
        if (loadedUsername) {
          return true;
        }

        const nextState = useUsernameStore.getState();
        currentStatus = nextState.status;

        if (nextState.username) {
          return true;
        }

        if (currentStatus === "error") {
          showErrorToast(nextState.error ?? "Failed to load username");
          return false;
        }
      }

      if (currentStatus !== "missing") {
        const nextState = useUsernameStore.getState();
        return (
          Boolean(nextState.username) &&
          addressKey(nextState.address) === addressKey(normalizedUsernameAddress)
        );
      }

      return openPrompt(required);
    },
    [loadUsername, normalizedUsernameAddress, openPrompt, showErrorToast]
  );

  useEffect(() => {
    if (!isOpen) return;

    const storedGuestUsername = window.localStorage.getItem(LOGGED_USER);
    setPrefill(
      isValidStoredGuestUsername(storedGuestUsername)
        ? getValidPrefill(storedGuestUsername)
        : ""
    );
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !hasUsername) return;

    setIsOpen(false);
    resolvePending(true);
  }, [hasUsername, isOpen, resolvePending]);

  useEffect(
    () => () => {
      resolvePending(false);
    },
    [resolvePending]
  );

  const handleSave = async (nextUsername: string) => {
    if (!normalizedUsernameAddress) return;

    setSaving(true);
    try {
      await createUsernameForAddress(normalizedUsernameAddress, nextUsername);
      setIsOpen(false);
      resolvePending(true);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    resolvePending(false);
  };

  const modal = (
    <UsernameModal
      isOpen={isOpen}
      isRequired={isRequired}
      isSaving={saving}
      initialUsername={prefill}
      onClose={handleClose}
      onSave={handleSave}
    />
  );

  return {
    ensureUsername,
    hasUsername,
    modal,
    usernameStatus: status,
    usernameError: error,
  };
}

type RequireMiniAppUsernameProps = {
  children: ReactNode;
  requireCompletion?: boolean;
};

export const RequireMiniAppUsername = ({
  children,
  requireCompletion = false,
}: RequireMiniAppUsernameProps) => {
  const { ensureUsername, hasUsername, modal } = useMiniAppUsernameRequirement();
  const [isAllowed, setIsAllowed] = useState(hasUsername);

  useEffect(() => {
    if (hasUsername) {
      setIsAllowed(true);
      return;
    }

    let cancelled = false;

    void ensureUsername({ required: requireCompletion }).then((allowed) => {
      if (cancelled) return;

      if (!allowed) {
        setIsAllowed(false);
        return;
      }

      setIsAllowed(true);
    });

    return () => {
      cancelled = true;
    };
  }, [ensureUsername, hasUsername, requireCompletion]);

  if (hasUsername || isAllowed) {
    return (
      <>
        {modal}
        {children}
      </>
    );
  }

  return (
    <>
      {modal}
      <Loading />
    </>
  );
};
