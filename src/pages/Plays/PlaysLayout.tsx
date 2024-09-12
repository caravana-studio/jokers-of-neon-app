import {
  Flex,
  Heading
} from "@chakra-ui/react";
import { PlaysAvailableTable } from "./PlaysAvailableTable";
import { useNavigate } from "react-router-dom";
import { Background } from "../../components/Background";
import { Button } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";

export const PlaysLayout = () => {
  const navigate = useNavigate();

  return (
    <Background type="game" dark bgDecoration>
      <Flex 
        py={2} 
        px={8} 
        flexDirection={"column"} 
        justifyContent={"center"} 
        width={isMobile ? "100%" : {sm: "75%", md: "50%"}} 
        margin={"0 auto"} 
        height={"100vh"}
        >
          <Heading mt={{base: 10, md: 20}} size={{base: "sm", sm: "md"}} variant="italic" color="white" textAlign={"center"} mb={8}>
            AVAILABLE PLAYS
          </Heading>

          <PlaysAvailableTable />
          <Button
            className="game-tutorial-step-4"
            mt={8}
            mb={4}
            w="100%"
            size="md"
            variant="solid"
            onClick={ () => navigate("/demo")}
          >Go back to game</Button>
      </Flex>
    </Background>
  );
};
