import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'

export type InvRecordDocument = HydratedDocument<InvRecord>
@Schema()
export class InvRecord {
    _id: Types.ObjectId

    @Prop({ type: SchemaTypes.String, required: true })
    assetCode: string

    @Prop({ type: Types.ObjectId, ref: 'Location' })
    placeFrom: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Location' })
    placeTo: Types.ObjectId

    @Prop({ type: SchemaTypes.Date, default: Date.now })
    createdAt: string
}

export const InvRecordSchema = SchemaFactory.createForClass(InvRecord)