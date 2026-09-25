import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes, Types, Document } from 'mongoose'

@Schema({ timestamps: true })
export class BaseSchema {
    _id!: Types.ObjectId | undefined

    @Prop({ type: SchemaTypes.Date, default: Date.now})
    createdAt!: Date | undefined

    @Prop({ type: SchemaTypes.Date, default: Date.now})
    updatedAt!: Date | undefined

    @Prop({ type: SchemaTypes.Number, default: 1})
    status!: number | undefined
}