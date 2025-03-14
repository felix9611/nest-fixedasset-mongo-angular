import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { AssetListService } from '../asset-list/asset-list.service'
import { StockTake } from './stock-take.schema'
import { StockTakeItem } from './stock-take-item.schema'
import { StockTakeForm, UpdateStockTakeForm } from './stock-take.dto'

@Injectable()
export class StockTakeService {
    constructor(
        @InjectModel(StockTake.name) private stockTakeModel: Model<StockTake>,
        @InjectModel(StockTakeItem.name) private stockTakeItemModel: Model<StockTakeItem>,
        private assetListService: AssetListService,
        private actionRecordService: ActionRecordService
    ) {}

    async create(createData: StockTakeForm) {
        const { actionName, ..._data } = createData

        const checkData = await this.stockTakeModel.findOne({ actionName, status: 1 })

        if (checkData) {

            await this.actionRecordService.saveRecord({
                actionName: 'Create Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This action name already used! Please cehck again!'
            }

        } else {

            const finalData = {
                actionName,
                ..._data,
                status: 1,
                createdTime: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            const create = new this.stockTakeModel(finalData)
            return await create.save()
        }
    }


    async getOneStockTake(_id: string) {
        const data = await this.stockTakeModel.findOne({ _id, status: { $in: [1, 2] } })

        if (data) {

            let stockTakeItems: any[] = []

            stockTakeItems = await this.stockTakeItemModel.aggregate([
                {
                    $match: {
                        stockTakeId: _id,
                        $and: [
                            { myField: { $type: "object" } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'assetlists',
                        let: { assetIdStr: { $toObjectId: '$assetId' } }, // assetId as assetIdStr
                        pipeline: [
                            { 
                                $match: { 
                                    $expr: { $eq: ['$_id', '$$assetIdStr'] }
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
                    },

                },
                {
                    $lookup: {
                      from: 'locations', // Ensure correct collection name
                      let: { placeIdStr: { $toObjectId: '$placeId' } }, // Convert placeId to ObjectId
                      pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$placeIdStr'] } } }],
                      as: 'location'
                    }
                },
                { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
                { $unwind: { path: '$assetlist', preserveNullAndEmptyArrays: true } }
            ]).exec()

            return {
                ...data[0],
                stockTakeItems
            }

        } else {
            return {
                msg: 'This form has been invalidated! Please check again!'
            }
        }
    }


    async updated(updateData: UpdateStockTakeForm) {
        const { _id, ..._data } = updateData
    }
}