import { Text } from "@chakra-ui/react"
import { APP_VERSION } from "../../constants/version"
import { isMobile } from "react-device-detect"

export const Version = () => {
    return <Text letterSpacing={0.5} fontSize={isMobile ? 9 : 14}>v {APP_VERSION}</Text>
}