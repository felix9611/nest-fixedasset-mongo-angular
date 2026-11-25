import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type AssignmentDocument = HydratedDocument<Assignment>
@Schema()
export class Assignment extends BaseSchema {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Departments' })
    deptId!: Types.ObjectId
    
    @Prop({ type: Types.ObjectId, required: true, ref: 'Sysusers' })
    staffId!: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true, ref: 'Assetlists' })
    assetId!: Types.ObjectId

    @Prop({ type: SchemaTypes.Date})
    expiryDate?: string

    @Prop({ type: SchemaTypes.String})
    remark?: string
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment)