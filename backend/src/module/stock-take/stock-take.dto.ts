export interface StockTakeItem {
    _id?: string
    stockTakeId: string
    assetId: string
    assetCode: string
    placeId: string
    status: string
    checkTime: string
    remark?: string
}

export interface StockTakeForm {
    actionName: string
    actionPlaceId: string
    remark?: string
    createdTime: string
    finishTime?: string
    stockTakeItems?: StockTakeItem[]
}