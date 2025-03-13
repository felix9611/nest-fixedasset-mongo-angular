import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type RepairRecordDocument = HydratedDocument<RepairRecord>
@Schema()
export class RepairRecord extends BaseSchema {
    @Prop({ type: Types.ObjectId, required: true })
    assetId: Types.ObjectId

    @Prop({ type: SchemaTypes.String, required: true })
    repairReason: string

    @Prop({ type: SchemaTypes.Boolean, required: true })
    maintenanceReriod: boolean

    @Prop({ type: SchemaTypes.String })
    maintenanceName: string

    @Prop({ type: SchemaTypes.Date })
    maintenanceDate: string

    @Prop({ type: SchemaTypes.Date })
    maintenanceFinishDate: string

    @Prop({ type: SchemaTypes.Date})
    repairInvoiceDate: string

    @Prop({ type: SchemaTypes.String })
    repairInvoiceNo: string

    @Prop({ type: SchemaTypes.Number })
    repairAmount: number

    @Prop({ type: SchemaTypes.String })
    remark: string
}

export const RepairRecordSchema = SchemaFactory.createForClass(RepairRecord)