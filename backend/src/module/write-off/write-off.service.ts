import { Injectable } from '@nestjs/common'
import { WriteOff } from './write-off.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { CreateWriteOffRecrod, ListWriteOffReqDto } from './write-off.dto'
import { AssetListService } from '../asset-list/asset-list.service'
import { WriteOffModule } from './write-off.module'
import { InvRecordService } from '../InvRecord/InvRecord.service'

@Injectable()
export class WriteOffService {
    constructor(
        @InjectModel(WriteOff.name) private writeOffModel: Model<WriteOff>,
        private actionRecordService: ActionRecordService,
        private assetListService: AssetListService,
        private invRecordService: InvRecordService
    ) {}

    async create(createData: CreateWriteOffRecrod) {
        let { assetId, lastPlaceId, reason, lastDay, disposalMethod, remainingValue } = createData
        
        const checkAsset: any = await this.assetListService.getById(assetId)

        if (checkAsset) {

            if (!lastDay || lastDay === null) {
                lastDay = new Date()
            }

            const finalData = {
                assetId,
                lastPlaceId,
                lastDay,
                reason,
                disposalMethod, 
                remainingValue,
                createdAt: new Date(),
                status: 1
            }

            await this.assetListService.invalidate(assetId)

            await this.invRecordService.create({
                assetCode: checkAsset.assetCode,
                placeFrom: lastPlaceId,
                placeTo: ''
            })

            

            const create = new this.writeOffModel(finalData)
            const res = await create.save()
            if (res._id) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Create Write Off Record',
                    actionMethod: 'POST',
                    actionFrom: 'Off Record',
                    actionData: finalData,
                    actionSuccess: 'Sussess',
                    createdAt: new Date()
                })

                return {
                    msg: 'End the write off process!',
                    finish: true
                }
            } else {
                return {
                    msg: 'Oooops! Maybe something wrong, please try again!'
                }
            }


        } else {

            await this.actionRecordService.saveRecord({
                actionName: 'Create Write Off Record',
                actionMethod: 'POST',
                actionFrom: 'Write Off',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This asset already write off or invalidate!'
            }
        }
    }

    async listAndPage(query: ListWriteOffReqDto) {
        const { page, limit, placeIds, deptIds, typeIds, dateRange } = query

        const skip = (page - 1) * limit

        const finalFilter = {
            status: 1,
            ... dateRange && dateRange.length > 0 ? { createdAt: { $gte: dateRange[0], $lte: dateRange[1] } } : {},
            ... placeIds && placeIds.length > 0 ? { lastPlaceId: { $in: placeIds } } : {}
        }

        const lists = await this.writeOffModel.aggregate([
            {
                $match: finalFilter 
            },
            {
                $lookup: {
                  from: 'assetlists',
                  let: { assetIdStr: { $toObjectId: '$assetId' } }, // assetId as assetIdStr
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$assetIdStr'] } } },
                    ...(deptIds && deptIds.length > 0 ? [{ $match: { deptId: { $in: deptIds }} }] : []),
                    ...(typeIds && typeIds.length > 0 ? [{ $match: { typeId: { $in: typeIds }} }] : []),
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
                    { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
                    { $unwind: { path: '$assettype', preserveNullAndEmptyArrays: true } }
                ],
                  as: 'assetlist'
                }
            },
            {
                $lookup: {
                  from: 'locations',
                  let: { placeIdStr: { $toObjectId: '$lastPlaceId' } }, // Convert lastPlaceId as placeIdStr
                  pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$placeIdStr'] } } }],
                  as: 'location'
                }
            },
            { $unwind: { path: '$assetlist', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
            { $limit: limit },
        ]).skip(skip).exec()

        const total = await this.writeOffModel.find(finalFilter).countDocuments()

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }

    }
}