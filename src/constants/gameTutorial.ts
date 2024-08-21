import { Step } from 'react-joyride';
import { isMobile } from "react-device-detect";

const COMMON_SETTINGS: Partial<Step> =
{
  disableBeacon: true,
  placement: 'auto',
  disableScrollParentFix: isMobile ? true: false,
}

export const GAME_TUTORIAL_STEPS: Step[] = [
  {
    target: '.game-tutorial-step-1',
    title: 'Points target',
    content: 'The amount of points you need to score to proceed to the next level',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-2',
    title: 'Playable hand',
    content: 'This is your hand. Click on a card to preselect it',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-3',
    title: 'Discard Cards',
    content: 'Discard your preselected cards',
    ...COMMON_SETTINGS,
    placement: 'right'
  },
  {
    target: '.game-tutorial-step-4',
    title: 'Play Cards',
    content: 'Whenever you are ready you can play your preselected cards',
    ...COMMON_SETTINGS,
    placement: 'left'
  },
  {
    target: '.game-tutorial-step-5',
    title: 'Form a Poker Hand',
    content: 'Create a valid poker hand. Click the "i" icon to see available hands',
    ...COMMON_SETTINGS,
    placement: 'top'
  },
  {
    target: '.game-tutorial-step-6',
    title: 'Points and Multiplier',
    content: 'Each hand has a base points and multiplier',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-7',
    title: 'Score Calculation',
    content: 'When you play a hand, your card points are added up and multiplied by the multiplier',
    ...COMMON_SETTINGS,
    placement: 'left'
  },
  {
    target: '.game-tutorial-step-8',
    title: 'Deck Overview',
    content: 'Check the number of cards left in your deck',
    ...COMMON_SETTINGS,
    placement: 'left'
  },
  {
    target: '.game-tutorial-step-9',
    title: 'Game Menu',
    content: 'Toggle to adjust sound settings, start a new game, or log out',
    ...COMMON_SETTINGS,
    placement: 'top'
  }
];

export const REWARDS_TUTORIAL_STEPS: Step[] = [
  {
    target: '.game-tutorial-step-1',
    title: 'Coins!',
    content: 'Congratulations! After defeating a level, you earn coins to spend in the store.',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-2',
    title: 'Maximize Coins by Using Fewer Hands',
    content: 'Using fewer hands in the level rewards you with more coins. Strategize wisely!',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-3',
    title: 'Minimize Discards for More Coins',
    content: 'Minimizing discards also increases your coin rewards. Plan your moves carefully!',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-4',
    title: 'Ready to Play?',
    content: "You're all set! Let's dive into the store and start BUIDLing your deck!",
    ...COMMON_SETTINGS
  }
];

export const STORE_TUTORIAL_STEPS: Step[] = [
  {
    target: '.game-tutorial-step-1',
    title: 'Coins',
    content: 'Congratulations! After defeating a level, you earn coins to spend in the store. You can see your total coins here.',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-2',
    title: 'Level Up Your Hands',
    content: 'You can upgrade your hands. The higher the level of your poker hands, the more points and multi they score',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-3',
    title: 'Buy Traditional Cards',
    content: 'Here you can buy traditional cards to enhance your deck. Choose wisely to create powerful combinations.',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-4',
    title: 'Modifiers',
    content: 'Modifiers are cards that are added to your deck and apply effects to your traditional cards, like adding more points or changing the suit',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-5',
    title: 'Special Cards',
    content: 'Special cards grant unique global powers and get active immediately. These can turn the tide of the game!',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-6',
    title: 'Reroll the Store',
    content: 'Not finding what you need? Spend some coins to reroll the store and see a fresh set of cards and hands to upgrade.',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-7',
    title: 'Proceed to the Next Level',
    content: 'Ready to continue? Click here to advance to the next level and face new challenges!',
    ...COMMON_SETTINGS
  }
];

export const SPECIAL_CARDS_TUTORIAL_STEPS: Step[] = [
  {
    target: '.special-cards-step-1', 
    title: 'Special Cards',
    content: 'Special cards activate immediately after you purchase them in the store. They apply their effects after your hand is played.',
    ...COMMON_SETTINGS
  },
  {
    target: '.special-cards-step-2', 
    title: 'Card Limit',
    content: 'You can have up to 5 special cards active at any time. Use them wisely to maximize their benefits!',
    ...COMMON_SETTINGS
  },
  {
    target: '.special-cards-step-3', 
    title: 'Discarding Cards',
    content: 'If you don’t want to use a special card, you can discard it at any time by right-clicking on it.',
    ...COMMON_SETTINGS
  }
];


export const MODIFIERS_TUTORIAL_STEPS: Step[] = [
  {
    target: '.modifiers-step-1', 
    title: 'Preselect a Card',
    content: (!isMobile ? 'Click' : 'Tap') + ' to choose the card you want to modify.',
    ...COMMON_SETTINGS
  },
  {
    target: '.modifiers-step-2', 
    title: 'Select a Modifier',
    content: 'Drag the desired modifier from the hand.',
    ...COMMON_SETTINGS
  },
  {
    target: '.modifiers-step-3', 
    title: 'Apply the Modifier',
    content: 'Drop the modifier onto the preselected card to apply the effect.',
    ...COMMON_SETTINGS
  },
  {
    target: '.modifiers-step-4', 
    title: 'Discard the Modified Card',
    content: (!isMobile ? 'Right click the modifier' : 'Drag the modifier and drop it onto the discard button') + ' to discard the card without losing any discard chances.',
    ...COMMON_SETTINGS
  }
];

export const TUTORIAL_STYLE = {
  options: {
    arrowColor: '#DAA1E8', 
    backgroundColor: '#1A1A1A', 
    overlayColor: 'rgba(0, 0, 0, 0.7)',
    primaryColor: '#DAA1E8', 
    textColor: '#FFFFFF',
    width: 350, 
    zIndex: 1000,
  },
  buttonClose: {
    color: '#DAA1E8', 
  },
  buttonNext: {
    backgroundColor: '#DAA1E8', 
    color: '#000000',
  },
  buttonBack: {
    color: '#DAA1E8',
  },
  tooltip: {
    borderRadius: '12px',
    boxShadow: '0 0 15px rgba(218, 161, 232, 0.5)',
  },
};
