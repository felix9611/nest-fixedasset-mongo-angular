import { ApiProperty } from "@nestjs/swagger"

export interface CreateSysRoleDto {
    name: string
    code: string
    remark: string
    meunIds: string[]
    read: boolean
    write: boolean
    delete: boolean
    update: boolean
    upload: boolean
}

export interface UpdateSysRoleDto extends CreateSysRoleDto{
    _id: string
}

export interface ListRoleRequestDto {
    page: number,
    limit: number,
    name?: string
}

export class CreateSysRole {
    @ApiProperty({ description: 'Name' })
    name: string

    @ApiProperty({ description: 'Code' })
    code: string

    @ApiProperty({ description: 'Remark' })
    remark: string

    @ApiProperty({ description: 'Menu Id List' })
    meunIds: string[]

    @ApiProperty({ description: 'Read Right' })
    read: boolean

    @ApiProperty({ description: 'Write Right' })
    write: boolean

    @ApiProperty({ description: 'Delete Right' })
    delete: boolean

    @ApiProperty({ description: 'Update Right' })
    update: boolean

    @ApiProperty({ description: 'Upload Right' })
    upload: boolean
}

export class UpdateSysRole extends CreateSysRole {
    @ApiProperty({ description: 'ID' })
    _id: string

    
}

export class SysRoleBody extends UpdateSysRole {
    @ApiProperty({ description: 'Status' })
    status: number

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string
}