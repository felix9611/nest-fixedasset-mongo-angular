import { Injectable } from '@nestjs/common'
import { Assignment } from './assignment.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { DepartmentService } from '../department/department.service'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { AssetListService } from '../asset-list/asset-list.service'
import { StaffMemberService } from '../staff-member/staff-member.service'
import { CreateAssignment } from './assignment.dto'
import { error } from 'node:console'
import { JwtPayload } from '../auth/auth.dto'

@Injectable()
export class AssignmentService {
    constructor(
        @InjectModel(Assignment.name) private assignmentModel: Model<Assignment>,
        private departmentService: DepartmentService,
        private actionRecordService: ActionRecordService,
        private assetListService: AssetListService,
        private staffMemberService: StaffMemberService
    ) {}

    async actionRecordRecord(actionName: string, actionMethod: string, actionData: any, actionSuccess: string) {
        return await this.actionRecordService.saveRecord({
            actionName,
            actionMethod,
            actionFrom: 'Assignment',
            actionData,
            actionSuccess,
            createdAt: new Date()
        })
    }

    async createAssign(data: CreateAssignment, user: JwtPayload) {
        const { staffId, assetId, deptId, ..._data } = data

        const checkStaff = await this.staffMemberService.getOneById(staffId.toString())

        if (checkStaff) {
            const checkDept = await this.departmentService.getOneById(deptId.toString())
            const checkAsset = await this.assetListService.getById(assetId.toString())

            if (!(checkDept || checkAsset)) {
                await this.actionRecordRecord('Create Assignment', 'POST', data, 'FAILURE')

                return {
                    error: 'Not found department or asset data!'
                }
            }

            const newAssign = {
                deptId,
                staffId,
                assetId,
                assignByUser: user.username,
                ..._data
            }

            const create = new this.assignmentModel(newAssign)
            const res = await create.save()

            if (res) {
                await this.actionRecordRecord('Create Assignment', 'POST', data, 'Sussess')

                return res
            } else {
                await this.actionRecordRecord('Create Assignment', 'POST', data, 'FAILURE')
                return {
                    error: 'Oooops! Something wrong, please try again!'
                }
            }

        } else if ( deptId === null || assetId) {
            await this.actionRecordRecord('Create Assignment', 'POST', data, 'FAILURE')
            return {
                error: 'Cannot without department or asset!'
            }
        } else {
            await this.actionRecordRecord('Create Assignment', 'POST', data, 'FAILURE')
            return {
                error: 'Cannot without user!'
            }
        }
    }
}