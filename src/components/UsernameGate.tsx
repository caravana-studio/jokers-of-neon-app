import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGGED_USER } from "../constants/localStorage";
import { useDojo } from "../dojo/useDojo";
import { useCavosSafe } from "../dojo/cavos/CavosBridgeContext";
import { controller } from "../dojo/controller/controller";
import { useCustomToast } from "../hooks/useCustomToast";
import { guestUsernameForAddress } from "../utils/guestUsername";
import { useUsernameStore } from "../state/useUsernameStore";
import { addressKey, normalizeStarknetAddress } from "../utils/starknetAddress";
import { Loading } from "./Loading";
import { UsernameModal } from "./UsernameModal";

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

type EnsureUsernameOptions = {
  required?: boolean;
};

function useUsernameRequirement() {
  const {
    setup: { account },
    accountType,
  } = useDojo();
  const storeAddress = useUsernameStore((store) => store.address);
  const status = useUsernameStore((store) => store.status);
  const username = useUsernameStore((store) => store.username);
  const error = useUsernameStore((store) => store.error);
  const loadUsername = useUsernameStore((store) => store.loadUsername);
  const createUsernameForAddress = useUsernameStore(
    (store) => store.createUsernameForAddress
  );
  const cavos = useCavosSafe();
  const { showErrorToast } = useCustomToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [prefill, setPrefill] = useState("");
  const [saving, setSaving] = useState(false);
  const pendingResolveRef = useRef<((value: boolean) => void) | null>(null);
  const pendingPromiseRef = useRef<Promise<boolean> | null>(null);

  const usernameAddress = account?.account?.address ?? "";
  const normalizedUsernameAddress = normalizeStarknetAddress(usernameAddress);
  const isBurner = accountType === "burner";
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

  const createBurnerUsername = useCallback(async () => {
    if (!normalizedUsernameAddress) return false;

    const storedGuestUsername = window.localStorage.getItem(LOGGED_USER);
    const guestUsername = isValidStoredGuestUsername(storedGuestUsername)
      ? storedGuestUsername
      : guestUsernameForAddress(normalizedUsernameAddress);

    window.localStorage.setItem(LOGGED_USER, guestUsername);

    try {
      await createUsernameForAddress(normalizedUsernameAddress, guestUsername);
      return true;
    } catch (error) {
      const fallbackUsername = guestUsernameForAddress(normalizedUsernameAddress);
      if (fallbackUsername !== guestUsername) {
        window.localStorage.setItem(LOGGED_USER, fallbackUsername);
        try {
          await createUsernameForAddress(normalizedUsernameAddress, fallbackUsername);
          return true;
        } catch (fallbackError) {
          console.error("Could not create guest username", fallbackError);
        }
      } else {
        console.error("Could not create guest username", error);
      }

      showErrorToast("Could not create guest username");
      return false;
    }
  }, [createUsernameForAddress, normalizedUsernameAddress, showErrorToast]);

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

      if (isBurner) {
        return createBurnerUsername();
      }

      return openPrompt(required);
    },
    [
      createBurnerUsername,
      isBurner,
      loadUsername,
      normalizedUsernameAddress,
      openPrompt,
      showErrorToast,
    ]
  );

  useEffect(() => {
    if (!isOpen) return;

    if (accountType === "cavos") {
      const cavosPrefill =
        getValidPrefill(cavos?.user?.email) || getValidPrefill(cavos?.user?.name);
      if (cavosPrefill) {
        setPrefill(cavosPrefill);
        return;
      }
    }

    let cancelled = false;
    setPrefill("");
    controller
      ?.username?.()
      ?.then((controllerUsername) => {
        const controllerPrefill = getValidPrefill(controllerUsername);
        if (!cancelled && controllerPrefill) {
          setPrefill(controllerPrefill);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [accountType, cavos?.user?.email, cavos?.user?.name, isOpen]);

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

type RequireUsernameProps = {
  children: ReactNode;
  redirectTo?: string;
  requireCompletion?: boolean;
};

export const RequireUsername = ({
  children,
  redirectTo = "/",
  requireCompletion = false,
}: RequireUsernameProps) => {
  const navigate = useNavigate();
  const { ensureUsername, hasUsername, modal } = useUsernameRequirement();
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
        if (requireCompletion) {
          setIsAllowed(false);
          return;
        }

        if (window.history.length > 1) {
          navigate(-1);
          return;
        }

        navigate(redirectTo, { replace: true });
        return;
      }

      setIsAllowed(true);
    });

    return () => {
      cancelled = true;
    };
  }, [ensureUsername, hasUsername, navigate, redirectTo, requireCompletion]);

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

export { useUsernameRequirement };
