import { Box, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PoweredBy } from "../components/PoweredBy";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { useCustomToast } from "../hooks/useCustomToast";
import { noisyTv } from "../scripts/noisyTv";

const regExpression = /^[a-zA-Z0-9._-]+$/;

export const Login = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [username, setUsername] = useState("");
  const { showErrorToast } = useCustomToast();

  const redirectToGame = () => {
    navigate("/demo");
  };

  useEffect(() => {
    // if user is logged in, redirect to game
    const user = localStorage.getItem(LOGGED_USER);
    if (user) {
      redirectToGame();
    }
  }, []);

  const validateAndCreateUser = () => {
    if (!username) {
      showErrorToast("Please enter username");
      return;
    }
    if (username.length < 3) {
      showErrorToast("Username must be at least 3 characters");
      return;
    }
    if (username.length > 15) {
      showErrorToast("Username must be at most 15 characters");
      return;
    }
    // check for characters uppercase and lowercase letters, numbers,. ,- ,_
    // any other character is not allowed
    if (!regExpression.test(username)) {
      showErrorToast(
        "Username must contain only letters, numbers, points or dashes"
      );
      return;
    }
    localStorage.removeItem(GAME_ID);
    localStorage.setItem(LOGGED_USER, username);
    redirectToGame();
  };

  const onKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      validateAndCreateUser();
    } else if (event.key === "Escape") {
      navigate("/");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, false);

    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
    };
  }, [onKeyDown]);

  useEffect(() => {
    noisyTv(1000);
  }, []);

  useEffect(() => {
    document.getElementById("usernameInputField")?.focus();
  }, []);

  return (
    <>
      <div className="text av1">
        <span>AV-1</span>
        <span>AV-1</span>
        <span>AV-1</span>
        <span>AV-1</span>
        <span>AV-1</span>
      </div>

      <div className="menu">
        <header>Introduce username</header>
        <Box mb={7} px={5}>
          <Input
            isInvalid
            id="usernameInputField"
            type="text"
            placeholder="Username"
            ref={inputRef}
            maxLength={15}
            sx={{ backgroundColor: "white", border: "3px solid black" }}
            onChange={(e) => {
              setUsername(e.target.value.trim());
            }}
          />
        </Box>
        <footer>
          <div className="key">
            Exit: <span>ESC</span>
          </div>
          <div className="key">
            Continue: <span>ENTER</span>
          </div>
        </footer>
      </div>

      <PoweredBy />
    </>
  );
};
