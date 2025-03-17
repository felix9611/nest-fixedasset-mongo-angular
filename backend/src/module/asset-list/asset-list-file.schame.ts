import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type AssetListDocument = HydratedDocument<AssetListFile>
@Schema()
export class AssetListFile extends BaseSchema {
    @Prop({ type: Types.ObjectId, required: true, ref: 'AssetList' })
    assetId: Types.ObjectId

    @Prop({ type: SchemaTypes.String })
    fileName: string

    @Prop({ type: SchemaTypes.String })
    fileType: string

    @Prop({ type: SchemaTypes.String })
    base64: string

}

export const AssetListFileSchema = SchemaFactory.createForClass(AssetListFile)