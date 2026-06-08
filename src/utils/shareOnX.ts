import { AppLauncher } from "@capacitor/app-launcher";
import { isNative } from "./capacitorUtils";

interface ShareOnXOptions {
  message: string;
  url?: string;
}

export const shareOnX = async ({ message, url }: ShareOnXOptions) => {
  const intentUrl = new URL("https://twitter.com/intent/tweet");
  intentUrl.searchParams.set("text", message);

  if (url) {
    intentUrl.searchParams.set("url", url);
  }

  try {
    if (!isNative) {
      window.open(intentUrl.toString(), "_blank", "noopener,noreferrer");
      return;
    }

    const nativeMessage = url ? `${message}\n${url}` : message;
    const nativeUrl = `twitter://post?message=${encodeURIComponent(nativeMessage)}`;
    const nativeOpenResult = await AppLauncher.openUrl({ url: nativeUrl });

    if (nativeOpenResult.completed) {
      return;
    }
  } catch {
    // Fall back to the web intent below.
  }

  await AppLauncher.openUrl({ url: intentUrl.toString() });
};
