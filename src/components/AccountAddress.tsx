import { Heading } from "@chakra-ui/react";
import { useDojo } from "../dojo/useDojo";
import { useUsername } from "../dojo/utils/useUsername.tsx";

export const AccountAddress = () => {
  const { account } = useDojo();
  const address = account?.address;
  const username = useUsername();
  const userText = username ? username : "No user";
  const addressText = address
    ? `0x...${address?.substring(address.length - 10)}`
    : "No account";

  return (
    <Heading size="s" sx={{ textAlign: "right" }}>
      {`${addressText} - ${userText}`}
    </Heading>
  );
};
