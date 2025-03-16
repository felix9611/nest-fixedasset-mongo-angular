export interface StockTakeItemDto {
    _id?: string
    stockTakeId: string
    assetId: string
    assetCode: string
    placeId: string
    status: string
    checkTime: string
    remark?: string
}

export interface StockTakeFormEdit {
    actionName: string
    actionPlaceId: string
    remark?: string
    stockTakeItems?: StockTakeItemDto[]
    createdTime: string
    finishTime?: string
    _id: string
    createBy: string
}