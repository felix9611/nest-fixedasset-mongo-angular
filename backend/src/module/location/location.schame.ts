import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type VenderDocument = HydratedDocument<Location>
@Schema()
export class Location extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    placeCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    placeName: string

    @Prop({ type: SchemaTypes.String })
    remark: string
}

export const LocationSchema = SchemaFactory.createForClass(Location)