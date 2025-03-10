export interface CreateBudgetDto {
    deptId: string
    department: any
    placeId: string
    place: any
    budgetNo?: string
    budgetName: string
    year: string
    month: string
    budgetAmount: number
    budgetFrom: Date
    budgetTo: string
    budgetStatus: string
    remark?: string
}

export interface UpdateBudgetDto extends CreateBudgetDto {
    _id: string
}

export interface ListBudgetRequestDto {
    page: number
    limit: number
    name?: string
    year?: string
    month?: string,
    date?: string[]
    deptId?: string[]
    placeId: string[]
}