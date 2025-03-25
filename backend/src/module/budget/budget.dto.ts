import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from 'src/tool/open-api-body'

export interface CreateBudgetDto {
    deptId: string
    placeId: string
    budgetNo?: string
    budgetName: string
    year: string
    month: string
    budgetAmount: number
    budgetFrom: string
    budgetTo: string
    budgetStatus: string
    remark: string
}

export interface UpdateBudgetDto extends CreateBudgetDto {
    _id?: string
}

export interface ListBudgetRequestDto {
    page: number
    limit: number
    name?: string
    year?: string
    month?: string,
    date?: string[]
    deptId?: string[]
    placeId: string[]
}

export interface UploadBudgetDto {
    deptCode: string
    deptName: string
    placeCode: string
    placeName: string
    budgetNo: string
    budgetName: string
    year: string
    month: string
    budgetAmount: number | string
    budgetFrom: string
    budgetTo: string
    budgetStatus: string
    remark: string
}

export class ImportBudgetBody {

    @ApiProperty({ description: 'Dept Code' })
    deptCode: string

    @ApiProperty({ description: 'Dept Name' })
    deptName: string

    @ApiProperty({ description: 'Location Code' })
    placeCode: string

    @ApiProperty({ description: 'Location Name' })
    placeName: string

    @ApiProperty({ description: 'Budget Name' })
    budgetName: string

    @ApiProperty({ description: 'Year' })
    year: string

    @ApiProperty({ description: 'Month' })
    month: string

    @ApiProperty({ description: 'Budget Amount' })
    budgetAmount: number

    @ApiProperty({ description: 'Budget Date Range From' })
    budgetFrom: Date

    @ApiProperty({ description: 'Budget Date Range To' })
    budgetTo: string

    @ApiProperty({ description: 'Budget Status' })
    budgetStatus: string

    @ApiProperty({ description: 'Remark' })
    remark?: string

    @ApiProperty({ description: 'Value Name' })
    valueName: string

    @ApiProperty({ description: 'Type for catelog' })
    type: string
}

export class CreateBudgetBody {

    @ApiProperty({ description: 'Dept Id' })
    deptId: string

    @ApiProperty({ description: 'Location Id' })
    placeId: string

    @ApiProperty({ description: 'Budget Name' })
    budgetName: string

    @ApiProperty({ description: 'Year' })
    year: string

    @ApiProperty({ description: 'Month' })
    month: string

    @ApiProperty({ description: 'Budget Amount' })
    budgetAmount: number

    @ApiProperty({ description: 'Budget Date Range From' })
    budgetFrom: Date

    @ApiProperty({ description: 'Budget Date Range To' })
    budgetTo: string

    @ApiProperty({ description: 'Budget Status' })
    budgetStatus: string

    @ApiProperty({ description: 'Remark' })
    remark?: string

    @ApiProperty({ description: 'Value Name' })
    valueName: string

    @ApiProperty({ description: 'Type for catelog' })
    type: string
}

export class UpdateBudgetBody extends CreateBudgetBody {

    @ApiProperty({ description: 'Data Id' })
    _id: string
}

export class BudgetBody extends UpdateBudgetBody {

    @ApiProperty({ description: 'Budget No, response only' })
    budgetNo: string

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class ListBudgetQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    name: string
}

export class ListBudgetueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: [BudgetBody], description: 'Data List' })
    lists: BudgetBody[]
}