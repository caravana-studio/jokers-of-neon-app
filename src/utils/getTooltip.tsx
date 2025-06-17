import { BLUE_LIGHT, VIOLET_LIGHT } from "../theme/colors";
import { Card } from "../types/Card";

import i18n from "i18next";

export const t = (key: string) => {
  return i18n.t(key, { ns: "game" });
};

export const colorizeText = (inputText: string) => {
  if (!inputText) return "";

  // Match patterns like ^violet(+2 multi)^
  const regex = /\^(\w+)\((.+?)\)\^/g;

  const elements: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(inputText)) !== null) {
    const [fullMatch, colorKey, content] = match;
    const index = match.index;

    // Push the text before the match
    if (lastIndex < index) {
      elements.push(inputText.slice(lastIndex, index));
    }

    // Choose color
    const colorMap: Record<string, string> = {
      violet: VIOLET_LIGHT,
      blue: BLUE_LIGHT,
      // Add more colors if needed
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
