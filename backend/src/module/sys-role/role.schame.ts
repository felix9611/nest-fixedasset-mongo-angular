import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type SysRoleDocument = HydratedDocument<SysRole>
@Schema()
export class SysRole extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    name: string

    @Prop({ type: SchemaTypes.String, required: true })
    code: string

    @Prop({ type: SchemaTypes.String})
    remark?: string

    @Prop({ type: SchemaTypes.Number})
    meunIds?: number[]

    @Prop({ type: SchemaTypes.Boolean, required: true })
    read: boolean

    @Prop({ type: SchemaTypes.Boolean, required: true })
    write: boolean

    @Prop({ type: SchemaTypes.Boolean, required: true })
    delete: boolean

    @Prop({ type: SchemaTypes.Boolean, required: true })
    update: boolean
}

export const SysRoleSchema = SchemaFactory.createForClass(SysRole)