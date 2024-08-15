
const COMMON_SETTINGS =
{
  disableBeacon: true,
}

export const GAME_TUTORIAL_STEPS = [
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
    ...COMMON_SETTINGS,
  },
  {
    target: '.game-tutorial-step-3',
    title: 'Discard Cards',
    content: 'Discard your preselected cards',
    ...COMMON_SETTINGS,
    placement: 'right',
  },
  {
    target: '.game-tutorial-step-4',
    title: 'Play Cards',
    content: 'Play your preselected cards to form a hand',
    ...COMMON_SETTINGS,
    placement: 'left',
  },
  {
    target: '.game-tutorial-step-5',
    title: 'Form a Poker Hand',
    content: 'Create a valid poker hand. Click the "i" icon to see available hands',
    ...COMMON_SETTINGS,
    placement: 'top',
  },
  {
    target: '.game-tutorial-step-6',
    title: 'Points and Multiplier',
    content: 'Each hand has a base score and multiplier',
    ...COMMON_SETTINGS,
  },
  {
    target: '.game-tutorial-step-7',
    title: 'Score Calculation',
    content: 'After playing, your card points are added up, multiplied by the multiplier, and added to your total score',
    ...COMMON_SETTINGS,
    placement: 'left',
  },
  {
    target: '.game-tutorial-step-8',
    title: 'Deck Overview',
    content: 'Check the number of cards left in your deck',
    ...COMMON_SETTINGS,
    placement: 'left',
  },
  {
    target: '.game-tutorial-step-9',
    title: 'Game Menu',
    content: 'Toggle to adjust sound settings, start a new game, or log out',
    ...COMMON_SETTINGS,
  }
];