import { IsOptional } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { StringExpression } from "mongoose"
import { AssetTypeBody } from "../asset-type/assetType.dto"
import { DepartmentBody } from "../department/department.dto"
import { LocationBody } from "../location/location.dto"
import { VendorBody } from "../vendor/vendor.dto"
import { CommonPageAndList, CommonPageAndListResponse } from "src/tool/open-api-body"

export interface AssetListFileDto {
    _id?: string
    assetId?: string
    fileName: string
    fileType: string
    base64: string
}

export interface CreateAssetDto {
    assetName: string
    unit: string
    typeId: string
    deptId: string
    placeId: string
    purchaseDate: string
    description?: string
    sponsor: boolean
    sponsorName?: string
    cost: number
    serialNo?: string
    invoiceNo?: string
    invoiceDate?: string
    invoiceRemark?: string
    vendorId?: string
    remark?: string
    taxInfofId?: string
    taxCountryCode?: string
    taxCode?: string
    taxRate?: number
    includeTax?: boolean
    afterBeforeTax?: number
    accountCode?: string
    accountName?: string
    brandCode?: string
    brandName?: string
    chequeNo?: string
    maintenancePeriodStart?: string
    maintenancePeriodEnd?: string
    voucherNo?: string
    voucherUsedDate?: string
    uploadAssetListFiles?: AssetListFileDto[]
}

export interface UpdateAssetDto extends CreateAssetDto {
    _id: string
    assetCode: string
}

export interface ListAssetReqDto {
    page: number
    limit: number
    assetCode?: string
    assetName?: string
    typeIds?: string[]
    placeIds?: string[]
    deptIds?: string[]
    purchaseDates?: string[]
}

export interface DashboardReqDto {
    dateType?: boolean
    dateTypeValue?: 'YearMonth' | 'YearQuarter' | 'none'
    dataType?: boolean
    dataTypeValue?: 'dept' | 'type' | 'location' | 'none'
    valueField: 'counts' | 'costs'
    filter?: DashboardReqFilterDto
}

export interface DashboardReqFilterDto {
    assetCode?: string
    assetName?: string
    typeIds?: string[]
    placeIds?: string[]
    deptIds?: string[]
    purchaseDates?: string[]
}

export interface UploadAssetListDto {
    assetCode: string
    assetName: string
    unit: string
    typeCode: string
    typeName: string
    deptCode: string
    deptName: string
    placeCode: string
    placeName: string
    purchaseDate: string
    description: string
    sponsor: string | boolean
    sponsorName: string
    cost: string | number
    serialNo: string
    invoiceNo: string
    invoiceDate: string
    invoiceRemark: string
    vendorId: string
    remark: string
    taxCountryCode: string
    taxCode: string
    taxRate: string | number
    includeTax: string | boolean
    afterBeforeTax: string | number
    accountCode: string
    accountName: string
    brandCode: string
    brandName: string
    chequeNo: string
    maintenancePeriodStart: string
    maintenancePeriodEnd: string
    voucherNo: string
    voucherUsedDate: string
}

export class AssetListFileCreateBody {
    @ApiProperty({ description: 'File Name' })
    fileName: string

    @ApiProperty({ description: 'File Type' })
    fileType: string

    @ApiProperty({ description: 'Base64 String' })
    base64: string
}


export class AssetListFileBody extends AssetListFileCreateBody {
    @ApiProperty({ description: 'Id' })
    _id: string

    @ApiProperty({ description: 'Asset Id' })
    assetId: string

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}


export class CreateAssetBody {
    @ApiProperty({ description: 'Asset Name' })
    assetName: string

    @ApiProperty({ description: 'Unit' })
    unit: string

    @ApiProperty({ description: 'Type Id' })
    typeId: string

    @ApiProperty({ description: 'Dept Id' })
    deptId: string

    @ApiProperty({ description: 'Location Id' })
    placeId: string

    @ApiProperty({ description: 'Purchase Date' })
    purchaseDate: string

    @ApiProperty({ description: 'Description' })
    @IsOptional()
    description: string

    @ApiProperty({ description: 'Sponsor or Not' })
    sponsor: boolean

    @ApiProperty({ description: 'Sponsor Name' })
    @IsOptional()
    sponsorName: string

    @ApiProperty({ description: 'Cost' })
    cost: number

    @ApiProperty({ description: 'Serial No.' })
    @IsOptional()
    serialNo: string

    @ApiProperty({ description: 'Invoice No.' })
    @IsOptional()
    invoiceNo: string
    
    @ApiProperty({ description: 'Invoice Date' })
    @IsOptional()
    invoiceDate: string

    @ApiProperty({ description: 'Invoice Remark' })
    @IsOptional()
    invoiceRemark: string

    @ApiProperty({ description: 'Vendor Id' })
    @IsOptional()
    vendorId: string

    @ApiProperty({ description: 'Remark' })
    @IsOptional()
    remark: string

    @ApiProperty({ description: 'Tax Info Id' })
    @IsOptional()
    taxInfofId: string

    @ApiProperty({ description: 'Tax Country Code' })
    @IsOptional()
    taxCountryCode: string

    @ApiProperty({ description: 'Tax Code' })
    @IsOptional()
    taxCode: string

    @ApiProperty({ description: 'Tax Rate' })
    @IsOptional()
    taxRate: number

    @ApiProperty({ description: 'Include Tax or Not' })
    @IsOptional()
    includeTax: boolean

    @ApiProperty({ description: 'After/Before Tax' })
    @IsOptional()
    afterBeforeTax: number

    @ApiProperty({ description: 'Account Code' })
    @IsOptional()
    accountCode: string

    @ApiProperty({ description: 'Account Name' })    
    @IsOptional()
    accountName: string

    @ApiProperty({ description: 'Brand Code' })
    @IsOptional()
    brandCode: string

    @ApiProperty({ description: 'Brand Name' })
    @IsOptional()
    brandName: string

    @ApiProperty({ description: 'Cheque No.' })
    @IsOptional()
    chequeNo: string

    @ApiProperty({ description: 'Maintenance Period Start' })
    @IsOptional()
    maintenancePeriodStart: string

    @ApiProperty({ description: 'Maintenance Period End' })
    @IsOptional()
    maintenancePeriodEnd: string
    
    @ApiProperty({ description: 'Voucher No.' })    
    @IsOptional()
    voucherNo: string

    @ApiProperty({ description: 'Voucher Used Date' })
    @IsOptional()
    voucherUsedDate: string

    @ApiProperty({ description: 'Asset List Files', type: AssetListFileCreateBody, isArray: true })   
    @IsOptional()
    uploadAssetListFiles: AssetListFileCreateBody[]
}

export class UpdateAssetBody extends CreateAssetBody {
    @ApiProperty({ description: 'Asset Id' })
    _id: string

    @ApiProperty({ description: 'Asset Code' })
    assetCode: string
}

export class AssetListBody extends UpdateAssetBody {
    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class AssetListFullBody extends UpdateAssetBody {
    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number

    @ApiProperty({ description: 'Asset Type', type: AssetTypeBody })
    assetType: AssetTypeBody

    @ApiProperty({ description: 'Department', type: DepartmentBody })
    department: DepartmentBody

    @ApiProperty({ description: 'Location', type: LocationBody })
    location: LocationBody

    @ApiProperty({ description: 'Sort Number' })
    assetCodeInt: number
}

export class AssetListQuery extends CommonPageAndList {
    @ApiProperty({ description: 'Asset Code' })
    @IsOptional()
    assetCode: string

    @ApiProperty({ description: 'Asset Name' })
    @IsOptional()
    assetName: string

    @ApiProperty({ description: 'Asset Type Ids', isArray: true })
    @IsOptional()
    typeIds: string[]

    @ApiProperty({ description: 'Location Ids', isArray: true })
    @IsOptional()
    locationIds: string[]

    @ApiProperty({ description: 'Department Ids', isArray: true })
    @IsOptional()    
    departmentIds: string[]

    @ApiProperty({ description: 'Purchase Dates', isArray: true })
    @IsOptional()
    purchaseDates: string[]
}

export class AssetListListQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: AssetListFullBody, isArray: true, description: 'Data List' })
    lists: AssetListFullBody[]
}

export class DashboardReqFilterBody {
    @ApiProperty({ description: 'Asset Type Ids', isArray: true })
    @IsOptional()
    typeIds: string[]    

    @ApiProperty({ description: 'Location Ids', isArray: true })
    @IsOptional()
    locationIds: string[]

    @ApiProperty({ description: 'Department Ids', isArray: true })
    @IsOptional()    
    departmentIds: string[]

    @ApiProperty({ description: 'Purchase Dates', isArray: true })
    @IsOptional()
    purchaseDates: string[]

    @ApiProperty({ description: 'Asset Code' })
    @IsOptional()
    assetCode: string

    @ApiProperty({ description: 'Asset Name' })
    @IsOptional()
    assetName: string 
}

export class DashboardReqBody {
    @ApiProperty({ description: 'Date Type' })
    @IsOptional()
    dateType: boolean

    @ApiProperty({ description: 'Date Type Value, YearMonth or YearQuarter or none' })
    @IsOptional()
    dateTypeValue: string

    @ApiProperty({ description: 'Data Type' })
    @IsOptional()
    dataType: boolean

    @ApiProperty({ description: 'Data Type Value, dept or type or location or none' })
    dataTypeValue: string

    @ApiProperty({ description: 'Value Field, counts or costs' })
    valueField: string

    @ApiProperty({ description: 'Filter', type: DashboardReqFilterBody })
    filter: DashboardReqFilterBody
}