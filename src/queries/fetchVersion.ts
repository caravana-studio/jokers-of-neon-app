import { APP_VERSION } from "../constants/version";

export const fetchVersion = async () => {
  try {
    const response = await fetch(
      "https://jokersofneon.com/app/settings/version.json"
    );
    if (!response.ok) {
      console.error("Failed to fetch version");
      return APP_VERSION;
    }
    const data = await response.json();
    return data?.version || APP_VERSION;
  } catch (err) {
    console.error("Failed to fetch version. Unknown error occurred", err);
    return APP_VERSION;
  }
};
