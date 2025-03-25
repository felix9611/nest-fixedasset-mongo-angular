import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from 'src/tool/open-api-body'

export interface CreateLocationDto {
    placeCode: string
    placeName: string,
    remark?: string
}

export interface UpdateLocationDto extends CreateLocationDto {
    _id?: string
}

export interface ListLocationRequestDto {
    page: number
    limit: number
    name?: string
}

export class CreateLocationBody {

    @ApiProperty({ description: 'Locaation Code' })
    placeCode: string

    @ApiProperty({ description: 'Locaation Name' })
    placeName: string

    @ApiProperty({ description: 'Remark' })
    remark: string
}

export class UpdateLocationBody extends CreateLocationBody {

    @ApiProperty({ description: 'Data Id' })
    _id: string
}

export class LocationBody extends UpdateLocationBody {

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class ListLocationQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    name: string
}

export class ListLocationQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: [LocationBody], description: 'Data List' })
    lists: LocationBody[]
}