import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaType, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'
import { Department, DepartmentSchema } from '../department/department.schame'
import { Location, LocationSchema } from '../location/location.schame'

export type BudgetDocument = HydratedDocument<Budget>
@Schema()
export class Budget extends BaseSchema {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Department' })
    deptId: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true, ref: 'Location' })
    placeId: Types.ObjectId

    @Prop({ type: SchemaTypes.String, required: true })
    budgetNo: string

    @Prop({ type: SchemaTypes.String, required: true })
    budgetName: string

    @Prop({ type: SchemaTypes.String, required: true })
    year: string

    @Prop({ type: SchemaTypes.String, required: true })
    month: string

    @Prop({ type: SchemaTypes.Number, required: true })
    budgetAmount: number

    @Prop({ type: SchemaTypes.Date, required: true })
    budgetFrom: string

    @Prop({ type: SchemaTypes.String, required: true })
    budgetTo: string

    @Prop({ type: SchemaTypes.String, required: true })
    budgetStatus: string

    @Prop({ type: SchemaTypes.String })
    remark: string
}

export const BudgetSchema = SchemaFactory.createForClass(Budget)