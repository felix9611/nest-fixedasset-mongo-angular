export interface UserForm {
    _id?: string,
    username: string
    password?: string
    avatarBase64?: string
    deptId?: number
    department?: any
    email: string
    roles?: number[]
}