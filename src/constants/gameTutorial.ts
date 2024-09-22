import { isMobile } from "react-device-detect";
import { Step } from "react-joyride";

const COMMON_SETTINGS: Partial<Step> = {
  disableBeacon: true,
  placement: "auto",
  disableScrollParentFix: isMobile ? true : false,
};

export const GAME_TUTORIAL_STEPS: Step[] = [
  {
    target: ".game-tutorial-step-1",
    title: "Points target",
    content:
      "The amount of points you need to score to proceed to the next level",
    ...COMMON_SETTINGS,
  },
  {
    target: ".game-tutorial-step-2",
    title: "Playable hand",
    content:
      "This is your hand. Click on cards to preselect them and form a poker hand",
    ...COMMON_SETTINGS,
  },
  {
    target: ".game-tutorial-step-3",
    title: "Discard Cards",
    content: "Discard your preselected cards",
    ...COMMON_SETTINGS,
    placement: "right",
  },
  {
    target: ".game-tutorial-step-4",
    title: "Play Cards",
    content: "Whenever you are ready you can play your preselected cards",
    ...COMMON_SETTINGS,
    placement: "left",
  },
  {
    target: ".game-tutorial-step-6",
    title: "Points and Multiplier",
    content:
      "Each poker hand has a base points and multiplier that will contribute to your final score",
    ...COMMON_SETTINGS,
  },
];

export const STORE_TUTORIAL_STEPS: Step[] = [
  {
    target: ".game-tutorial-step-1",
    title: "Coins",
    content:
      "Congratulations! After defeating a level, you earn coins to spend in the store.",
    ...COMMON_SETTINGS,
  },
  {
    target: ".game-tutorial-step-2",
    title: "Level Up Your Hands",
    content:
      "You can upgrade your hands. The higher the level of your poker hands, the more points and multi they score",
    ...COMMON_SETTINGS,
  },
  {
    target: ".game-tutorial-step-3",
    title: "Buy Traditional and Neon Cards",
    content:
      "Here you can buy traditional and neon cards to enhance your deck. Neon cards score double points and +1 multi..",
    ...COMMON_SETTINGS,
  },
  {
    target: ".game-tutorial-step-4",
    title: "Modifiers",
    content:
      "Modifiers are cards that are added to your deck and apply effects to your traditional cards, like adding more points or changing the suit",
    ...COMMON_SETTINGS,
  },
  {
    target: ".game-tutorial-step-5",
    title: "Special Cards",
    content:
      "Special cards grant unique global powers and get active immediately. These can turn the tide of the game!",
    ...COMMON_SETTINGS,
  },
  {
    target: ".game-tutorial-step-6",
    title: "Reroll the Store",
    content:
      "Not finding what you need? Spend some coins to reroll the store and see a fresh set of cards and hands to upgrade.",
    ...COMMON_SETTINGS,
  },
  {
    target: ".game-tutorial-step-7",
    title: "Proceed to the Next Level",
    content:
      "Ready to continue? Click here to advance to the next level and face new challenges!",
    ...COMMON_SETTINGS,
  },
];

export const SPECIAL_CARDS_TUTORIAL_STEPS: Step[] = [
  {
    target: ".special-cards-step-1",
    title: "Special Cards",
    content:
      "Special cards activate immediately after you purchase them in the store. They apply their effects after your hand is played.",
    ...COMMON_SETTINGS,
  },
  {
    target: ".special-cards-step-3",
    title: "Discarding Cards",
    content:
      "If you don’t want to use a special card, you can discard it at any time by" +
      (!isMobile
        ? " clicking the discard button that will pop up over the card."
        : " dragging it to the discard button."),
    ...COMMON_SETTINGS,
  },
];

export const MODIFIERS_TUTORIAL_STEPS: Step[] = [
  {
    target: ".tutorial-modifiers-step-1",
    title: "Modifier card",
    content:
      "Modifier cards enhance or alter a specific card. Drag and drop a modifier onto a preselected card to activate its effect.",
    ...COMMON_SETTINGS,
  },
  {
    target: ".tutorial-modifiers-step-2",
    title: "Discard",
    content:
      (!isMobile
        ? "Click the discard button that will pop up over the card"
        : "Drag the modifier and drop it onto the discard button") +
      " to discard it without losing any discard chances.",
    ...COMMON_SETTINGS,
  },
];

export const TUTORIAL_STYLE = {
  options: {
    arrowColor: "#DAA1E8",
    backgroundColor: "#1A1A1A",
    overlayColor: "rgba(0, 0, 0, 0.7)",
    primaryColor: "#DAA1E8",
    textColor: "#FFFFFF",
    width: 350,
    zIndex: 1000,
  },
  buttonClose: {
    color: "#DAA1E8",
  },
  buttonNext: {
    backgroundColor: "#DAA1E8",
    color: "#000000",
  },
  buttonBack: {
    color: "#DAA1E8",
  },
  tooltip: {
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(218, 161, 232, 0.5)",
  },
  spotlight: {
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(255, 255, 255, 0.9)",
  },
};
