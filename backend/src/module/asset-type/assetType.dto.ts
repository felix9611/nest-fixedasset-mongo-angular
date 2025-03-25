import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from 'src/tool/open-api-body'

export interface AssetTypeCreateDto {
    typeCode: string
    typeName: string
    remark?: string
    depreciationRate?: number
}

export interface AssetTypeUpdateDto extends AssetTypeCreateDto{
    _id?: string
}

export interface AssetTypeListSearchDto {
    name?: string,
    page: number,
    limit: number
}

export interface AssetTypeUploadDto {
    typeCode: string
    typeName: string
    remark?: string
    depreciationRate?: number | string
}

export class ImportAssetTypeBody {

    @ApiProperty({ description: 'Type Code' })
    typeCode: string

    @ApiProperty({ description: 'Type Name' })
    typeName: string

    @ApiProperty({ description: 'Type for catelog' })
    remark: string

    @ApiProperty({ description: 'Item depreciation rate per year,  number or string' })
    depreciationRate: any
}

export class CreateAssetTypeBody {

    @ApiProperty({ description: 'Type Code' })
    typeCode: string

    @ApiProperty({ description: 'Type Name' })
    typeName: string

    @ApiProperty({ description: 'Type for catelog' })
    remark: string

    @ApiProperty({ description: 'Item depreciation rate per year' })
    depreciationRate: number
}

export class UpdateAssetTypeBody extends CreateAssetTypeBody {

    @ApiProperty({ description: 'Data Id' })
    _id: string
}

export class AssetTypeBody extends UpdateAssetTypeBody {

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class AssetTypeQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    name: string
}

export class ListAssetTypeQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: [AssetTypeBody], description: 'Data List' })
    lists: AssetTypeBody[]
}