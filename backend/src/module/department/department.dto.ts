export interface CreateDeptDto {
    deptCode: string
    deptName: string,
    remark?: string
}

export interface UpdateDeptDto extends CreateDeptDto {
    _id: string
}

export interface ListDeptRequestDto {
    page: number
    limit: number
    name?: string
}