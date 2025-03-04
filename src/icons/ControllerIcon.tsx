import ControllerConnector from "@cartridge/connector/controller";
import { Box, Icon, IconProps, Tooltip } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useTranslation } from "react-i18next";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const ControllerIcon = ({ props }: { props?: IconProps }) => {
  const { isSmallScreen } = useResponsiveValues();

  const { t } = useTranslation("game");
  const { connector } = useAccount();
  const controllerConnector = connector as never as ControllerConnector;
  return (
    <Tooltip label={t("controller")}>
      <Icon
        onClick={async () => {
          controllerConnector?.controller.openProfile("achievements");
        }}
        cursor="pointer"
        boxSize={isSmallScreen ? "30px" :"45px"}
        {...props}
      >
        <svg
          viewBox="0 0 24 24"
          filter="drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.25))"
        >
          <g fill="white">
            <path d="M11.0872 4.66217H12.9127V6.76329H11.0872V4.66217Z" />
            <path d="M8.43245 17.5415H5.02796C4.80357 17.5415 4.80357 17.3159 4.80357 17.3159V8.78316C4.80357 8.78316 4.80357 8.55966 5.02796 8.55966H11.0872L11.0872 6.76329H8.85949C8.85949 6.76329 8.4086 6.76329 7.95771 6.9868L3.67529 8.78316C3.2244 9.00666 3 9.45784 3 9.90484V17.0903C3 17.3159 3 17.5394 3.2244 17.765L4.57707 19.1123C4.80147 19.3378 4.97134 19.3378 5.25236 19.3378H8.43296C8.43317 18.7919 8.43342 18.1468 8.43364 17.5539H15.4865V19.3378H18.7476C19.0287 19.3378 19.1985 19.3378 19.4229 19.1123L20.7756 17.765C21 17.5415 21 17.3159 21 17.0903V9.90484C21 9.45575 20.7756 9.00666 20.3247 8.78316L16.0423 6.9868C15.5914 6.76329 15.1405 6.76329 15.1405 6.76329H12.9127L12.9127 8.55966H18.9741C19.1985 8.55966 19.1985 8.78316 19.1985 8.78316V17.3159C19.1985 17.3159 19.1985 17.5415 18.9741 17.5415H15.4933V15.7703H8.43421C8.43421 15.9422 8.43263 17.3912 8.43245 17.5415Z" />
            <path d="M8.43243 13.0134H15.4933V11.2297H8.43421C8.43421 11.412 8.43243 13.0302 8.43243 13.0134Z" />
          </g>
        </svg>
      </Icon>
    </Tooltip>
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
          <ControllerIcon />
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
          <ControllerIcon />
        </Box>
      )}
    </>
  );
};
