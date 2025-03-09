export interface RoleForm {
    _id?: string,
    name: string
    code: string
    remark?: string
    meunIds?: number[]
    read: boolean
    write: boolean
    delete: boolean
    update: boolean
}