import { Types } from "mongoose

export interface CreateStaffMember {
    deptId: Types.ObjectId
    placeId: Types.ObjectId
    sysUserId: Types.ObjectId
    staffName: string
    avatar: string
    remark: string
}