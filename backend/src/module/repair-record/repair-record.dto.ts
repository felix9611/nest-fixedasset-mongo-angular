import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from 'src/tool/open-api-body'

export interface CreateRepairRecordDto {
    assetId: string
    repairReason: string
    maintenanceReriod: boolean
    maintenanceName: string
    maintenanceDate: string
    maintenanceFinishDate: string
    repairInvoiceDate: string
    repairInvoiceNo: string
    repairAmount: number
    remark: string
}

export interface UpdateRepairRecordDto extends CreateRepairRecordDto{
    _id: string
}

export interface ListRepairRecordDto {
    page: number
    limit: number
    dateRange?: string[]
    assetCode?: string
    deptIds?: string[]
    typeIds?: string[]
    placeIds: string[]
}

export class CreateRepairRecordBody {
    @ApiProperty({ description: 'Asset Data ID' })
    assetId: string

    @ApiProperty({ description: 'Repair Reason' })
    repairReason: string

    @ApiProperty({ description: 'True = Yes, False = No' })
    maintenanceReriod: boolean

    @ApiProperty({ description: 'Maintenance Name' })
    maintenanceName: string

    @ApiProperty({ description: 'Maintenance Date' })
    maintenanceDate: string

    @ApiProperty({ description: 'Maintenance Finish Date' })
    maintenanceFinishDate: string

    @ApiProperty({ description: 'Repair Invoice Date' })
    repairInvoiceDate: string

    @ApiProperty({ description: 'Repair Invoice No.' })
    repairInvoiceNo: string

    @ApiProperty({ description: 'Repair Amount' })
    repairAmount: number

    @ApiProperty({ description: 'Remark' })
    remark: string
}

export class UpdateRepairRecordBody extends CreateRepairRecordBody {

    @ApiProperty({ description: 'Data Id' })
    _id: string
}

export class RepairRecordBody extends UpdateRepairRecordBody {

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class ListRepairRecordQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data range', required: false })  
    dateRange?: string[]

    @ApiProperty({ description: 'For search by asset code', required: false }) 
    assetCode?: string

    @ApiProperty({ description: 'For search by department ids', required: false }) 
    deptIds?: string[]

    @ApiProperty({ description: 'For search by  type ids', required: false }) 
    typeIds?: string[]

    @ApiProperty({ description: 'For search by location ids', required: false }) 
    placeIds: string[]
}

export class ListRepairRecordQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: [RepairRecordBody], description: 'Data List' })
    lists: RepairRecordBody[]
}
