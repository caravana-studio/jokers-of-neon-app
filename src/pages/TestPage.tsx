import { Divider, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../components/DelayedLoading";
import { MenuBtn } from "../components/Menu/Buttons/MenuBtn";
import { MobileDecoration } from "../components/MobileDecoration";
import { Icons } from "../constants/icons";
import { useResponsiveValues } from "../theme/responsiveSettings";

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
        )}{" "}
        <MenuBtn
          icon={Icons.LIST}
          description={"Season progression"}
          label={"Season progression"}
          onClick={() => navigate("/season")}
          arrowRight
          width={"18px"}
        />
        {isSmallScreen && (
          <Divider borderColor="white" borderWidth="1px" my={2} />
        )}        
        <MenuBtn
          icon={Icons.LIST}
          description={"Shop"}
          label={"Shop"}
          onClick={() => navigate("/shop")}
          arrowRight
          width={"18px"}
        />
        {isSmallScreen && (
          <Divider borderColor="white" borderWidth="1px" my={2} />
        )}
        <MenuBtn
          icon={Icons.LIST}
          description={"Test referral system"}
          label={"Referral Test"}
          onClick={() => navigate("/referral-test")}
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
