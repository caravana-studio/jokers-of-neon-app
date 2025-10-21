import { Flex } from "@chakra-ui/react"
import { Version } from "./Version"

export const PositionedVersion = () => {
    return <Flex  zIndex={100} position="absolute" transform={"rotate(-90deg)"} bottom="75px" right="-5px">
        <Version />
    </Flex>
}