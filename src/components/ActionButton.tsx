import { Box } from "@chakra-ui/react";

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
          ml: -130,
          pl: 120,
          textAlign: 'left'
        }
      : {
          mr: -130,
          pr: 120,
          textAlign: 'right'
        };
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2000,
        height: 300,
        width: 300,
        fontSize: 35,
        opacity: disabled ? 0.7 : 1,
        backgroundColor: "black",
        border: "5px solid #fd4bad",
        color: "#fd4bad",
        filter: "blur(0.5px)",
        boxShadow: "0px 0px 10px 0px rgba(253,75,173,1)",
        cursor: disabled ? 'not-allowed' : 'pointer',
        "&:hover": {
          border: "5px solid #fd4bad",
          boxShadow: "0px 0px 30px 0px rgba(253,75,173,1)",
          backgroundColor: "black",
        },
        ...extraSx,
      }}
      onClick={(e) => {
        e.stopPropagation();
        !disabled && onClick();
      }}
    >
      <Box>
        <Box>
          {label.map((str: string) => {
            return (
              <span key={str}>
                {str}
                <br />
              </span>
            );
          })}
        </Box>
        <Box sx={{ fontSize: 20, mt: 2 }}>{secondLabel}</Box>
      </Box>
    </Box>
  );
};
