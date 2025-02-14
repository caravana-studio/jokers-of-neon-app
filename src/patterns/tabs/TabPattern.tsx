import { Tab as ChakraTab, Flex, TabList, Tabs } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { MobileDecoration } from "../../components/MobileDecoration";

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
}

export const TabPattern = ({
  children,
  topBar,
  bottomBar,
  lastIndexTab = 0,
  disableGoBack = false,
}: TabPatternProps) => {
  const [tabIndex, setTabIndex] = useState(lastIndexTab);
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (tabIndex < children.length - 1) setTabIndex(tabIndex + 1);
    },
    onSwipedRight: () => {
      if (tabIndex === 0 && !disableGoBack) {
        navigate(-1);
      } else if (tabIndex > 0) setTabIndex(tabIndex - 1);
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
    >
      <MobileDecoration />
      <Tabs
        index={tabIndex}
        onChange={setTabIndex}
        w="90%"
        isFitted
        color="white"
        {...handlers}
      >
        <TabList>
          {children.map((child, index) => (
            <ChakraTab
              key={index}
              fontSize={children.length > 3 ? [10, 14] : [12, 14]}
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
        {topBar}
        <AnimatePresence mode="wait">
          <motion.div
            key={tabIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ width: "100%", height: "100%", display: "flex", flexDirection: 'column' }}
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
