import { Tab as ChakraTab, Flex, TabList, Tabs } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentProps, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider";

interface TabProps {
  title: string;
  children: ReactNode;
}

interface TabPatternProps {
  children: React.ReactElement<TabProps>[];
  bottomBar?: ReactNode;
  topBar?: ReactNode;
  lastIndexTab?: number;
  disableGoBack?: boolean;
  onTabChange?: (index: number) => void;
  mobileDecorationProps?: ComponentProps<typeof MobileDecoration>;
}

export const TabPattern = ({
  children,
  topBar,
  bottomBar,
  lastIndexTab = 0,
  disableGoBack = false,
  onTabChange,
  mobileDecorationProps = {},
}: TabPatternProps) => {
  const [tabIndex, setTabIndex] = useState(lastIndexTab);
  const navigate = useNavigate();
  const { highlightedItem: highlightedCard } = useCardHighlight();
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right">(
    "left"
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!highlightedCard) {
        if (tabIndex < children.length - 1) {
          setSwipeDirection("left");
          setTabIndex(tabIndex + 1);
        }
      }
    },
    onSwipedRight: () => {
      if (!highlightedCard) {
        if (tabIndex === 0 && !disableGoBack) {
          navigate("/store");
        } else if (tabIndex > 0) {
          setSwipeDirection("right");
          setTabIndex(tabIndex - 1);
        }
      }
    },
    trackTouch: true,
  });

  return (
    <Flex
      width="100%"
      height="100%"
      pt={[8, "80px"]}
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      flexDirection="column"
      overflow="hidden"
      {...handlers}
    >
      {topBar}
      <MobileDecoration {...mobileDecorationProps} />
      <Tabs
        index={tabIndex}
        onChange={(index) => {
          setSwipeDirection(index > tabIndex ? "left" : "right");
          setTabIndex(index);
          onTabChange?.(index);
        }}
        w="90%"
        isFitted
        color="white"
      >
        <TabList>
          {children.map((child, index) => (
            <ChakraTab
              key={index}
              px={children.length > 3 ? 1 : 3}
              fontSize={children.length > 3 ? [10, 14] : [11, 14]}
              zIndex={10}
            >
              {child.props.title}
            </ChakraTab>
          ))}
        </TabList>
      </Tabs>

      <Flex
        w="100%"
        height="100%"
        justify="center"
        align="center"
        overflow="hidden"
        flexDir={"column"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={tabIndex}
            initial={{ opacity: 0, x: swipeDirection === "left" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: swipeDirection === "left" ? 50 : -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children[tabIndex]}
          </motion.div>
        </AnimatePresence>
      </Flex>

      {bottomBar}
    </Flex>
  );
};

export const Tab = ({ title, children }: TabProps) => {
  return <>{children}</>;
};
