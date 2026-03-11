// Parses ^color(text)^ markup from card descriptions into colored spans.
// Colors match the game app's palette.

const COLOR_MAP: Record<string, string> = {
  blue:   "#20C6ED",
  violet: "#DCA2EA",
  yellow: "#ff934b",
};

export function colorizeText(input: string): React.ReactNode {
  if (!input) return "";

  const regex = /\^(\w+)\((.+?)\)\^/g;
  const elements: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    const [fullMatch, colorKey, content] = match;
    if (lastIndex < match.index) {
      elements.push(input.slice(lastIndex, match.index));
    }
    elements.push(
      <span
        key={match.index}
        style={{ fontWeight: "bold", color: COLOR_MAP[colorKey] ?? "inherit" }}
      >
        {content}
      </span>
    );
    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < input.length) {
    elements.push(input.slice(lastIndex));
  }

  return elements.length === 1 && typeof elements[0] === "string"
    ? elements[0]
    : elements;
}
