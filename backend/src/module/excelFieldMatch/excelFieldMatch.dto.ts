export interface ExcelFieldList {
    dbFieldName: string
    excelFieldName: string
    sort: number
}

export interface ExcelFieldMatchCreate {
    functionCode: string
    functionName: string
    functionType: string
    fieldLists?: ExcelFieldList[]
}

export interface ExcelFieldMatchUpdate extends ExcelFieldMatchCreate {
    _id: string
}