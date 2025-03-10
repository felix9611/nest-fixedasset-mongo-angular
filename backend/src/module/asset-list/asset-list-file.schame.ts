import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'
import { Type } from '@nestjs/common'

@Schema()
export class AssetListFile {
    @Prop({ type: SchemaTypes.String })
    fileName: string

    @Prop({ type: SchemaTypes.String })
    base64: string
}