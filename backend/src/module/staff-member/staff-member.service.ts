import { Injectable } from '@nestjs/common'
import { StaffMember } from './staff-member.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { DepartmentService } from '../department/department.service'
import { LocationService } from '../location/location.service'
import { SysUserService } from '../sys-user/sysUser.service'
import { CreateStaffMember } from './staff-member.dto'

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
        const { placeId, deptId, sysUserId, staffName, avatar, remark } = data

        const check = await this.staffMemberModel.findOne({ staffName, status: 1})

        if (check) {
            await this.actionRecordRecord('Create Staff Member', 'POST', data, 'FAILURE')

            return {
                error: 'This staff member already exist! Please check again!'
            }
        } else if ( deptId === null || placeId === null) {
            await this.actionRecordRecord('Create Staff Member', 'POST', data, 'FAILURE')
            return {
                error: 'The department id or location id must be filled!'
            }
        } else {
            const checkDept = await this.departmentService.getOneById(deptId.toHexString())
            const checkLocation = await this.locationService.getOneById

            if (!(checkDept || checkLocation)) {
                await this.actionRecordRecord('Create Staff Member', 'POST', data, 'FAILURE')

                return {
                    error: 'The department id or location id must be filled!'
                }
            } else {
                const checkSysUser = await this.sysUserService.findOneUser(sysUserId.toHexString())

                if (checkSysUser) {
                    const staffNumber = await this.createNewNumber()

                    const finalData = {
                        placeId,
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
        const { _id, placeId, deptId, sysUserId, ..._data } = data

        const checkStaff = await this.staffMemberModel.findOne({ _id, status: 1 })

        if (checkStaff) {
            const checkDept = await this.departmentService.getOneById(deptId.toHexString())
            const checkLocation = await this.locationService.getOneById

            if (!(checkDept || checkLocation)) {
                await this.actionRecordRecord('Update Staff Member', 'POST', data, 'FAILURE')

                return {
                    error: 'The department id or location id must be filled!'
                }
            } else {
                const checkSysUser = await this.sysUserService.findOneUser(sysUserId.toHexString())

                if (checkSysUser) {
                    const staffNumber = await this.createNewNumber()

                    const finalData = {
                        ..._data,
                        placeId,
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

    async getOne(_id: string) {
        const data = await this.staffMemberModel.findOne({ _id, status: 1 })
        if (data) {
            return data
        } else {
            return {
                error: 'Not found this record'
            }
        }
    }
}