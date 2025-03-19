export interface DashboardReqFilterDto {
    typeIds?: string[]
    placeIds?: string[]
    deptIds?: string[]
    purchaseDates?: string[]
}

export interface DashboardReqDto {
    dateType?: boolean
    dateTypeValue?: 'YearMonth' | 'none'
    dataType?: boolean
    dataTypeValue?: 'dept' | 'type' | 'location'
    valueField: 'counts' | 'costs'
}