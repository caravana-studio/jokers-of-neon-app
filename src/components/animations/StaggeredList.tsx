import React, { useEffect, useRef } from "react";
import { Flex, FlexProps } from "@chakra-ui/react";
import { motion } from "framer-motion";

type StaggeredListProps = FlexProps & {
  children: React.ReactNode;
  stagger?: number;
  delayStart?: number;
  skip?: boolean;
  onEnd?: () => void;
};

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  stagger = 0.3,
  delayStart = 0,
  skip = false,
  onEnd,
  direction = "column",
  gap = 2,
  ...flexProps
}) => {
  const finishedRef = useRef(false);
  const childArray = React.Children.toArray(children);

  useEffect(() => {
    finishedRef.current = false;
  }, [childArray.length, skip]);

  return (
    <Flex direction={direction} gap={gap} {...flexProps}>
      {childArray.map((child, index) => {
        const isSkipping = skip;

        const delay = isSkipping ? 0 : delayStart + index * stagger;
        const duration = isSkipping ? 0 : 0.45;

        return (
          <motion.div
            key={`${index}-${skip}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration, ease: "easeOut" }}
            onAnimationComplete={() => {
              if (index === childArray.length - 1) {
                onEnd?.();
              }
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </Flex>
  );
};
