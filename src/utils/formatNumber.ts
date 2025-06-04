export const formatNumber = (n: number): string => {
  if (n < 1000) return `${n}`;

  const units = [
    { value: 1_000_000_000, suffix: "B" },
    { value: 1_000_000, suffix: "M" },
    { value: 1_000, suffix: "K" },
  ];

  for (const unit of units) {
    if (n >= unit.value) {
      const reduced = n / unit.value;
      return `${reduced.toFixed(1)}${unit.suffix}`;
    }
  }

  return `${n}`;
};