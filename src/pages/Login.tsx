import { Box, Heading, Input, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PoweredBy } from "../components/PoweredBy";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { useDojo } from "../dojo/useDojo";
import { noisyTv } from "../scripts/noisyTv";

const regExpression = /^[a-zA-Z0-9._-]+$/;

export const Login = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [username, setUsername] = useState("");
  const [creatingGame, setCreatingGame] = useState(false);
  const toast = useToast();

  const {
    setup: {
      systemCalls: { createGame },
    },
    account,
  } = useDojo();

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

  const showErrorToast = (message: string): void => {
    toast({
      title: "Validation error",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const validateAndCreateUser = () => {
    setCreatingGame(true);
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
      showErrorToast("Username must contain only letters, numbers, . , - , _");
      return;
    }
    localStorage.setItem(LOGGED_USER, username);
    createGame(account.account, username).then((newGameId) => {
      if (newGameId) {
        localStorage.setItem(GAME_ID, newGameId.toString());
        console.log(`game ${newGameId} created`);
        setTimeout(() => {
          redirectToGame();
        }, 3000);
      } else {
        setCreatingGame(false);
        showErrorToast("Error creating game");
      }
    });
  };

  const onKeyDown = (event: { key: string }) => {
    if (event.key === "Enter" || event.key === " ") {
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

      {creatingGame ? (
        <Heading variant="neonGreen" size="l">
          creating game...
        </Heading>
      ) : (
        <div className="menu">
          <header>Introduce username</header>
          <Box mb={7} px={5}>
            <Input
              isInvalid
              id="usernameInputField"
              type="text"
              placeholder="Username"
              color={"gray"}
              ref={inputRef}
              maxLength={15}
              sx={{ px: 5 }}
              onChange={(e) => {
                setUsername(e.target.value);
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
      )}

      <PoweredBy />
    </>
  );
};
