import { Box, Flex } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useGameQuickPreviewStore } from "../../state/useGameQuickPreviewStore";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DeckPreviewTable } from "../DeckPreview/DeckPreviewTable";
import { MotionBox } from "../MotionBox";
import { MissionsQuickPreview } from "./MissionsQuickPreview";
import { PlaysQuickPreview } from "./PlaysQuickPreview";

export const GameQuickPreviewOverlay = () => {
  const activePreviewType = useGameQuickPreviewStore(
    (store) => store.activePreviewType,
  );
  const clearPreviewType = useGameQuickPreviewStore(
    (store) => store.clearPreviewType,
  );
  const gameId = useGameStore((store) => store.id);
  const { isSmallScreen } = useResponsiveValues();
  const hasGameContext = gameId > 0;

  useEffect(() => {
    if (!hasGameContext) {
      clearPreviewType();
    }
  }, [clearPreviewType, hasGameContext]);

  const content =
    !hasGameContext ? null : activePreviewType === "deck" ? (
      <DeckPreviewTable />
    ) : activePreviewType === "plays" ? (
      <PlaysQuickPreview />
    ) : activePreviewType === "missions" ? (
      <MissionsQuickPreview />
    ) : null;

  const previewWidth =
    activePreviewType === "deck"
      ? isSmallScreen
        ? "95vw"
        : "auto"
      : activePreviewType === "missions"
        ? { base: "95vw", md: "min(980px, calc(100vw - 120px))" }
        : { base: "95vw", md: "min(920px, calc(100vw - 120px))" };

  return (
    <AnimatePresence>
      {activePreviewType && content && (
        <>
          <MotionBox
            position="fixed"
            zIndex={1400}
            inset={0}
            pointerEvents="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Box
              position="absolute"
              inset={0}
              background="rgba(0, 0, 0, 0.4)"
              sx={{ backdropFilter: "blur(6px)" }}
            />
          </MotionBox>
          <MotionBox
            position="fixed"
            zIndex={1500}
            inset={0}
            pointerEvents="none"
            display="flex"
            alignItems="center"
            justifyContent="center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <MotionBox
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Flex justifyContent="center" position="relative" zIndex={1}>
                <Box
                  width={previewWidth}
                  maxWidth="95vw"
                  sx={
                    activePreviewType === "deck"
                      ? { "& table": { width: "100%" } }
                      : undefined
                  }
                >
                  {content}
                </Box>
              </Flex>
            </MotionBox>
          </MotionBox>
        </>
      )}
    </AnimatePresence>
  );
};
