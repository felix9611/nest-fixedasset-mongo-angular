import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { RepairRecord } from './repair-record.schema'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { CreateRepairRecordDto, ListRepairRecordDto, UpdateRepairRecordDto } from './repair-record.dto'
import { AssetListService } from '../asset-list/asset-list.service'
import { create } from 'domain'

@Injectable()
export class RepairRecordService {
    constructor(
        @InjectModel(RepairRecord.name) private repairRecordModel: Model<RepairRecord>,
        private actionRecordService: ActionRecordService,
        private assetListService: AssetListService
    ) {}

    async getOneById(_id: string) {
        const data = await this.repairRecordModel.findOne({ _id})
        if (data?.status === 0) {
            return {
                msg: 'Oooops! This record has been removed!'
            }
        } else {
            return data
        }
    }

    async create(createData: CreateRepairRecordDto) {
        const { assetId, ..._data } = createData

        const checkAsset: any = await this.assetListService.getById(assetId) 

        if (checkAsset.msg) {

            await this.actionRecordService.saveRecord({
                actionName: 'Create Repair Record',
                actionMethod: 'POST',
                actionFrom: 'Repair Record',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: checkAsset.msg
            }
        } else {
            const finalData = {
                assetId,
                ..._data,
                createdAt: new Date(),
                status: 1
            }

            

            const create = new this.repairRecordModel(finalData)
            const res = await create.save()
            if (res._id) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Create Repair Record',
                    actionMethod: 'POST',
                    actionFrom: 'Repair Record',
                    actionData: finalData,
                    actionSuccess: 'Success',
                    createdAt: new Date()
                })

                return {
                    finish: true,
                    msg: 'Save Success!'
                }
            } else {
                msg: 'Ooops! Something went wrong! Please try again!'
            }
        }
    }

    async update(updateData: UpdateRepairRecordDto) {
        const { _id, ..._data } = updateData

        const checkData = await this.repairRecordModel.findOne({ _id })

        if (checkData?.status === 1) {

            const finalData = {
                ..._data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Repair Record',
                actionMethod: 'POST',
                actionFrom: 'Repair Record',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })


            return await this.repairRecordModel.updateOne({ _id}, finalData)
        } else {

            await this.actionRecordService.saveRecord({
                actionName: 'Update Repair Record',
                actionMethod: 'POST',
                actionFrom: 'Repair Record',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This record has been invalidated! Please contact admin!'
            }
        }

        
    }

    async invalidate(_id: string) {
        const checkData = await this.repairRecordModel.findOne({ _id })

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Void Repair Record',
                actionMethod: 'GET',
                actionFrom: 'Repair Record',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This record has been invalidated! Please contact admin!'
            }
         } else {
            const res = await this.repairRecordModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            })
        
            if (res.modifiedCount === 1) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Repair Record',
                    actionMethod: 'GET',
                    actionFrom: 'Repair Record',
                    actionData: {
                        _id,
                        status: 0,
                        updateAt: new Date()
                    },
                    actionSuccess: 'Success',
                    createdAt: new Date()
                })


                return {
                  msg: 'Invalidate successfully!'
                }
            } else {
                return {
                  msg: 'Ooops! Something went wrong! Please try again!'
                }
            }
         }
    }

    async listAndPage(query: ListRepairRecordDto) {
        const { page, limit, dateRange, assetCode, deptIds, typeIds, placeIds } = query

        const skip = (page - 1) * limit

        const finalFilter = {
            status: 1,
            ... dateRange && dateRange.length > 0 ? { createdAt: { $gte: dateRange[0], $lte: dateRange[1]} } : {}
        }

        const lists = await this.repairRecordModel.aggregate([
            {
                $match: finalFilter
            },
            {
                $lookup: {
                    from: 'assetlists',
                    let: { assetIdStr: { $toObjectId: '$assetId' } }, // assetId as assetIdStr
                    pipeline: [
                        { 
                            $match: { 
                                $expr: { $eq: ['$_id', '$$assetIdStr'] }, 
                                ...assetCode ? { assetCode} : {},
                                ...typeIds && typeIds.length > 0 ? { typeId: { $in: typeIds }} : {},
                                ...deptIds && deptIds.length > 0 ? { deptId: { $in: typeIds }} : {},
                                ...placeIds && placeIds.length > 0 ? { placeId: { $in: placeIds }} : {}
                            }
                        },
                        {
                            $lookup: {
                              from: 'locations', // Ensure correct collection name
                              let: { placeIdStr: { $toObjectId: '$placeId' } }, // Convert placeId to ObjectId
                              pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$placeIdStr'] } } }],
                              as: 'location'
                            }
                        },
                        {
                            $lookup: {
                                from: 'departments', // Ensure correct collection name
                                let: { deptIdStr: { $toObjectId: '$deptId' } }, // Convert deptId to ObjectId
                                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$deptIdStr'] } } }],
                                as: 'department'
                            }
                        },
                        {
                            $lookup: {
                                from: 'assettypes', // Ensure correct collection name
                                let: { typeIdStr: { $toObjectId: '$typeId' } }, // Convert deptId to ObjectId
                                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$typeIdStr'] } } }],
                                as: 'assettype'
                            }
                        },
                        { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: '$assettype', preserveNullAndEmptyArrays: true } }
                    ],
                  as: 'assetlist'
                }
            },
            { $unwind: { path: '$assetlist', preserveNullAndEmptyArrays: true } }
        ]).skip(skip).exec()

        const total = await this.repairRecordModel.aggregate([
            {
                $match: finalFilter
            },
            {
                $lookup: {
                    from: 'assetlists',
                    let: { assetIdStr: { $toObjectId: '$assetId' } }, // assetId as assetIdStr
                    pipeline: [
                        { 
                            $match: { 
                                $expr: { $eq: ['$_id', '$$assetIdStr'] }, 
                                ...assetCode ? { assetCode} : {},
                                ...typeIds && typeIds.length > 0 ? { typeId: { $in: typeIds }} : {},
                                ...deptIds && deptIds.length > 0 ? { deptId: { $in: typeIds }} : {},
                                ...placeIds && placeIds.length > 0 ? { placeId: { $in: placeIds }} : {}
                            }
                        }
                    ],
                  as: 'assetlist'
                }
            },
            { $unwind: { path: '$assetlist', preserveNullAndEmptyArrays: true } },
            {
                $facet: {
                  counts: [{ $count: 'total' }], 
                  data: [ 
                    { $sort: { _id: -1 } }, 
                    { $limit: 10 }
                  ]
                }
            }
        ]).exec()

        const counts = total[0].counts

        return {
            total: counts[0].total,
            page,
            limit,
            totalPages: Math.ceil(counts[0].total / limit),
            lists,
        }
    }

}