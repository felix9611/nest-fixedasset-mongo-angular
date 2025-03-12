export interface AssetTypeCreateDto {
    typeCode: string
    typeName: string
    remark?: string
    depreciationRate?: number
}

export interface AssetTypeUpdateDto extends AssetTypeCreateDto{
    _id: string
}

export interface AssetTypeListSearchDto {
    name?: string,
    page: number,
    limit: number
}