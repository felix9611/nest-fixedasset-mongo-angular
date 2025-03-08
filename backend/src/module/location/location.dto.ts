export interface CreateLocationDto {
    placeCode: string
    placeName: string,
    remark?: string
}

export interface UpdateLocationDto extends CreateLocationDto {
    _id: string
}

export interface ListLocationRequestDto {
    page: number
    limit: number
    name?: string
}