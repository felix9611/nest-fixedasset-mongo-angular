export interface CreateUserDto {
    username: string
    password: string
    avatarBase64?: string
    deptId?: number
    email: string
    roles?: number[]
}

export interface CreateUserRequestDto {
    key: string
    userData: CreateUserDto
}