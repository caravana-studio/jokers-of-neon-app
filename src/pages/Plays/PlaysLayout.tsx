import {
  Box,
  Flex,
  Heading,
  Img
} from "@chakra-ui/react";
import { PlaysAvailableTable } from "./PlaysAvailableTable";
import { useNavigate } from "react-router-dom";
import { Background } from "../../components/Background";
import { Image, Text, Button } from "@chakra-ui/react";

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
      <Flex 
        py={2} 
        px={8} 
        flexDirection={"column"} 
        justifyContent={"center"} 
        width={"50%"} 
        margin={"0 auto"} 
        height={"100vh"}
        >
          <Heading mt={2} size="md" variant="italic" color="white" textAlign={"center"} mb={8}>
            AVAILABLE PLAYS
          </Heading>

          <PlaysAvailableTable />
          <Button
            className="game-tutorial-step-4"
            mt={10}
            mb={2}
            w="100%"
            size="sm"
            variant="solid"
            onClick={ () => navigate("/demo")}
          >Go back to game</Button>
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
              top: 6,
              left: 12,
            }}
          >
            <Img src="logos/logo-variant.png" width={{base: '120px', md: '330px'}} alt="logo" />
          </Box>
          <Box
            sx={{
              position: "fixed",
              top: 6,
              right: 12,
            }}
          >
            <Img src="logos/joker-logo.png" width={{base: '80pxpx', md: '120px'}} alt="logo" />
          </Box>  
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
