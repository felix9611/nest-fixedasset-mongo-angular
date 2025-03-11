
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type WriteOffDocument = HydratedDocument<WriteOff>
@Schema()
export class WriteOff extends BaseSchema {
    @Prop({ type: Types.ObjectId, required: true, ref: 'AssetList' })
    assetId: string

    @Prop({ type: Types.ObjectId, required: true, ref: 'Location' })
    lastPlaceId: string

    @Prop({ type: SchemaTypes.String, required: true })
    reason: string

    @Prop({ type: SchemaTypes.Date, required: true })
    lastDay: string
}

export const WriteOffSchema = SchemaFactory.createForClass(WriteOff)