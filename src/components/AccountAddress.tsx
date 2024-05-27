import { Heading } from "@chakra-ui/react";
import { useDojo } from "../dojo/useDojo";
import { LOGGED_USER } from '../constants/localStorage.ts'

export const AccountAddress = () => {
  const { account } = useDojo();
  const username = localStorage.getItem(LOGGED_USER);
  const address = account?.account?.address;

  const userText = username ? username : "No user";
  const addressText = address
    ? `0x...${address?.substring(address.length - 10)}`
    : "No account"

  return (
    <Heading sx={{textAlign: 'right'}}>
      {`${addressText} - ${userText}`}
    </Heading>
  );
};
