/* @vitest-environment jsdom */

import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { useClaimLivesOnAccountReady } from "./useClaimLivesOnAccountReady";

type HarnessProps = {
  accountAddress?: string;
  claimLives: () => Promise<unknown>;
};

const Harness = ({ accountAddress, claimLives }: HarnessProps) => {
  useClaimLivesOnAccountReady(accountAddress, claimLives);
  return null;
};

afterEach(cleanup);

test("claims lives when a first-time account becomes ready without a username", async () => {
  const claimLives = vi.fn().mockResolvedValue({ success: true });
  const { rerender } = render(<Harness claimLives={claimLives} />);

  expect(claimLives).not.toHaveBeenCalled();

  rerender(<Harness accountAddress="0xcavos" claimLives={claimLives} />);

  await waitFor(() => expect(claimLives).toHaveBeenCalledTimes(1));
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
