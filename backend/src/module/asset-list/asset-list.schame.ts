import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'
import { Type } from '@nestjs/common'
import { AssetListFile } from './asset-list-file.schame'

export type AssetListDocument = HydratedDocument<AssetList>
@Schema()
export class AssetList extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true})
    assetCode: string

    @Prop({ type: SchemaTypes.String, required: true})
    assetName: string

    @Prop({ type: SchemaTypes.String, required: true})
    unit: string

    @Prop({ type: Types.ObjectId, required: true, ref: 'AssetType' })
    typeId: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true, ref: 'Department' })
    deptId: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true, ref: 'Location' })
    placeId: Types.ObjectId

    @Prop({ type: SchemaTypes.Date, set: (val: string | Date) => new Date(val),})
    purchaseDate: Date

    @Prop({ type: SchemaTypes.String })
    description: string

    @Prop({ type: SchemaTypes.Boolean, default: false})
    sponsor: boolean

    @Prop({ type: SchemaTypes.String })
    sponsorName: string
    
    @Prop({ type: Types.Double, required: true })
    cost: number

    @Prop({ type: SchemaTypes.String })
    serialNo: string

    @Prop({ type: SchemaTypes.String })
    invoiceNo: string

    @Prop({ type: SchemaTypes.Date})
    invoiceDate: string

    @Prop({ type: SchemaTypes.String })
    invoiceRemark: string

    @Prop({ type: Types.ObjectId, ref: 'Vendor' })
    vendorId: string

    @Prop({ type: SchemaTypes.String })
    remark: string

    @Prop({ type: Types.ObjectId, ref: 'TaxInformation' })
    taxInfofId: string

    @Prop({ type: SchemaTypes.String })
    taxCountryCode: string

    @Prop({ type: SchemaTypes.String })
    taxCode: string

    @Prop({ type: Types.Double})
    taxRate: number

    @Prop({ type: SchemaTypes.Boolean, default: false })
    includeTax: boolean

    @Prop({ type: Types.Double})
    afterBeforeTax: number

    @Prop({ type: SchemaTypes.String })
    accountCode: string

    @Prop({ type: SchemaTypes.String })
    accountName: string

    @Prop({ type: SchemaTypes.String })
    brandCode: string

    @Prop({ type: SchemaTypes.String })
    brandName: string

    @Prop({ type: SchemaTypes.String })
    chequeNo: string

    @Prop({ type: SchemaTypes.Date})
    maintenancePeriodStart: string

    @Prop({ type: SchemaTypes.Date})
    maintenancePeriodEnd: string

    @Prop({ type: SchemaTypes.String})
    voucherNo: string

    @Prop({ type: SchemaTypes.Date})
    voucherUsedDate: string

    @Prop({ type: SchemaTypes.Array})
    assetListFiles: Types.Array<AssetListFile>

    @Prop({ type: SchemaTypes.String, ref: 'SysUser' })
    staffName: string
}

export const AssetListSchema = SchemaFactory.createForClass(AssetList)