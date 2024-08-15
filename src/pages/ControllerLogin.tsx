import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background.tsx";
import { GameMenu } from "../components/GameMenu.tsx";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage.ts";
import { useCustomToast } from "../hooks/useCustomToast.tsx";
import { VIOLET } from "../theme/colors.tsx";
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import { useDojo } from "../dojo/useDojo.tsx";


export const ControllerLogin = () => {
  const {
    account,
} = useDojo();

  const navigate = useNavigate();

  const redirectToGame = () => {
    navigate("/demo");
  };

  const { connect, connectors } = useConnect();


  useEffect(() => {
    connect({connector: connectors[0]})
  }, []);

  useEffect(() => {
    if (account) {
      redirectToGame();
    }
  }, [account]);


  return (
    <Background type="home">
    </Background>
  );
};
