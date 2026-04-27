import { Box, Flex, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { MdKeyboardArrowDown } from "react-icons/md";

interface MoreOptionsToggleProps {
  isLifted: boolean;
  isBackLabel: boolean;
  moreOptionsLabel: string;
  goBackLabel: string;
  onToggle: () => void;
  liftDistance: number;
  moveDuration: number;
}

export const MoreOptionsToggle = ({
  isLifted,
  isBackLabel,
  moreOptionsLabel,
  goBackLabel,
  onToggle,
  liftDistance,
  moveDuration,
}: MoreOptionsToggleProps) => (
  <motion.div
    animate={{ y: isLifted ? -liftDistance : 0 }}
    transition={{ duration: moveDuration, ease: "easeInOut" }}
  >
    <Flex
      as="button"
      type="button"
      mt={{ base: 2.5, md: 0.5 }}
      alignItems="center"
      gap={1.5}
      color="#A3A4AA"
      onClick={onToggle}
    >
      <Box
        position="relative"
        minW={{ base: "92px", sm: "118px", md: "122px" }}
        h={{ base: "16px", sm: "18px", md: "19px" }}
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={isBackLabel ? "go-back" : "more-options"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
            }}
          >
            <Text
              fontFamily="Oxanium"
              fontSize={{ base: "13px", sm: "15px", md: "16px" }}
              lineHeight={1}
            >
              {isBackLabel ? goBackLabel : moreOptionsLabel}
            </Text>
          </motion.span>
        </AnimatePresence>
      </Box>

      <motion.div
        animate={{ rotate: isLifted ? 180 : 0 }}
        transition={{ duration: moveDuration, ease: "easeInOut" }}
        style={{ display: "grid", placeItems: "center" }}
      >
        <MdKeyboardArrowDown size={15} color="#A3A4AA" />
      </motion.div>
    </Flex>
  </motion.div>
);
