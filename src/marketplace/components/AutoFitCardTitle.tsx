import { Text, useBreakpointValue, type TextProps } from "@chakra-ui/react";
import { useCallback, useLayoutEffect, useRef } from "react";

interface AutoFitCardTitleProps extends Omit<TextProps, "children" | "fontSize"> {
  children: string;
  maxFontSizeBase?: number;
  maxFontSizeMd?: number;
  minFontSizeBase?: number;
  minFontSizeMd?: number;
}

export function AutoFitCardTitle({
  children,
  maxFontSizeBase = 15,
  maxFontSizeMd = 17,
  minFontSizeBase = 10,
  minFontSizeMd = 11,
  ...props
}: AutoFitCardTitleProps) {
  const titleRef = useRef<HTMLParagraphElement>(null);
  const fontSizeRange = useBreakpointValue({
    base: { max: maxFontSizeBase, min: minFontSizeBase },
    md: { max: maxFontSizeMd, min: minFontSizeMd },
  }) ?? { max: maxFontSizeMd, min: minFontSizeMd };

  const fitTitle = useCallback(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;

    let nextFontSize = fontSizeRange.max;
    titleElement.style.fontSize = `${fontSizeRange.max}px`;

    while (
      nextFontSize > fontSizeRange.min &&
      titleElement.scrollWidth > titleElement.clientWidth
    ) {
      nextFontSize -= 0.5;
      titleElement.style.fontSize = `${nextFontSize}px`;
    }
  }, [fontSizeRange.max, fontSizeRange.min]);

  useLayoutEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;

    const frameId = window.requestAnimationFrame(fitTitle);
    const observerTarget = titleElement.parentElement;
    const resizeObserver =
      observerTarget && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => fitTitle())
        : null;

    if (observerTarget) {
      resizeObserver?.observe(observerTarget);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
    };
  }, [children, fitTitle]);

  return (
    <Text
      ref={titleRef}
      fontFamily="Orbitron"
      fontSize={`${fontSizeRange.max}px`}
      textTransform="uppercase"
      textAlign="center"
      w="100%"
      lineHeight={1.1}
      whiteSpace="nowrap"
      title={children}
      {...props}
    >
      {children}
    </Text>
  );
}
