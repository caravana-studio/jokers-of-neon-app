import { Flex, Heading } from "@chakra-ui/react";
import { MenuBtn } from "../../../../components/Menu/Buttons/MenuBtn";
import { Icons } from "../../../../constants/icons";
import { useNavigate } from "react-router-dom";
import { useCurrentPageInfo } from "../../../../hooks/useCurrentPageInfo";

export const MenuSection = () => {
  const page = useCurrentPageInfo();
  const navigate = useNavigate();

  return (
    <>
      <Flex justifyContent="space-between" alignContent={"center"}>
        <Flex
          py={1}
          justifyContent={"center"}
          alignContent={"center"}
          alignItems={"center"}
          onClick={() => page?.url && navigate(page.url)}
          cursor={"pointer"}
          flex={1}
          gap={2}
        >
          <MenuBtn
            icon={page?.icon ?? Icons.CIRCLE}
            description={""}
            width={"12px"}
          />
          <Heading
            variant="italic"
            as="div"
            size={"xs"}
            textTransform={"uppercase"}
            flex={1}
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            {page?.name ?? ""}
          </Heading>
        </Flex>
      </Flex>
    </>
  );
};
