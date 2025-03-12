export interface CreateWriteOffRecrod {
    assetId: string
    lastPlaceId: string
    reason: string
    lastDay?: any
    disposalMethod?: string
    remainingValue?: number
}

export interface ListWriteOffReqDto {
    page: number
    limit: number
    placeId?: string
    dateRange?: string[]
}