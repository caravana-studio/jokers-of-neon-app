import { Heading } from "@chakra-ui/react";
import { useDojo } from "../dojo/useDojo";

export const AccountAddress = () => {
  const { account } = useDojo();
  const address = account?.account?.address;
  return (
    <Heading
      sx={{
        position: "fixed",
        right: 10,
      }}
    >
      {address
        ? `0x...${address?.substring(address.length - 10)}`
        : "No account"}
    </Heading>
  );
};
