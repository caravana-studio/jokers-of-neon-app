import { Button, Flex, useBreakpointValue } from "@chakra-ui/react";
import { Background } from "../../components/Background";
import { ManagePageContent } from "./ManagePageContent";
import { ManagePageContentMobile } from "./ManagePageContent.mobile";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const ManagePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "power-ups",
  });

  const isSmallMobile = useBreakpointValue({
    base: true,
    sm: false,
  });

  const goBackBtn = (
    <Button
      fontSize={12}
      onClick={() => {
        navigate(-1);
      }}
      width={"unset"}
    >
      {t("go-back")}
    </Button>
  );

  return (
    <Background bgDecoration={!isSmallMobile} dark type="home">
      <Flex
        flexDirection={"column"}
        height={"100%"}
        gap={4}
        alignItems={"center"}
      >
        {isSmallMobile ? (
          <ManagePageContentMobile goBackBtn={goBackBtn} />
        ) : (
          <ManagePageContent goBackBtn={goBackBtn} />
        )}
      </Flex>
    </Background>
  );
};
