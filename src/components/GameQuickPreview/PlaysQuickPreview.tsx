import { Box } from "@chakra-ui/react";
import { PlaysAvailableTable } from "../../pages/Plays/PlaysAvailableTable";

export const PlaysQuickPreview = () => {
  return (
    <Box width="100%" height="72vh" maxH="72vh" overflowY="auto">
      <PlaysAvailableTable previewMode />
    </Box>
  );
};
