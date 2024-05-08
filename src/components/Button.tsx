import { ButtonProps, Button as ChakraButton } from "@chakra-ui/button";

export const Button = (props: ButtonProps) => {
  return (
    <ChakraButton
      sx={{
        borderRadius: 0,
        fontSize: 25,
        paddingY: 7,
        paddingX: 40,
        border: "4px black solid",
        fontFamily: 'Sys'
      }}
      {...props}
    />
  );
};
