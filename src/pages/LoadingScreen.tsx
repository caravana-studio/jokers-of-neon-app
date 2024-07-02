import { Box, Heading, Spinner } from "@chakra-ui/react";
import { Background } from "../components/Background";

interface LoadingScreenProps {
  error?: boolean;
}

export const LoadingScreen = ({ error = false }: LoadingScreenProps) => {
  return (
    <Background>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {error ? (
          <Heading size="lg">error loading game</Heading>
        ) : (
          <Spinner size="xl" />
        )}
      </Box>
    </Background>
  );
};
