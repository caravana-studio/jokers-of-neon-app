import { ButtonProps, Button as ChakraButton } from "@chakra-ui/button";

export const Button = (props: ButtonProps) => {
  return (
    <ChakraButton
      sx={{
        borderRadius: 0,
        width: "100%",
        fontSize: 25,
        paddingY: 7,
        border: "4px black solid",
      }}
      {...props}
    />
  );
};
