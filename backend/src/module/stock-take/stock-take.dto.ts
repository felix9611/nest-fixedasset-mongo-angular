import { IsOptional } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { AssetList } from "../asset-list/asset-list.schame"
import { AssetListBody, AssetListFullBody } from "../asset-list/asset-list.dto"
import { LocationBody } from "../location/location.dto"
import { CommonPageAndList, CommonPageAndListResponse } from "src/tool/open-api-body"

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

export class SubmitStockTakeItemBody {
    @ApiProperty({ description: 'Stock Take Form Data Id' })
    stockTakeId: string

    @ApiProperty({ description: 'Asset Id' })
    assetId: string

    @ApiProperty({ description: 'Asset Code' })
    assetCode: string

    @ApiProperty({ description: 'Location Id' })
    placeId: string

    @ApiProperty({ description: 'Item Status' })
    status: string

    @ApiProperty({ description: 'Remark' })
    @IsOptional()
    remark?: string
}

export class StockTakeItemBody extends SubmitStockTakeItemBody {
    @ApiProperty({ description: 'Data Id' })
    _id: string

    @ApiProperty({ description: 'Check At' })
    checkTime: string
}

export class FullStockTakeItemBody extends StockTakeItemBody {
    @ApiProperty({ description: 'Asset Data', type: AssetListFullBody })
    assetLists: AssetListFullBody

    @ApiProperty({ description: 'Location Data', type: LocationBody })
    place: LocationBody
}

export class CreateStockTakeFormBody {
    @ApiProperty({ description: 'Action Name' })
    actionName: string

    @ApiProperty({ description: 'Action Location Id' })
    actionPlaceId: string

    @ApiProperty({ description: 'Remark' })
    @IsOptional()
    remark: string
}

export class UpdateStockTakeFormBody extends CreateStockTakeFormBody {
    @ApiProperty({ description: 'Data Id' })
    _id: string
}

export class StockTakeBody extends UpdateStockTakeFormBody{
    @ApiProperty({ description: 'Created At' })
    reatedTime: string

    @ApiProperty({ description: 'Finish At' })
    finishTime: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number

    @ApiProperty({ description: 'Created By' })
    createBy: string

    @ApiProperty({ description: 'Finish By' })
    finishBy: string
}

export class StockTakeBodyWithLocation extends StockTakeBody {
    @ApiProperty({ description: 'Location Data', type: LocationBody })
    location: LocationBody
}


export class FullStockTakeBody extends StockTakeBody {
    @ApiProperty({ description: 'Stock Take Items', type: FullStockTakeItemBody, isArray: true })
    stockTakeItems: FullStockTakeItemBody[]
}

export class ListStockTakeBody extends CommonPageAndListResponse {
    @ApiProperty({ description: 'Lists', type: StockTakeBodyWithLocation, isArray: true })
    lists: StockTakeBodyWithLocation[]
}

export class ListRecordReqBody extends CommonPageAndList {
    @ApiProperty({ description: 'Action Name' })
    @IsOptional()
    name: string

    @ApiProperty({ description: 'Action Location Ids', isArray: true })
    @IsOptional()
    placeIds: string[]
}



