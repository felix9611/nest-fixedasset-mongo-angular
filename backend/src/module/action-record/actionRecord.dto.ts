export interface ActionRecordCreateDto {
    actionName: string
    actionMethod: string
    actionFrom: string
    actionData: any
    actionSuccess: string
    createdAt: Date
}

export interface ActionRecordListDto {
    page: number,
    limit: number
}