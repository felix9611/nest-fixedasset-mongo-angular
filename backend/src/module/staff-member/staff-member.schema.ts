import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type StaffMemberDocument = HydratedDocument<StaffMember>
@Schema()
export class StaffMember extends BaseSchema {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Department' })
    deptId!: Types.ObjectId
    
    @Prop({ type: Types.ObjectId, required: true, ref: 'Location' })
    placeId!: Types.ObjectId
}

export const StaffMemberSchema = SchemaFactory.createForClass(StaffMember)