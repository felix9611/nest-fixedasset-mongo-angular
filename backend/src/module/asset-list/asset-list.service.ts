import { Injectable } from '@nestjs/common'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { AssetList } from './asset-list.schame'
import { CreateAssetDto, ListAssetReqDto, UpdateAssetDto } from './asset-list.dto'
import { InvRecordService } from '../InvRecord/InvRecord.service'


@Injectable()
export class AssetListService {
    constructor(
        @InjectModel(AssetList.name) private assetListModel: Model<AssetList>,
        private actionRecordService: ActionRecordService,
        private invRecordService: InvRecordService
    ) {}

    async getById(_id: string) {
        const res = await this.assetListModel.findOne({ _id })
        if (res?.status === 0) {
            return {
                msg: 'This asset maybe voided! Please contact admin!'
            }
        } else {
            return res
        }
    }

    async getByAssetCode(assetCode: string) {
        const res = await this.assetListModel.findOne({ assetCode })
        if (res?.status === 0) {
            return {
                msg: 'This asset maybe voided! Please contact admin!'
            }
        } else {
            return res
        }
    }

    async create(data: CreateAssetDto, username?: string) {
        const {  assetName, ..._data } = data

        const check = await this.assetListModel.findOne({ assetName, status: 1})

        if (check) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Budget',
                actionMethod: 'POST',
                actionFrom: 'Budget',
                actionData: data,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This asset name already exist! Please check again!'
            }
        } else {
            const assetCode = await this.createNewAssetCode()

            const finalData = {
                assetCode,
                assetName,
                ..._data,
                staffName: username,
                status: 1,
                createdAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Asset',
                actionMethod: 'POST',
                actionFrom: 'Asset List',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            await this.invRecordService.create({
                assetCode,
                placeFrom: _data.placeId,
                placeTo: ''
            })

            const create = new this.assetListModel(finalData)
            return await create.save()
        }
    }


    async update(data: UpdateAssetDto) {
        const { _id, ..._data } = data

        const check = await this.assetListModel.findOne({ _id, status: 1})

        if (check?.status === 1) {

            const finalData = {
                ..._data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Asset',
                actionMethod: 'POST',
                actionFrom: 'Asset',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            if (check.placeId.toString() !== _data.placeId) {
                await this.invRecordService.create({
                    assetCode: _data.assetCode,
                    placeFrom: check.placeId.toString(),
                    placeTo: _data.placeId
                })
            }

            return await this.assetListModel.updateOne({ _id}, finalData)

        } else {
            await this.actionRecordService.saveRecord({
                actionName: 'Update Asset',
                actionMethod: 'POST',
                actionFrom: 'Asset',
                actionData: data,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This budget may be invalidated or not exist! Please contact admin!'
            }
        }
    }

    async invalidate(_id: string) {
        const checkData = await this.assetListModel.findOne({ _id })

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Void Asset',
                actionMethod: 'GET',
                actionFrom: 'Asset',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This budget has been invalidated! Please contact admin!'
            }
        } else {
            await this.assetListModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            })
    
            await this.actionRecordService.saveRecord({
                actionName: 'Void Asset',
                actionMethod: 'GET',
                actionFrom: 'Asset',
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
        }
    }

    async listPage(request: ListAssetReqDto) {

        const { page, limit, assetCode, assetName, typeIds, placeIds, deptIds } = request

        const skip = (page - 1) * limit

        const filters = {
            status: 1,
            ...assetCode ? { assetCode } : {},
            ...assetName?  { assetName: { $regex: assetName, $options: 'i' } } : {},
            ...typeIds && typeIds?.length > 0 ? { typeId: { $in: typeIds} } : {},
            ...placeIds && placeIds?.length > 0 ? { placeId: { $in: placeIds} } : {},
            ...deptIds && deptIds?.length > 0 ? { deptId: { $in: deptIds} } : {}
        }

        const lists = await await this.assetListModel.aggregate([
            {
                $match: filters
            },
            {
                $lookup: {
                  from: 'locations', // Ensure correct collection name
                  let: { placeIdStr: { $toObjectId: '$placeId' } }, // Convert placeId to ObjectId
                  pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$placeIdStr'] } } }],
                  as: 'place'
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
                    as: 'ssettype'
                }
            },
            { $unwind: { path: '$locations', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$assettypes', preserveNullAndEmptyArrays: true } }
        ]).exec()

        const total = await this.assetListModel.find(filters).countDocuments()

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }

    /// gen asset code

    formatNumber(num: number, digits: number): string {
        return (num + 1).toString().padStart(digits, '0')
    }

    async createNewAssetCode() {
        const result = await this.assetListModel.aggregate([
            {
              $addFields: { assetCodeInt: { $toInt: "$assetCode" } } // Convert to integer
            },
            {
              $group: { 
                _id: null, 
                maxNumber: { $max: "$assetCodeInt" } // Find max
              }
            }
        ])

        const maxNumber = result.length > 0 ? result[0].maxNumber : 0
        if (maxNumber == null) {
            return this.formatNumber(0, 6)
        } else {
            return this.formatNumber(maxNumber, 6)
        }
    }


    
}