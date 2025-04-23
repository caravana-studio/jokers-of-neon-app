import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { BackgroundDecoration } from "../../components/Background";
import { SpineAnimationRef } from "../../components/SpineAnimation";
import { Button, Flex } from "@chakra-ui/react";
import { LootBox } from "../../components/LootBox";
import { OpenLootBoxCardSelection } from "./OpenLootBoxCardSelection";

export const OpenLootBox = () => {
  const { state } = useLocation();
  const { pack } = state || {};
  const [openDisabled, setOpenDisabled] = useState(false);
  const [openTextVisible, setOpenTextVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const spineAnimationRef = useRef<SpineAnimationRef>(null);

  const { t } = useTranslation(["store"]);

  if (!pack) {
    return <p>LootBox not found.</p>;
  }

  const openButton = (
    <Button
      onClick={() => {
        setOpenDisabled(true);
        spineAnimationRef.current?.playOpenBoxAnimation();
      }}
      isDisabled={openDisabled}
      variant="ghost"
      fontSize={{ base: 10, sm: "unset" }}
      lineHeight={{ base: 1.6, sm: "unset" }}
      visibility={openTextVisible ? "visible" : "hidden"}
    >
      Click to open
    </Button>
  );

  const openAnimationCallBack = () => {
    setTimeout(() => {
      setCardsVisible(true);
    }, 1000);
  };

  setTimeout(() => {
    setOpenTextVisible(true);
  }, 2000);

  return (
    <>
      {cardsVisible ? (
        <OpenLootBoxCardSelection />
      ) : (
        <Flex
          flexDirection={"column"}
          width={"100%"}
          height={"100%"}
          backgroundColor={"rgba(0,0,0,0.6)"}
        >
          <BackgroundDecoration contentHeight={"80%"}>
            <Flex
              flexDirection={"column"}
              gap={4}
              justifyContent={"center"}
              alignItems={"center"}
              p={4}
              height={"100%"}
              width={"100%"}
            >
              <Flex height={"90%"} width={"100%"}>
                <LootBox
                  ref={spineAnimationRef}
                  pack={pack}
                  onOpenAnimationStart={openAnimationCallBack}
                ></LootBox>
              </Flex>
              <Flex>{!openDisabled && openButton}</Flex>
            </Flex>
          </BackgroundDecoration>
        </Flex>
      )}
    </>
  );
};
