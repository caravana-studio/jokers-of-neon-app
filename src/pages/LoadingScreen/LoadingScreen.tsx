import { useState } from "react";
import "../../App.scss";
import OpeningScreenAnimation from "./OpeningScreenAnimation";
import { Flex } from "@chakra-ui/react";

interface LoadingScreenProps {
  error?: boolean;
  skipPresentation?: boolean;
}

export const LoadingScreen = ({
  error = false,
  skipPresentation = true,
}: LoadingScreenProps) => {
  const [visibleSpinner, setVisibleSpinner] = useState(false);

  return (
    <div
      style={{
        height: "100%",
        position: "fixed",
        bottom: 0,
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Orbitron",
        fontSize: 30,
        letterSpacing: "0.25em",
        background: `url(bg/home-bg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        flexWrap: "wrap",
      }}
    >
      {error ? (
        <div>error loading game</div>
      ) : (
        <Flex
          width={"100%"}
          flexDirection={"column"}
          gap={4}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {!skipPresentation && (
            <OpeningScreenAnimation
              onAnimationEnd={function (): void {
                setVisibleSpinner(true);
              }}
            />
          )}

          {(visibleSpinner || skipPresentation) && (
            <img src="loader.gif" alt="loader" width="100px" />
          )}
        </Flex>
      )}
    </div>
  );
};
