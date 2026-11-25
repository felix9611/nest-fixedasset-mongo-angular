import { Types } from 'mongoose'

export interface CreateAssignment {
    staffId: Types.ObjectId
    assetId: Types.ObjectId
    deptId: Types.ObjectId
    expiryDate: string
    remark: string
}