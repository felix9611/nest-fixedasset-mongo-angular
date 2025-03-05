
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type SysUserDocument = HydratedDocument<SysUser>
@Schema()
export class SysUser extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    username: string

    @Prop({ type: SchemaTypes.String, required: true })
    password: string

    @Prop({ type: SchemaTypes.String })
    avatarBase64?: string

    @Prop({ type: SchemaTypes.Number })
    deptId?: number

    @Prop({ type: SchemaTypes.String })
    email: string

    @Prop({ type: SchemaTypes.Date })
    lastLogin?: Date

    @Prop({ type: SchemaTypes.Array })
    roles?: number[]
}

export const SysUserSchema = SchemaFactory.createForClass(SysUser)