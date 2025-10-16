import { Divider, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../components/DelayedLoading";
import { MenuBtn } from "../components/Menu/Buttons/MenuBtn";
import { Icons } from "../constants/icons";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { MobileDecoration } from "../components/MobileDecoration";

export const TestPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
  return (
    <DelayedLoading ms={0}>
        <MobileDecoration />
      <Flex m={4} flexDirection={"column"} gap={2} w={"100%"} color={"white"}>
        {isSmallScreen && (
          <Divider borderColor="white" borderWidth="1px" my={2} />
        )}
        <MenuBtn
          icon={Icons.STORE}
          description={"Open external pack"}
          label={"Open external pack"}
          onClick={() => navigate("/external-pack")}
          arrowRight
          width={"18px"}
        />
        {isSmallScreen && (
          <Divider borderColor="white" borderWidth="1px" my={2} />
        )}
        <MenuBtn
          icon={Icons.LIST}
          description={"Vibration"}
          label={"Vibration"}
          onClick={() => navigate("/vibration")}
          arrowRight
          width={"18px"}
        />
        {isSmallScreen && (
          <Divider borderColor="white" borderWidth="1px" my={2} />
        )}
      </Flex>
    </DelayedLoading>
  );
};
