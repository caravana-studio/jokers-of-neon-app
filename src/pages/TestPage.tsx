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
  const packButtons = [
    { id: 1, label: "Open Basic pack" },
    { id: 2, label: "Open Advanced pack" },
    { id: 3, label: "Open Epic pack" },
    { id: 4, label: "Open Legendary pack" },
    { id: 5, label: "Open Collector pack" },
    { id: 6, label: "Open Collector XL pack" },
  ];

  return (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex m={4} flexDirection={"column"} gap={2} w={"100%"} color={"white"}>
        {isSmallScreen && (
          <Divider borderColor="white" borderWidth="1px" my={2} />
        )}
        {packButtons.map((pack) => (
          <MenuBtn
            key={pack.id}
            icon={Icons.STORE}
            description={pack.label}
            label={pack.label}
            onClick={() => navigate(`/test/external-pack/${pack.id}`)}
            arrowRight
            width={"18px"}
          />
        ))}
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
