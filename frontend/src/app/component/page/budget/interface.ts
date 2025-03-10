export interface BudgetForm {
    _id?: string,
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