import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type StockTakeItemDocument = HydratedDocument<StockTakeItem >
@Schema()
export class StockTakeItem {
    _id: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true, ref: 'StockTake' })
    stockTakeId: string
    
    @Prop({ type: Types.ObjectId, required: true, ref: 'AssetList' })
    assetId: string 

    @Prop({ type: SchemaTypes.String, required: true })
    assetCode: string

    @Prop({ type: Types.ObjectId, required: true, ref: 'Location' })
    placeId: string 

    @Prop({ type: SchemaTypes.String, required: true })
    status: string

    @Prop({ type: SchemaTypes.Date, required: true })
    checkTime: string

    @Prop({ type: SchemaTypes.String })
    remark: string
}

export const StockTakeItemSchema = SchemaFactory.createForClass(StockTakeItem)