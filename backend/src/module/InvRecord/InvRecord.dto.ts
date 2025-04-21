import { ApiProperty } from "@nestjs/swagger"
import { AssetListBody } from "../asset-list/asset-list.dto"
import { LocationBody } from "../location/location.dto"
import { CommonPageAndList, CommonPageAndListResponse } from "src/tool/open-api-body"
import { IsOptional } from "@nestjs/class-validator"

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

export class InvRecordBody {
    @ApiProperty({ description: 'Data Id' })
    _id: string

    @ApiProperty({ description: 'Asset Code' })
    assetCode: string

    @ApiProperty({ description: 'Place From Id' })
    placeFrom: string    

    @ApiProperty({ description: 'Place To Id' })
    placeTo: string

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Asset List Data', type: AssetListBody })
    assetList: AssetListBody

    @ApiProperty({ description: 'Place From Date', type: LocationBody })
    placeFromData: LocationBody   

    @ApiProperty({ description: 'Place To Date', type: LocationBody })
    placeToData: LocationBody  
}

export class ListRecordReqBody extends CommonPageAndList {
    @ApiProperty({ description: 'Asset Code' })
    @IsOptional()
    assetCode: string

    @ApiProperty({ description: 'Date Range', isArray: true })
    @IsOptional()
    dateRange: string[]
}

export class ListInvRecordResponse extends CommonPageAndListResponse {
    @ApiProperty({ description: 'Data List', type: InvRecordBody, isArray: true })
    data: InvRecordBody[]
}