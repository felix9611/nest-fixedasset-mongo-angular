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