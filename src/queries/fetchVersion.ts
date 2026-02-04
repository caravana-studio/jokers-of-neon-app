import { APP_VERSION } from "../constants/version";

export const VERSION_URL =
  "https://jokersofneon.com/app/settings/version.json";

interface VersionResponse {
  version: string;
  maintenance?: boolean;
}

export const fetchVersion = async (): Promise<VersionResponse> => {
  try {
    const response = await fetch(VERSION_URL);
    if (!response.ok) {
      console.error("Failed to fetch version");
      return { version: APP_VERSION };
    }
    const data = await response.json();
    return data?.version ? data : { version: APP_VERSION };
  } catch (err) {
    console.error("Failed to fetch version. Unknown error occurred", err);
    return { version: APP_VERSION };
  }
};
