import { Flex } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { MapProvider } from "../providers/MapProvider";
import { StoreProvider } from "../providers/StoreProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { needsPadding } from "../utils/capacitorUtils";
import { ConfirmationModal } from "./ConfirmationModal";
import { SidebarMenu } from "./Menu/BarMenu/SidebarMenu";
import { BottomMenu } from "./Menu/BottomMenu";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { isSmallScreen } = useResponsiveValues();
  const [confirmLeaveGameOpen, setConfirmLeaveGameOpen] = useState(false);
  const { t } = useTranslation("game", { keyPrefix: "confirm-modal" });
  const navigate = useNavigate();

  return (
    <ReactFlowProvider>
      <MapProvider>
        <StoreProvider>
          <Flex
            width={"100%"}
            height={"100%"}
            pt={needsPadding ? "50px" : "0px"}
            pb={needsPadding ? "80px" : isSmallScreen ? "50px" : "0px"}
            flexDirection={isSmallScreen ? "column" : "row"}
            flexGrow={1}
            minH={0}
          >
            {!isSmallScreen && <SidebarMenu onLeaveGameClick={() => setConfirmLeaveGameOpen(true)} />}
            <Flex
              zIndex={2}
              flexGrow={1}
              flexShrink={1}
              minH={0}
              minW={0}
              height={"100%"}
              width={"100%"}
            >
              {children}
            </Flex>
          </Flex>
          {isSmallScreen && (
            <BottomMenu
              onLeaveGameClick={() => setConfirmLeaveGameOpen(true)}
            />
          )}
          {confirmLeaveGameOpen && (
            <ConfirmationModal
              close={() => setConfirmLeaveGameOpen(false)}
              title={t("title")}
              description={t("description")}
              onConfirm={() => {
                navigate("/");
                setConfirmLeaveGameOpen(false);
              }}
            />
          )}
        </StoreProvider>
      </MapProvider>
    </ReactFlowProvider>
  );
};
