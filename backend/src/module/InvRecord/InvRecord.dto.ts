export interface CreateInvRecordDto {
    assetCode: string
    placeFrom: string
    placeTo: string
}

export interface ListRecordReqDto {
    page: number
    limit: number
    assetCode?: string
    dateRange?: string[]
}