export const GAME_TUTORIAL_STEPS = [
  {
    target: '.game-tutorial-step-1',
    content: 'Level and points to score',
    disableBeacon: true,
  },
  {
    target: '.game-tutorial-step-2',
    content: 'You can preselect cards by clicking on them',
    disableBeacon: true,
  },
  {
    target: '.game-tutorial-step-3',
    content: 'Once you preselect them you can discard',
    disableBeacon: true,
  }
//   {
//     target: '.my-other-step',
//     content: 'or play',
//   },
//   {
//     target: '.my-other-step',
//     content: 'You need to form a poker play, see the available plays by clicking on the i',
//   },
//   {
//     target: '.my-other-step',
//     content: 'each play has base amount of points and multi',
//   },
//   {
//     target: '.my-other-step',
//     content: 'once you play your cards, every card point will get added to the points, the total points will get multiplied by the multi and that will be added to the score',
//   },
//   {
//     target: '.my-other-step',
//     content: 'deck with amount of cards left',
//   },
//   {
//     target: '.my-other-step',
//     content: 'menu to toggle on or off the sound, create a new game or logout',
//   }
];

export const REWARDS_TUTORIAL_STEPS = [
  {
    target: '.game-tutorial-step-1',
    content: 'Once you beat a level, you will get coins to use in the store',
    disableBeacon: true,
  },
  {
    target: '.game-tutorial-step-2',
    content: 'The less hands you use, the more coins you get',
    disableBeacon: true,
  },
  {
    target: '.game-tutorial-step-3',
    content: 'The less discards you use, the more coins you get',
    disableBeacon: true,
  },
  {
    target: '.game-tutorial-step-4',
    content: "Let's play",
    disableBeacon: true,
  }
];


export const REWARD_TUTORIAL_STYLE = {
  options: {
    arrowColor: '#DAA1E8', // Background color of the arrow
    backgroundColor: '#333', // Background color of the tooltip box
    overlayColor: 'rgba(0, 0, 0, 0.5)', // Background color of the overlay
    primaryColor: '#DAA1E8', // Primary color (used for buttons)
    textColor: '#FFF', // Text color inside the tooltip box
    width: 300, // Width of the tooltip box
    zIndex: 1000, // Z-index of the tooltip box
  },
  buttonClose: {
    color: '#DAA1E8', // Color of the close button (X)
  },
  buttonNext: {
    backgroundColor: '#DAA1E8', // Background color of the "Next" button
  },
  buttonBack: {
    color: '#DAA1E8', // Color of the "Back" button
  },
  tooltip: {
    borderRadius: '10px', // Border radius of the tooltip box
  },
};