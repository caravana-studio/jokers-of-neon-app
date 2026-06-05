const SEASON_PASS_OFFER_LAST_SHOWN_KEY = "season_pass_offer_last_shown_date";

const getLocalDayKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const canShowSeasonPassOfferToday = () => {
  try {
    return (
      localStorage.getItem(SEASON_PASS_OFFER_LAST_SHOWN_KEY) !==
      getLocalDayKey()
    );
  } catch {
    return true;
  }
};

export const markSeasonPassOfferShownToday = () => {
  try {
    localStorage.setItem(SEASON_PASS_OFFER_LAST_SHOWN_KEY, getLocalDayKey());
  } catch {
    // Ignore storage issues and avoid blocking the user flow.
  }
};
