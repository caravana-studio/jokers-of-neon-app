import { BLUE_LIGHT, VIOLET_LIGHT, DIAMONDS } from "../theme/colors";

import i18n from "i18next";

export const t = (key: string) => {
  return i18n.t(key, { ns: "game" });
};

export const colorizeText = (inputText: string) => {
  if (!inputText) return "";

  const regex = /\^(\w+)\((.+?)\)\^/g;

  const elements: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(inputText)) !== null) {
    const [fullMatch, colorKey, content] = match;
    const index = match.index;

    if (lastIndex < index) {
      elements.push(inputText.slice(lastIndex, index));
    }

    const colorMap: Record<string, string> = {
      violet: VIOLET_LIGHT,
      blue: BLUE_LIGHT,
      yellow: DIAMONDS,
    };

    elements.push(
      <span
        key={index}
        style={{
          fontWeight: "bold",
          color: colorMap[colorKey] || "inherit",
        }}
      >
        {content}
      </span>
    );

    lastIndex = index + fullMatch.length;
  }

  // Push the remaining text after the last match
  if (lastIndex < inputText.length) {
    elements.push(inputText.slice(lastIndex));
  }

  return elements;
};

export const getTooltip = (name: string, description: string) => {
  return (
    <>
      <strong>{name}</strong>: {colorizeText(description)}
    </>
  );
};
