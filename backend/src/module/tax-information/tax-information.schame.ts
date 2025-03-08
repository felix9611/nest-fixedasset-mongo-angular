
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type TaxInformationDocument = HydratedDocument<TaxInformation>
@Schema()
export class TaxInformation extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    nationCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    nationName: string

    @Prop({ type: SchemaTypes.String, required: true })
    countryCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    countryName: string

    @Prop({ type: SchemaTypes.String, required: true })
    taxType: string

    @Prop({ type: SchemaTypes.String, required: true })
    taxCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    taxName: string

    @Prop({ type: SchemaTypes.Double, required: true })
    taxRate?: number

    @Prop({ type: SchemaTypes.Double })
    importRate?: number

    @Prop({ type: SchemaTypes.String })
    remark?: string
}

export const TaxInformationSchema = SchemaFactory.createForClass(TaxInformation)