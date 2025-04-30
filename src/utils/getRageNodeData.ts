export const getRageNodeData = (data: number) => {
    return {
        round: Math.round(data / Math.pow(2,32)),
        power: Math.round(data % Math.pow(2,32))
    }
}