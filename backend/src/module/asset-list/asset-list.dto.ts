export interface AssetListFileDto {
    fileName: string
    base64: string
}

export interface CreateAssetDto {
    assetName: string
    unit: string
    typeId: string
    deptId: string
    placeId: string
    buyDate: string
    description?: string
    sponsor: boolean
    sponsorName?: string
    cost: number
    serialNo?: string
    invoiceNo?: string
    invoiceDate?: string
    invoiceRemark?: string
    staffId?: string
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
    assetListFiles?: AssetListFileDto[]
}

export interface UpdateAssetDto {
    _id: string
    assetCode: string
}

export interface ListAssetReqDto {
    page: number
    limit: number
    assetCode?: string
    typeIds?: string[]
    placeIds?: string[]
    depatIds?: string[]
}