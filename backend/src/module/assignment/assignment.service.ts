import { Injectable } from '@nestjs/common'
import { Assignment } from './assignment.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { DepartmentService } from '../department/department.service'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { AssetListService } from '../asset-list/asset-list.service'
import { StaffMemberService } from '../staff-member/staff-member.service'
import { AssignedAssetReqDto, CreateAssignment } from './assignment.dto'
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

    async voidOne(_id: string) {
        const check = await this.assignmentModel.findOne({ _id })

        if (check?.status === 0) {
            return {
                error: 'This record has been voided!'
            }
        } else {
            const updateData = { status: 0, updatedAt: new Date() }
            const res = await this.assignmentModel.updateOne({ _id}, updateData)

            if (res.acknowledged) {
                return {
                    void: true,
                    message: 'This record void just now!'
                }
            } else {
                return {
                    void: false,
                    message: 'Oooops! Something wrong, please try again!'
                }
            }
        }
    }

    async updateAssign(data: Assignment) {
        const { staffId, assetId, deptId, _id, ..._data } = data

        const checkStaff = await this.staffMemberService.getOneById(staffId.toString())

        if (checkStaff) {
            const checkDept = await this.departmentService.getOneById(deptId.toString())
            const checkAsset = await this.assetListService.getById(assetId.toString())

            if (!(checkDept || checkAsset ||  _id)) {
                await this.actionRecordRecord('Create Assignment', 'POST', data, 'FAILURE')

                return {
                    error: 'Not found department or asset data! Or this is not valid data!'
                }
            }

            const assign = {
                deptId,
                staffId,
                assetId,
                ..._data
            }

            const res = await this.assignmentModel.updateOne({ _id, status: 1 }, assign)

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

    async listAssignedAsset(req: AssignedAssetReqDto, staffId: string) {
        const { page, limit } = req

        const skip = (page - 1) * limit

        const filters = {
            staffId,
            status: 1
        }

        const lists = await await this.assignmentModel.aggregate([
            {
                $match: filters
            },
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
            {
                $lookup: {
                    from: 'assetlists', // Ensure correct collection name
                    let: { assetIdStr: { $toObjectId: '$assetId' } }, // Convert deptId to ObjectId
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$assetIdStr'] } } },
                        {
                            $project: {
                                _id: 0,
                                assetCode: 1,
                                assetName: 1,
                                unit: 1,
                                purchaseDate: 1
                            }
                        }
                    ],
                    as: 'assetlist'
                }
            },
            { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$assetlist', preserveNullAndEmptyArrays: true } },
            { $skip: skip },
            { $limit: limit }, 
        ]).exec()

        const total = await this.assignmentModel.find(filters).countDocuments().exec()

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }
}