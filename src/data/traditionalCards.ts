import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";
import { CardDataMap } from "../types/CardData";
import i18n from 'i18next';

export const TRADITIONAL_CARDS_DATA: CardDataMap = {};
export const NEON_CARDS_DATA: CardDataMap = {};

const loadTranslations = async () => {
  await i18n.loadNamespaces(['traditional-cards', 'neon-cards']);

  for (let i = 0; i <= 52; i++) {
    TRADITIONAL_CARDS_DATA[i] = {
      name: i18n.t(`traditionalCardsData.${i}.name`, {ns:'traditional-cards'}),
      description: i18n.t(`traditionalCardsData.${i}.description`, {ns:'traditional-cards'}),
      card: CARDS_SUIT_DATA[i].card,
      suit: CARDS_SUIT_DATA[i].suit,
    };
  }
  
  for (let i = 53; i <= 105; i++) {
    NEON_CARDS_DATA[i] = {
      name: i18n.t(`neonCardsData.${i}.name`, {ns:'neon-cards'}),
      description: i18n.t(`neonCardsData.${i}.description`, {ns:'neon-cards'}),
      card: CARDS_SUIT_DATA[i].card,
      suit: CARDS_SUIT_DATA[i].suit,
    };
  }
}

i18n.on('initialized', loadTranslations);
i18n.on('languageChanged', loadTranslations);

interface CardMultiSuitData {
  card?: Cards;
  suit?: Suits;
}

export type CardMultiSuitDataMap = {
  [key: number]: CardMultiSuitData;
};

export const CARDS_SUIT_DATA: CardMultiSuitDataMap = {
  0: {
    card: Cards.TWO,
    suit: Suits.CLUBS,
  },
  1: {
    card: Cards.THREE,
    suit: Suits.CLUBS,
  },
  2: {
    card: Cards.FOUR,
    suit: Suits.CLUBS,
  },
  3: {
    card: Cards.FIVE,
    suit: Suits.CLUBS,
  },
  4: {
    card: Cards.SIX,
    suit: Suits.CLUBS,
  },
  5: {
    card: Cards.SEVEN,
    suit: Suits.CLUBS,
  },
  6: {
    card: Cards.EIGHT,
    suit: Suits.CLUBS,
  },
  7: {
    card: Cards.NINE,
    suit: Suits.CLUBS,
  },
  8: {
    card: Cards.TEN,
    suit: Suits.CLUBS,
  },
  9: {
    card: Cards.JACK,
    suit: Suits.CLUBS,
  },
  10: {
    card: Cards.QUEEN,
    suit: Suits.CLUBS,
  },
  11: {
    card: Cards.KING,
    suit: Suits.CLUBS,
  },
  12: {
    card: Cards.ACE,
    suit: Suits.CLUBS,
  },
  13: {
    card: Cards.TWO,
    suit: Suits.DIAMONDS,
  },
  14: {
    card: Cards.THREE,
    suit: Suits.DIAMONDS,
  },
  15: {
    card: Cards.FOUR,
    suit: Suits.DIAMONDS,
  },
  16: {
    card: Cards.FIVE,
    suit: Suits.DIAMONDS,
  },
  17: {
    card: Cards.SIX,
    suit: Suits.DIAMONDS,
  },
  18: {
    card: Cards.SEVEN,
    suit: Suits.DIAMONDS,
  },
  19: {
    card: Cards.EIGHT,
    suit: Suits.DIAMONDS,
  },
  20: {
    card: Cards.NINE,
    suit: Suits.DIAMONDS,
  },
  21: {
    card: Cards.TEN,
    suit: Suits.DIAMONDS,
  },
  22: {
    card: Cards.JACK,
    suit: Suits.DIAMONDS,
  },
  23: {
    card: Cards.QUEEN,
    suit: Suits.DIAMONDS,
  },
  24: {
    card: Cards.KING,
    suit: Suits.DIAMONDS,
  },
  25: {
    card: Cards.ACE,
    suit: Suits.DIAMONDS,
  },
  26: {
    card: Cards.TWO,
    suit: Suits.HEARTS,
  },
  27: {
    card: Cards.THREE,
    suit: Suits.HEARTS,
  },
  28: {
    card: Cards.FOUR,
    suit: Suits.HEARTS,
  },
  29: {
    card: Cards.FIVE,
    suit: Suits.HEARTS,
  },
  30: {
    card: Cards.SIX,
    suit: Suits.HEARTS,
  },
  31: {
    card: Cards.SEVEN,
    suit: Suits.HEARTS,
  },
  32: {
    card: Cards.EIGHT,
    suit: Suits.HEARTS,
  },
  33: {
    card: Cards.NINE,
    suit: Suits.HEARTS,
  },
  34: {
    card: Cards.TEN,
    suit: Suits.HEARTS,
  },
  35: {
    card: Cards.JACK,
    suit: Suits.HEARTS,
  },
  36: {
    card: Cards.QUEEN,
    suit: Suits.HEARTS,
  },
  37: {
    card: Cards.KING,
    suit: Suits.HEARTS,
  },
  38: {
    card: Cards.ACE,
    suit: Suits.HEARTS,
  },
  39: {
    card: Cards.TWO,
    suit: Suits.SPADES,
  },
  40: {
    card: Cards.THREE,
    suit: Suits.SPADES,
  },
  41: {
    card: Cards.FOUR,
    suit: Suits.SPADES,
  },
  42: {
    card: Cards.FIVE,
    suit: Suits.SPADES,
  },
  43: {
    card: Cards.SIX,
    suit: Suits.SPADES,
  },
  44: {
    card: Cards.SEVEN,
    suit: Suits.SPADES,
  },
  45: {
    card: Cards.EIGHT,
    suit: Suits.SPADES,
  },
  46: {
    card: Cards.NINE,
    suit: Suits.SPADES,
  },
  47: {
    card: Cards.TEN,
    suit: Suits.SPADES,
  },
  48: {
    card: Cards.JACK,
    suit: Suits.SPADES,
  },
  49: {
    card: Cards.QUEEN,
    suit: Suits.SPADES,
  },
  50: {
    card: Cards.KING,
    suit: Suits.SPADES,
  },
  51: {
    card: Cards.ACE,
    suit: Suits.SPADES,
  },
  52: {
    card: Cards.JOKER,
    suit: Suits.JOKER,
  },
  53: {
    card: Cards.TWO,
    suit: Suits.CLUBS,
  },
  54: {
    card: Cards.THREE,
    suit: Suits.CLUBS,
  },
  55: {
    card: Cards.FOUR,
    suit: Suits.CLUBS,
  },
  56: {
    card: Cards.FIVE,
    suit: Suits.CLUBS,
  },
  57: {
    card: Cards.SIX,
    suit: Suits.CLUBS,
  },
  58: {
    card: Cards.SEVEN,
    suit: Suits.CLUBS,
  },
  59: {
    card: Cards.EIGHT,
    suit: Suits.CLUBS,
  },
  60: {
    card: Cards.NINE,
    suit: Suits.CLUBS,
  },
  61: {
    card: Cards.TEN,
    suit: Suits.CLUBS,
  },
  62: {
    card: Cards.JACK,
    suit: Suits.CLUBS,
  },
  63: {
    card: Cards.QUEEN,
    suit: Suits.CLUBS,
  },
  64: {
    card: Cards.KING,
    suit: Suits.CLUBS,
  },
  65: {
    card: Cards.ACE,
    suit: Suits.CLUBS,
  },
  66: {
    card: Cards.TWO,
    suit: Suits.DIAMONDS,
  },
  67: {
    card: Cards.THREE,
    suit: Suits.DIAMONDS,
  },
  68: {
    card: Cards.FOUR,
    suit: Suits.DIAMONDS,
  },
  69: {
    card: Cards.FIVE,
    suit: Suits.DIAMONDS,
  },
  70: {
    card: Cards.SIX,
    suit: Suits.DIAMONDS,
  },
  71: {
    card: Cards.SEVEN,
    suit: Suits.DIAMONDS,
  },
  72: {
    card: Cards.EIGHT,
    suit: Suits.DIAMONDS,
  },
  73: {
    card: Cards.NINE,
    suit: Suits.DIAMONDS,
  },
  74: {
    card: Cards.TEN,
    suit: Suits.DIAMONDS,
  },
  75: {
    card: Cards.JACK,
    suit: Suits.DIAMONDS,
  },
  76: {
    card: Cards.QUEEN,
    suit: Suits.DIAMONDS,
  },
  77: {
    card: Cards.KING,
    suit: Suits.DIAMONDS,
  },
  78: {
    card: Cards.ACE,
    suit: Suits.DIAMONDS,
  },
  79: {
    card: Cards.TWO,
    suit: Suits.HEARTS,
  },
  80: {
    card: Cards.THREE,
    suit: Suits.HEARTS,
  },
  81: {
    card: Cards.FOUR,
    suit: Suits.HEARTS,
  },
  82: {
    card: Cards.FIVE,
    suit: Suits.HEARTS,
  },
  83: {
    card: Cards.SIX,
    suit: Suits.HEARTS,
  },
  84: {
    card: Cards.SEVEN,
    suit: Suits.HEARTS,
  },
  85: {
    card: Cards.EIGHT,
    suit: Suits.HEARTS,
  },
  86: {
    card: Cards.NINE,
    suit: Suits.HEARTS,
  },
  87: {
    card: Cards.TEN,
    suit: Suits.HEARTS,
  },
  88: {
    card: Cards.JACK,
    suit: Suits.HEARTS,
  },
  89: {
    card: Cards.QUEEN,
    suit: Suits.HEARTS,
  },
  90: {
    card: Cards.KING,
    suit: Suits.HEARTS,
  },
  91: {
    card: Cards.ACE,
    suit: Suits.HEARTS,
  },
  92: {
    card: Cards.TWO,
    suit: Suits.SPADES,
  },
  93: {
    card: Cards.THREE,
    suit: Suits.SPADES,
  },
  94: {
    card: Cards.FOUR,
    suit: Suits.SPADES,
  },
  95: {
    card: Cards.FIVE,
    suit: Suits.SPADES,
  },
  96: {
    card: Cards.SIX,
    suit: Suits.SPADES,
  },
  97: {
    card: Cards.SEVEN,
    suit: Suits.SPADES,
  },
  98: {
    card: Cards.EIGHT,
    suit: Suits.SPADES,
  },
  99: {
    card: Cards.NINE,
    suit: Suits.SPADES,
  },
  100: {
    card: Cards.TEN,
    suit: Suits.SPADES,
  },
  101: {
    card: Cards.JACK,
    suit: Suits.SPADES,
  },
  102: {
    card: Cards.QUEEN,
    suit: Suits.SPADES,
  },
  103: {
    card: Cards.KING,
    suit: Suits.SPADES,
  },
  104: {
    card: Cards.ACE,
    suit: Suits.SPADES,
  },
  105: {
    card: Cards.JOKER,
    suit: Suits.JOKER,
  },
};
