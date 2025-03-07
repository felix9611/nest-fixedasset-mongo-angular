export interface UserInfo {
    _id?: string
    username: string
    accessToken: string
    roleIds?: number[],
    deptId?: number,
    avatarBase64?: string
    email: string
    lastLogin?: string
    roleLists?: any[]
}