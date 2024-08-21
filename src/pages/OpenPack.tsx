import { Flex } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Background } from "../components/Background";
import { TiltCard } from "../components/TiltCard";
import { useGame } from "../dojo/queries/useGame";
import { C2, C3 } from "../utils/mocks/cardMocks";

const cards = [
  C2, C3
]

export const OpenPack = () => {
  const navigate = useNavigate();

  const { page } = useParams();

  return (
    <Background type="store">
      <Flex height="100%" width="100%" flexDirection="column" alignItems="center" justifyContent="center">
        <Flex gap={4}>
          {cards.map((card, index) => {
            return (
              <TiltCard card={card} key={index} />
            );
          })}
        </Flex>
      </Flex>
    </Background>
  );
};
