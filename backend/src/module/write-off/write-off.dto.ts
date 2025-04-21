import { IsOptional } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from 'src/tool/open-api-body'
import { AssetListBody } from '../asset-list/asset-list.dto'
import { LocationBody } from '../location/location.dto'

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
    placeIds?: string
    deptIds?: string[]
    typeIds?: string[]
    dateRange?: string[]
}

export class CreateListWriteOffRecordBody {
    @ApiProperty({ description: 'Asset Id' })
    assetId: string

    @ApiProperty({ description: 'Location Id' })
    lastPlaceId: string

    @ApiProperty({ description: 'Write off reason' })
    reason: string

    @ApiProperty({ description: 'Write off date' })
    lastDay: any

    @ApiProperty({ description: 'Disposal Method' })
    disposalMethod: string

    @ApiProperty({ description: 'Remaining Value' })
    remainingValue: number
}

export class WriteOffRecordBody extends CreateListWriteOffRecordBody {
    @ApiProperty({ description: 'Data Id' })
    _id: string

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class WriteOffRecordFullBody extends WriteOffRecordBody {
    @ApiProperty({ description: 'Asset Data', type: AssetListBody })
    assetlIST: AssetListBody
    
    @ApiProperty({ description: 'Location Data', type: LocationBody })
    location: LocationBody
}

export class ListWriteOffReqBody extends CommonPageAndList {
    @ApiProperty({ description: 'Location Ids', isArray: true })
    @IsOptional()
    placeIds: string[]

    @ApiProperty({ description: 'Department Ids', isArray: true })
    @IsOptional()
    deptIds: string[]

    @ApiProperty({ description: 'Asset Type Ids', isArray: true })
    @IsOptional()
    typeIds: string[]

    @ApiProperty({ description: 'Date Range', isArray: true })
    @IsOptional()
    dateRange: string[]
}

export class WriteOffQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: WriteOffRecordFullBody, isArray: true, description: 'Data List' })
    lists: WriteOffRecordFullBody[]
}
    