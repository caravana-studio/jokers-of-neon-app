import { Center, Heading, useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { RollingNumber } from "../RollingNumber";

interface INumberBoxProps {
  number: number;
  color: string;
  spreadIncrease?: number;
  large?: boolean;
}

export const NumberBox = ({
  number,
  color,
  spreadIncrease = 100,
  large = false,
}: INumberBoxProps) => {
  const [prevNumber, setPrevNumber] = useState(number);
  const width = useBreakpointValue({
    base: "70px",
    md: large ? "105px" : "70px",
  });
  const horizontalMargin = useBreakpointValue({
    base: "7px",
    md: large ? "10px" : "7px",
  });
  const numberFontSize = useBreakpointValue({
    base: "sm",
    md: large ? "xl" : "sm",
  });

  const [{ boxShadow }, set] = useSpring(() => ({
    boxShadow: `0px 0px 3px 1px ${color}`,
  }));

  useEffect(() => {
    if (number > prevNumber) {
      const spread = 4 + Math.floor(number / spreadIncrease) * 2;
      set({ boxShadow: `0px 0px ${spread}px ${spread / 2}px ${color}` });

      const timeout = setTimeout(() => {
        set({ boxShadow: `0px 0px 3px 1px ${color}` });
      }, 700);

      return () => clearTimeout(timeout);
    }

    setPrevNumber(number);
  }, [number, color, set, prevNumber]);

  return (
    <animated.div
      style={{
        boxShadow,
        borderRadius: "80px",
        width,
        marginLeft: horizontalMargin,
        marginRight: horizontalMargin,
        border: `2px solid ${color}`,
      }}
    >
      <Center>
        <Heading fontSize={numberFontSize}>
          <RollingNumber n={number} />
        </Heading>
      </Center>
    </animated.div>
  );
};
