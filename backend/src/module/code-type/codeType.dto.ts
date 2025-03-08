export interface CreateCodeTypeDto {
    valueCode: string
    valueName: string,
    type: string
}

export interface UpdateCodeTypeDto extends CreateCodeTypeDto {
    _id: string
}

export interface ListCodeTypeRequestDto {
    page: number
    limit: number
    name?: string
}