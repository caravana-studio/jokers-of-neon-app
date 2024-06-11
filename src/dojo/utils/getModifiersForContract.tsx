export const getModifiersForContract = (
  cards: number[],
  modifiers: { [key: number]: number[] }
) => {
  const modifiers1 = cards.map((cardIdx) => modifiers[cardIdx]?.[0] ?? 100);
  const modifiers2 = cards.map((cardIdx) => modifiers[cardIdx]?.[1] ?? 100);
  return {
    modifiers1,
    modifiers2,
  };
};
