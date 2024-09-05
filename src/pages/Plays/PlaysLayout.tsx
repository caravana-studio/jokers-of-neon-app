import {
  Box,
  Flex,
  Heading
} from "@chakra-ui/react";
import { PlaysTable } from "./PlaysTable";
import { useNavigate } from "react-router-dom";
import { Background } from "../../components/Background";

export const PlaysLayout = () => {
  const navigate = useNavigate();

  return (
    <Background type="game" dark>
      <Flex py={4} px={8} flexDirection={"column"} justifyContent={"center"} width={"50%"} margin={"0 auto"} height={"100vh"}>
        <Heading size="l" color="aqua" textAlign={"center"}>
          AVAILABLE PLAYS
        </Heading>

        <PlaysTable />
      </Flex>
    </Background>
  );
};
