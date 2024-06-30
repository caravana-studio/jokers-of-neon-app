import { Box, useTheme } from "@chakra-ui/react";

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
  const { colors } = useTheme();
  const color = position === "RIGHT" ? colors.opaqueNeonGreen : colors.neonPink;
  return (
    <Box
      height={{ base: 150, md: 300 }}
      width={{ base: 150, md: 300 }}
      mr={position === "RIGHT" ? { base: -30, md: -130 } : 0}
      ml={position === "LEFT" ? { base: -30, md: -130 } : 0}
      pr={position === "RIGHT" ? { base: 20, md: 120 } : 0}
      pl={position === "LEFT" ? { base: 20, md: 120 } : 0}
      sx={{
        display: "flex",
        justifyContent: "center",
        textAlign: position === "LEFT" ? "left" : "right",
        alignItems: "center",
        borderRadius: 2000,
        opacity: disabled ? 0.7 : 1,
        backgroundColor: "transparent",
        border: `5px solid ${color}`,
        color: color,
        boxShadow: `0px 0px 10px 0px ${color}`,
        cursor: disabled ? "not-allowed" : "pointer",
        textShadow: `0 0 5px ${color}`,
        "&:hover": {
          border: `5px solid ${color}`,
          boxShadow: `0px 0px 30px 0px ${color}`,
          backgroundColor: "transparent",
        },
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
        <Box sx={{ mt: 2, color: "white" }}>{secondLabel}</Box>
      </Box>
    </Box>
  );
};
