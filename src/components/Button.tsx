import { ButtonProps, Button as ChakraButton } from "@chakra-ui/button";

export const Button = (props: ButtonProps) => {
  const {sx, ...rest} = props
  return (
    <ChakraButton
      sx={{
        borderRadius: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: "#33effa",
        fontSize: 17,
        border: "3px solid #33effa",
        "&:hover": {
          backgroundColor: "black",
          border: "3px solid #33effa",
          boxShadow: "0px 0px 5px 0px #33effa",
        },
        ...sx
      }}
      {...rest}
    />
  );
};
