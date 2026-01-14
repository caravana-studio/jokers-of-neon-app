import { ReactNode } from "react";
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { MotionBox } from "../../MotionBox";
import { DailyMissions } from "../../DailyMissions/DailyMissions";
import { VIOLET } from "../../../theme/colors";

interface DailyMissionsPopoverProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  trigger: ReactNode;
}

export const DailyMissionsPopover = ({
  isOpen,
  onOpen,
  onClose,
  trigger,
}: DailyMissionsPopoverProps) => {
  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="right-start"
      closeOnBlur
      isLazy
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent
        w="290px"
        maxH="400px"
        overflowY="auto"
        borderRadius="10px"
        border="2px solid #DAA1E8FF"
        boxShadow={`0px 0px 15px 7px ${VIOLET}`}
        bg="rgba(0, 0, 0, 0.95)"
        p={0}
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <MotionBox
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
        >
          <PopoverBody p={4}>
            <DailyMissions showTitle fontSize="13px" />
          </PopoverBody>
        </MotionBox>
      </PopoverContent>
    </Popover>
  );
};
