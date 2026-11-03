export interface UpdateJobDashboardStatusDto {
    status: number
    _id: string
}

export interface ListJobDashboardRequestDto {
    name?: string
    memberId?: string
}