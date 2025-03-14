export interface SysMenuDto {
    mainId: string
    name: string
    icon: string
    path: string
    sort: number
    type: number
}


export interface SysMenuTree extends SysMenuDto {
    childrens: SysMenuTree[]
}