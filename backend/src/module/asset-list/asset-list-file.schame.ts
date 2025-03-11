import { Prop, Schema } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'

@Schema()
export class AssetListFile {
    @Prop({ type: SchemaTypes.String })
    fileName: string

    @Prop({ type: SchemaTypes.String })
    base64: string

    @Prop({ type: SchemaTypes.Boolean })
    status: boolean
}