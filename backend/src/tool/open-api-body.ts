import { ApiProperty } from "@nestjs/swagger";

export class ReturnMsg {
    @ApiProperty({ description: 'Message' })
    msg: string
}

export class CommonPageAndList {
    @ApiProperty({ description: 'Page Number' })
    page: number

    @ApiProperty({ description: 'Page limit datas limit' })
    limit: number
}

export class CommonPageAndListResponse {
    @ApiProperty({ description: 'Page Number' })
    page: number

    @ApiProperty({ description: 'Page limit datas limit' })
    limit: number

    @ApiProperty({ description: 'Count of all data' })
    total: number

    @ApiProperty({ description: 'Total pages number' })
    totalPages: number
}