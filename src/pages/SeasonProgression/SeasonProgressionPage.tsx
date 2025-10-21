import { DelayedLoading } from "../../components/DelayedLoading"
import { MobileDecoration } from "../../components/MobileDecoration"
import { SeasonProgressionContent } from "./SeasonProgressionContent"
import { SeasonProgressionHeader } from "./SeasonProgressionHeader"

export const SeasonProgressionPage = () => {
    return <DelayedLoading ms={200}>
        <MobileDecoration fadeToBlack />
        <SeasonProgressionHeader />
        <SeasonProgressionContent />
    </DelayedLoading>
}