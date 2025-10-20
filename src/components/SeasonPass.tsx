import CachedImage from "./CachedImage"

interface SeasonPassProps {
    w?: string
    rotate?: string
}

export const SeasonPass = ({ w = "50px", rotate = "0deg" }: SeasonPassProps) => {
    return <CachedImage src="/season-pass.png"  transform={`rotate(${rotate})`} w={w} />
}