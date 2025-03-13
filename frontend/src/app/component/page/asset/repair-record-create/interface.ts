export interface AssetListFileDto {
    fileName: string
    base64: string
    status: boolean
}

export interface CreateAsset {
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
    taxRate: number
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

export interface AssetFormDto extends CreateAsset {
    _id?: string
    assetCode?: string
    repairReason: string
    maintenanceReriod: boolean
    maintenanceName: string
    maintenanceDate: string
    maintenanceFinishDate: string
    repairInvoiceDate: string
    repairInvoiceNo: string
    repairAmount: number
    remarkRepair: string
}
