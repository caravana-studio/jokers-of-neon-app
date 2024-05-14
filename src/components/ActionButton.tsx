import { Box, Button } from "@chakra-ui/react";

interface IActionButtonProps {
  position: "LEFT" | "RIGHT";
  label: string[];
  secondLabel: string;
  disabled: boolean;
  onClick: () => void;
}
export const ActionButton = ({
  position,
  label,
  disabled,
  onClick,
  secondLabel,
}: IActionButtonProps) => {
  const extraSx =
    position === "LEFT"
      ? {
          ml: -180,
          pl: 150,
        }
      : {
          mr: -180,
          pr: 150,
        };
  return (
    <Button
      sx={{
        borderRadius: 2000,
        height: 300,
        width: 300,
        fontSize: 35,
        backgroundColor: "black",
        border: "5px solid #fd4bad",
        color: "#fd4bad",
        filter: "blur(0.5px)",
        boxShadow: "0px 0px 10px 0px rgba(253,75,173,1)",
        "&:hover": {
          border: "5px solid #fd4bad",
          boxShadow: "0px 0px 30px 0px rgba(253,75,173,1)",
          backgroundColor: "black",
        },
        "&:disabled": {
          backgroundColor: "black",
        },
        ...extraSx,
      }}
      isDisabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Box>
        <Box>
          {label.map((str: string) => {
            return (
              <>
                {str}
                <br />
              </>
            );
          })}
        </Box>
        <Box sx={{ fontSize: 20, mt: 2 }}>{secondLabel}</Box>
      </Box>
    </Button>
  );
};
