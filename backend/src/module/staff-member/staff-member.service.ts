import { Injectable } from '@nestjs/common'
import { StaffMember } from './staff-member.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { DepartmentService } from '../department/department.service'
import { LocationService } from '../location/location.service'
import { SysUserService } from '../sys-user/sysUser.service'
import { CreateStaffMember, StaffMemberListReq } from './staff-member.dto'

@Injectable()
export class StaffMemberService {
    constructor(
        @InjectModel(StaffMember.name) private staffMemberModel: Model<StaffMember>,
        private actionRecordService: ActionRecordService,
        private departmentService: DepartmentService,
        private locationService: LocationService,
        private sysUserService: SysUserService
    ) {}

    async actionRecordRecord(actionName: string, actionMethod: string, actionData: any, actionSuccess: string) {
        return await this.actionRecordService.saveRecord({
            actionName,
            actionMethod,
            actionFrom: 'Staff Member',
            actionData,
            actionSuccess,
            createdAt: new Date()
        })
    }

    async createStaff(data: CreateStaffMember) {
        const { deptId, sysUserId, staffName, avatar, remark } = data

        const check = await this.staffMemberModel.findOne({ staffName, status: 1})

        if (check) {
            await this.actionRecordRecord('Create Staff Member', 'POST', data, 'FAILURE')

            return {
                error: 'This staff member already exist! Please check again!'
            }
        } else if ( deptId === null ) {
            await this.actionRecordRecord('Create Staff Member', 'POST', data, 'FAILURE')
            return {
                error: 'The department id or location id must be filled!'
            }
        } else {
            const checkDept = await this.departmentService.getOneById(deptId.toString())
            // const checkLocation = await this.locationService.getOneById(placeId.toString())

            if (!(checkDept)) {
                await this.actionRecordRecord('Create Staff Member', 'POST', data, 'FAILURE')

                return {
                    error: 'The department id or location id must be filled!'
                }
            } else {
                const checkSysUser = await this.sysUserService.getUserInfo(sysUserId.toString())

                if (checkSysUser) {
                    const staffNumber = await this.createNewNumber()

                    const finalData = {
                        deptId,
                        sysUserId,
                        staffName,
                        staffNumber,
                        avatar: (avatar || ''),
                        remark: (remark || ''),
                        status: 1,
                        createdAt: new Date(),
                        updatadAt: new Date()
                    }

                    const create = new this.staffMemberModel(finalData)
                    const res = await create.save()

                    if (res) {
                        await this.actionRecordRecord('Create Staff Member', 'POST', data, 'Sussess')

                        return res
                    } else {
                        await this.actionRecordRecord('Create Staff Member', 'POST', data, 'FAILURE')
                        return {
                            error: 'Oooops! Something wrong, please try again!'
                        }
                    }
                } else {
                    await this.actionRecordRecord('Create Staff Member', 'POST', data, 'FAILURE')
                    return {
                        error: 'Not found the system user account!'
                    }
                }
            }
        }
    }

    /// make new number

    formatNumber(num: number, digits: number): string {
        return (num + 1).toString().padStart(digits, '0')
    }

    async createNewNumber() {
        const result = await this.staffMemberModel.aggregate([
            {
              $addFields: { staffNumberInt: { $toInt: "$staffNumber" } } // Convert to integer
            },
            {
              $group: { 
                _id: null, 
                maxNumber: { $max: "$staffNumberInt" } // Find max
              }
            }
        ]).exec()

        const maxNumber = result.length > 0 ? result[0].maxNumber : 0
        if (maxNumber == null) {
            return this.formatNumber(0, 6)
        } else {
            return this.formatNumber(maxNumber, 6)
        }
    }

    async updateStaff(data: StaffMember) {
        const { _id, deptId, sysUserId, ..._data } = data

        const checkStaff = await this.staffMemberModel.findOne({ _id, status: 1 })

        if (checkStaff) {
            const checkDept = await this.departmentService.getOneById(deptId.toString())
            // const checkLocation = await this.locationService.getOneById(placeId.toString())

            if (!(checkDept)) {
                await this.actionRecordRecord('Update Staff Member', 'POST', data, 'FAILURE')

                return {
                    error: 'The department id or location id must be filled!'
                }
            } else {
                const checkSysUser = await this.sysUserService.getUserInfo(sysUserId.toString())

                if (checkSysUser) {
                    const staffNumber = await this.createNewNumber()

                    const finalData = {
                        ..._data,
                        deptId,
                        sysUserId,
                        updatadAt: new Date(),
                    }

                    const update = await this.staffMemberModel.updateOne({ _id }, finalData)

                    if (update.acknowledged) {
                        await this.actionRecordRecord('Update  Staff Member', 'POST', data, 'Sussess')

                        return update
                    } else {
                        await this.actionRecordRecord('Update Staff Member', 'POST', data, 'FAILURE')
                        return {
                            error: 'Oooops! Something wrong, please try again!'
                        }
                    }
                } else {
                    await this.actionRecordRecord('Update Staff Member', 'POST', data, 'FAILURE')
                    return {
                        error: 'Not found the system user account!'
                    }
                }
            }
        } else {
            await this.actionRecordRecord('Update Staff Member', 'POST', data, 'FAILURE')
            return {
                error: 'Not found this record'
            }
        }
    } 

    async getOneById(_id: string) {
        const data = await this.staffMemberModel.findOne({ _id, status: 1 })
        if (data) {
            return data
        } else {
            return {
                error: 'Not found this record'
            }
        }
    }

    async staffMemberList(dto: StaffMemberListReq) {
        const { number, name, deptIds, placeIds, page, limit } = dto

        const skip = (page - 1) * limit

        const filters = {
            status: 1,
            ...deptIds && deptIds.length > 0 ? { deptId: { $in: deptIds } } : {},
            ...placeIds && placeIds.length > 0 ? { placeId: { $in: placeIds } } : {},
            ...number ? { staffNumber: number } : {},
            ...name ? { staffName: { $regex: name, $options: 'i' } } : {}
        }

        const lists = await this.staffMemberModel.aggregate([
            {
                $match: filters
            },
            /* {
                $lookup: {
                    from: 'locations', // Ensure correct collection name
                    let: { placeIdStr: { $toObjectId: '$placeId' } }, // Convert placeId to ObjectId
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$placeIdStr'] } } },
                        {
                            $project: {
                                _id: 0,
                                placeCode: 1,
                                placeName: 1 
                            }
                        }
                    ],
                    as: 'location'
                }
            }, */
            {
                $lookup: {
                    from: 'departments', // Ensure correct collection name
                    let: { deptIdStr: { $toObjectId: '$deptId' } }, // Convert deptId to ObjectId
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$deptIdStr'] } } },
                        {
                            $project: {
                                _id: 0,
                                deptCode: 1,
                                deptName: 1 
                            }
                        }
                    ],
                    as: 'department'
                }
            },
          //  { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
            { 
                $addFields: { 
                    staffNumberInt: { $toInt: "$staffNumber" } 
                } 
            },
            { $sort: { staffNumberInt: 1 } } ,
            { $skip: skip },
            { $limit: limit }, 
        ])

        const total = await this.staffMemberModel.find(filters).countDocuments().exec()
        
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }

    async voidOne(_id: string) {
        const check = await this.staffMemberModel.findOne({ _id })

        if (check?.status === 0) {
            await this.actionRecordRecord('Void Staff Member', 'DELETE', {_id}, 'FAILURE')
            return {
                error: 'This record has been voided!'
            }
        } else {
            const updateData = { status: 0, updatedAt: new Date() }
            const res = await this.staffMemberModel.updateOne({ _id}, updateData)

            if (res.acknowledged) {
                await this.actionRecordRecord('Void Staff Member', 'DELETE', updateData, 'Sussess')
                return {
                    void: true,
                    message: 'This record void just now!'
                }
            } else {
                await this.actionRecordRecord('Void Staff Member', 'DELETE', updateData, 'FAILURE')
                return {
                    void: false,
                    message: 'Oooops! Something wrong, please try again!'
                }
            }
        }
    }
}