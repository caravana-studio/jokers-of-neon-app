export type PushActionsPayload = {
  actions: string[];
  address: string;
};

export async function pushActions({ actions, address }: PushActionsPayload) {
  const secret = import.meta.env.VITE_GG_SECRET_KEY;
  const url = `/api/forward-push`;

  const body = JSON.stringify({ actions, playerAddress: address });

  return fetch(url, {
    method: "POST",
    body,
    headers: {
      secret: secret,
      "Content-Type": "application/json",
    },
  });
}
