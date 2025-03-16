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

export interface StockTakeItemDtoSubmit {
    stockTakeId: string
    assetId: string
    assetCode: string
    placeId: string
    status: string
    remark?: string
}

export interface StockTakeForm {
    actionName: string
    actionPlaceId: string
    remark?: string
}

export interface UpdateStockTakeForm extends StockTakeForm {
    stockTakeItems?: StockTakeItemDto[]
    createdTime: string
    finishTime?: string
    _id: string
}

export interface ListStockTakeDto {
    page: number
    limit: number
    placeIds?: string[]
    name?: string
}