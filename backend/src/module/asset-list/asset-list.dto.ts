import { StringExpression } from "mongoose"

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