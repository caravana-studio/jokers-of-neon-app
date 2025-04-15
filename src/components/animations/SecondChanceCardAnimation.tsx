import { Flex } from "@chakra-ui/react";
import SpineAnimation from "../SpineAnimation";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { SpecialCardAnimation } from "./SpecialCardAnimation";

export const SecondChanceCardAnimation = () => {
  const { isSmallScreen } = useResponsiveValues();

  const phoenixSpine = (
    <Flex h={"100%"} w={"100%"} justifyContent={"center"} pl={2}>
      <SpineAnimation
        jsonUrl={`/spine-animations/phoenix/phoenix.json`}
        atlasUrl={`/spine-animations/phoenix/phoenix.atlas`}
        initialAnimation={"animation"}
        loopAnimation={"animation"}
        scale={isSmallScreen ? 0.5 : 0.8}
        yOffset={-800}
      />
    </Flex>
  );

  return <SpecialCardAnimation animation={phoenixSpine} />;
};
