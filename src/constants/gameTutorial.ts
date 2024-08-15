import { Step } from 'react-joyride';

const COMMON_SETTINGS: Partial<Step> =
{
  disableBeacon: true,
  placement: 'auto',
}

export const GAME_TUTORIAL_STEPS: Step[] = [
  {
    target: '.game-tutorial-step-1',
    title: 'Level Progress',
    content: 'View your current level and the points needed to advance',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-2',
    title: 'Card Preselection',
    content: 'Click to preselect cards for future actions',
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
    content: 'Play your preselected cards to form a hand',
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
    content: 'Each hand has a base score and multiplier',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-7',
    title: 'Score Calculation',
    content: 'After playing, your card points are added up, multiplied by the multiplier, and added to your total score',
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
    content: "You're all set! Lets dive into the game and start earning those rewards!",
    ...COMMON_SETTINGS
  }
];

export const STORE_TUTORIAL_STEPS: Step[] = [
  {
    target: '.game-tutorial-step-1',
    title: 'Coins!',
    content: 'Congratulations! After defeating a level, you earn coins to spend in the store. You can see your total coins here.',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-2',
    title: 'Level Up Your Hands',
    content: 'Upgrade your hands by spending coins. The higher the level of your poker hands, the easier it is to win.',
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
    content: 'Modifiers are special cards that apply effects to your traditional cards, like adding more points or changing the suit.',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-5',
    title: 'Special Cards',
    content: 'Special cards grant unique powers, such as completing a flush with only four cards. These can turn the tide of the game!',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-6',
    title: 'Reroll the Store',
    content: 'Not finding what you need? Spend some coins to reroll the store and see a fresh set of cards and modifiers.',
    ...COMMON_SETTINGS
  },
  {
    target: '.game-tutorial-step-7',
    title: 'Proceed to the Next Level',
    content: 'Ready to continue? Click here to advance to the next level and face new challenges!',
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
