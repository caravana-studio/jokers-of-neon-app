import { Box } from "@chakra-ui/react";

export const CashSymbol = () => {
  return <span style={{ fontFamily: "Orbitron", marginLeft: "3px" }}>¢</span>;
};

export const RoundedCashSymbol = () => {
  return (
    <Box display={"inline-flex"}
      style={{
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50px",

        padding: "0",
        border: "2px solid gold",
      }}
      justifyContent={"center"}
      alignItems={"center"}
      transform={"scale(0.65) translateY(-2px)"}
    >
      <span style={{ fontFamily: "Orbitron", padding: "0 8px", marginBottom: "3px" }}>¢</span>
    </Box>
  );
};
