export const getTemporalCardText = ( remaining?: number) => {
  return `Temporal card. It will be destroyed after ${ remaining ? remaining : 3 } levels.`;
}
