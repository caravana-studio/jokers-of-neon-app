import ControllerConnector from "@cartridge/connector/controller";
import { Box } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useTranslation } from "react-i18next";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { BarMenuBtn } from "../components/BarMenu/BarMenuBtn";
import { Icons } from "../constants/icons";

export const ControllerIcon = ({ width }: { width: string }) => {
  const { t } = useTranslation("game");
  const { connector } = useAccount();
  const controllerConnector = connector as never as ControllerConnector;

  return (
    <BarMenuBtn
      icon={Icons.CARTRIDGE}
      description={t("controller")}
      width={width}
      onClick={async () => {
        controllerConnector?.controller.openProfile("achievements");
      }}
    />
  );
};

export const PositionedControllerIcon = () => {
  const { isSmallScreen } = useResponsiveValues();

  return (
    <>
      {isSmallScreen ? (
        <Box
          sx={{
            position: "fixed",
            top: "10px",
            right: "7px",
            zIndex: 1000,
          }}
        >
          <ControllerIcon width="30px" />
        </Box>
      ) : (
        <Box
          sx={{
            position: "fixed",
            top: "25px",
            right: "70px",
            zIndex: 1000,
          }}
        >
          <ControllerIcon width="45px" />
        </Box>
      )}
    </>
  );
};
