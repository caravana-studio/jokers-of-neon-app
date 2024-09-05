import {
  Box,
  Flex,
  Heading
} from "@chakra-ui/react";
import { PlaysTable } from "./PlaysTable";
import { useNavigate } from "react-router-dom";
import { Background } from "../../components/Background";
import { Image, Text } from "@chakra-ui/react";

export const PlaysLayout = () => {
  const navigate = useNavigate();

  return (
    <Background type="game" dark>
      <Image
            src="/borders/top.png"
            height="8%"
            width="100%"
            maxHeight="70px"
            position="fixed"
            top={0}
          />
      <Flex py={4} px={8} flexDirection={"column"} justifyContent={"center"} width={"50%"} margin={"0 auto"} height={"100vh"}>
        <Heading size="l" color="aqua" textAlign={"center"}>
          AVAILABLE PLAYS
        </Heading>

        <PlaysTable />
      </Flex>
      <Image
            src="/borders/bottom.png"
            maxHeight="70px"
            height="8%"
            width="100%"
            position="fixed"
            bottom={0}
            sx={{ pointerEvents: "none" }}
          />
        <Box
            sx={{
              position: "fixed",
              bottom: 16,
              left: 12,
            }}
          >
            <Text size="m">BUIDL YOUR DECK</Text>
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: 16,
              right: 12,
            }}
          >
            <Text size="m">RULE THE GAME</Text>
          </Box>
    </Background>
  );
};
