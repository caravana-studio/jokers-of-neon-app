// Lazy singleton loader for the card name/description data.
// Mirrors the usePrices pattern: one fetch, shared across all subscribers.

interface CardEntry {
  name: string;
  description: string;
}

type CardsJson = {
  traditionalCards?: Record<string, CardEntry>;
  neonCards?: Record<string, CardEntry>;
  modifiers?: Record<string, CardEntry>;
  specials?: Record<string, CardEntry>;
  rageCards?: Record<string, CardEntry>;
};

let data: CardsJson | null = null;
let promise: Promise<void> | null = null;
const subscribers = new Set<() => void>();

function notify() {
  subscribers.forEach((cb) => cb());
}

function load() {
  if (promise) return;
  promise = fetch("/locales/en/cards/translation.json")
    .then((r) => r.json())
    .then((json: CardsJson) => {
      data = json;
      notify();
    })
    .catch(() => {
      // leave data null — tooltips will just show the card_name from the listing
    });
}

export function subscribeCardData(cb: () => void) {
  subscribers.add(cb);
  if (!data) load();
  else cb(); // already loaded
  return () => { subscribers.delete(cb); };
}

// card_id ranges mirror the game's CardDataProvider
function sectionForId(cardId: number): keyof CardsJson | null {
  if (cardId < 100) return "traditionalCards";
  if (cardId >= 200 && cardId < 300) return "neonCards";
  if (cardId >= 600 && cardId < 700) return "modifiers";
  if (cardId >= 10000 && cardId < 20000) return "specials";
  if (cardId >= 20000 && cardId < 30000) return "rageCards";
  return null;
}

export function getCardEntry(cardId: number): CardEntry | null {
  if (!data) return null;
  const section = sectionForId(cardId);
  if (!section) return null;
  return data[section]?.[String(cardId)] ?? null;
}
