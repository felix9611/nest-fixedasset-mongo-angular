
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type AssetTypeDocument = HydratedDocument<AssetType>
@Schema()
export class AssetType extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    typeCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    typeName: string

    @Prop({ type: SchemaTypes.String })
    remark?: string

    @Prop({ type: SchemaTypes.Number })
    depreciationRate: number
}

export const AssetTypeSchema = SchemaFactory.createForClass(AssetType)