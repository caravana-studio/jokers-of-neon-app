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
    title: 'Coins!',
    content: 'Congratulations! After defeating a level, you earn coins to spend in the store.',
    disableBeacon: true,
  },
  {
    target: '.game-tutorial-step-2',
    title: 'Maximize Coins by Using Fewer Hands',
    content: 'Using fewer hands in the level rewards you with more coins. Strategize wisely!',
    disableBeacon: true,
  },
  {
    target: '.game-tutorial-step-3',
    title: 'Minimize Discards for More Coins',
    content: 'Minimizing discards also increases your coin rewards. Plan your moves carefully!',
    disableBeacon: true,
  },
  {
    target: '.game-tutorial-step-4',
    title: 'Ready to Play?',
    content: "You're all set! Lets dive into the game and start earning those rewards!",
    disableBeacon: true,
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