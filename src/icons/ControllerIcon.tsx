import { Box } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useTranslation } from "react-i18next";
import { connectControllerCommand } from "../commands/connectController";
import { MenuBtn } from "../components/Menu/Buttons/MenuBtn";
import { Icons } from "../constants/icons";
import { useDojo } from "../dojo/useDojo";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const ControllerIcon = ({
  width,
  label,
}: {
  width: string;
  label?: boolean;
}) => {
  const { t } = useTranslation("game");
  const { connector } = useAccount();

  const { setup } = useDojo();

  if (setup.useBurnerAcc) return null;

  return (
    <MenuBtn
      icon={Icons.CARTRIDGE}
      description={t("controller")}
      label={label ? "Controller" : undefined}
      width={width}
      onClick={() => connectControllerCommand(connector)}
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
