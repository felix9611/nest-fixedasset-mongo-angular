
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'
import { Department, DepartmentSchema } from '../department/department.schame'
import { SysRole, SysRoleSchema } from '../sys-role/role.schame'

export type SysUserDocument = HydratedDocument<SysUser, SysUserDocumentOverride>
@Schema()
export class SysUser extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    username: string

    @Prop({ type: SchemaTypes.String, required: true })
    password: string

    @Prop({ type: SchemaTypes.String })
    avatarBase64?: string

    @Prop({ type: SchemaTypes.String })
    deptId?: string

    @Prop({ DepartmentSchema })
    department?: Department

    @Prop({ type: SchemaTypes.String })
    email: string

    @Prop({ type: SchemaTypes.Date })
    lastLogin?: Date

    @Prop({ type: SchemaTypes.Array })
    roles?: string[]
}

export type SysUserDocumentOverride = {
    department: Types.Subdocument<Types.ObjectId> & Department
}

export const SysUserSchema = SchemaFactory.createForClass(SysUser)