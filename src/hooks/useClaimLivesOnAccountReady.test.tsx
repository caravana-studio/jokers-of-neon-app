/* @vitest-environment jsdom */

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { useClaimLivesOnAccountReady } from "./useClaimLivesOnAccountReady";

type HarnessProps = {
  accountAddress?: string;
  claimLives: () => Promise<unknown>;
};

const Harness = ({ accountAddress, claimLives }: HarnessProps) => {
  const isClaimingLives = useClaimLivesOnAccountReady(
    accountAddress,
    claimLives
  );
  return <div>{isClaimingLives ? "claiming" : "idle"}</div>;
};

afterEach(cleanup);

test("claims lives when a first-time account becomes ready without a username", async () => {
  let resolveClaim!: (result: { success: boolean }) => void;
  const claimLives = vi.fn(
    () =>
      new Promise<{ success: boolean }>((resolve) => {
        resolveClaim = resolve;
      })
  );
  const { rerender } = render(<Harness claimLives={claimLives} />);

  expect(claimLives).not.toHaveBeenCalled();

  rerender(<Harness accountAddress="0xcavos" claimLives={claimLives} />);

  expect(screen.getByText("claiming")).toBeTruthy();
  await waitFor(() => expect(claimLives).toHaveBeenCalledTimes(1));
  expect(screen.getByText("claiming")).toBeTruthy();

  await act(async () => {
    resolveClaim({ success: true });
  });

  await waitFor(() => expect(screen.getByText("idle")).toBeTruthy());
});

test("does not claim again just because the action callback changes", async () => {
  const firstClaimLives = vi.fn().mockResolvedValue({ success: true });
  const nextClaimLives = vi.fn().mockResolvedValue({ success: true });
  const { rerender } = render(
    <Harness accountAddress="0xcavos" claimLives={firstClaimLives} />
  );

  await waitFor(() => expect(firstClaimLives).toHaveBeenCalledTimes(1));

  rerender(<Harness accountAddress="0xcavos" claimLives={nextClaimLives} />);

  expect(nextClaimLives).not.toHaveBeenCalled();
});
