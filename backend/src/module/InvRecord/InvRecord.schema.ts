import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'

export type InvRecordDocument = HydratedDocument<InvRecord>
@Schema()
export class InvRecord {
    _id: Types.ObjectId

    @Prop({ type: SchemaTypes.String, required: true, ref: 'AssetList' })
    assetCode: string

    @Prop({ type: Types.ObjectId, ref: 'Location' })
    placeFrom: string

    @Prop({ type: Types.ObjectId, ref: 'Location' })
    placeTo: string

    @Prop({ type: SchemaTypes.Date, default: Date.now })
    createdAt: string
}

export const InvRecordSchema = SchemaFactory.createForClass(InvRecord)