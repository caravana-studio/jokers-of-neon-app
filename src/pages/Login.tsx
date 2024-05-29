import { Box, Input, useToast } from "@chakra-ui/react"
import { useEffect, useState, useRef } from "react";
import { noisyTv } from "../scripts/noisyTv";
import { useNavigate } from 'react-router-dom'
import { LOGGED_USER } from "../constants/localStorage";

const regExpression = /^[a-zA-Z0-9._-]+$/;

export const Login = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [username, setUsername] = useState("");
  const toast = useToast()

  const redirectToGame = () => {
    navigate('/demo');
  }

  useEffect(() => {
    // if user is logged in, redirect to game
    const user = localStorage.getItem(LOGGED_USER);
    if(user) {
      redirectToGame();
    }
  }, []);

  const showErrorToast = (message: string): void => {
    toast({
      title: 'Validation error',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true
    })
  }

  const validateAndCreateUser = () => {
    if(!username) {
      showErrorToast('Please enter username');
      return;
    }
    if(username.length < 3) {
      showErrorToast('Username must be at least 3 characters');
      return;
    }
    if(username.length > 15) {
      showErrorToast('Username must be at most 15 characters');
      return;
    }
    // check for characters uppercase and lowercase letters, numbers,. ,- ,_
    // any other character is not allowed
    if(!regExpression.test(username)) {
      showErrorToast('Username must contain only letters, numbers, . , - , _');
      return;
    }
    localStorage.setItem(LOGGED_USER, username);
    redirectToGame();
  }

  const onKeyDown = (event: { key: string }) => {
    if (event.key === "Enter" || event.key === " ") {
      validateAndCreateUser()
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
      {
        <div className="menu">
          <header>Introduce username</header>
          <Box mb={'10px'} px={'15px'}>
            <Input
              isInvalid
              id="usernameInputField"
              type="text"
              placeholder="Username"
              _placeholder={{ p: 3}}
              color={'gray'}
              ref={inputRef}
              maxLength={15}
              onChange={(e) => {
                setUsername(e.target.value)
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
      }
      <Box
        sx={{
          position: "fixed",
          bottom: 10,
          zIndex: 1000,
          color: "white",
          fontFamily: "Sys",
          fontSize: 17,
          filter: "blur(1px)",
          opacity: 0.7,
        }}
      >
        powered by Dojo and Starknet
      </Box>
    </>
  );
};
