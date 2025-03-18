import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { AssetListService } from '../asset-list/asset-list.service'
import { StockTake } from './stock-take.schema'
import { StockTakeItem } from './stock-take-item.schema'
import { ListStockTakeDto, StockTakeForm, StockTakeItemDto, StockTakeItemDtoSubmit, UpdateStockTakeForm } from './stock-take.dto'

@Injectable()
export class StockTakeService {
    constructor(
        @InjectModel(StockTake.name) private stockTakeModel: Model<StockTake>,
        @InjectModel(StockTakeItem.name) private stockTakeItemModel: Model<StockTakeItem>,
        private assetListService: AssetListService,
        private actionRecordService: ActionRecordService
    ) {}

    async create(createData: StockTakeForm, username?: string) {
        const { actionName, ..._data } = createData

        const checkData = await this.stockTakeModel.findOne({ actionName, status: 1 })

        if (checkData) {

            await this.actionRecordService.saveRecord({
                actionName: 'Create Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: {
                    ...createData,
                    createBy: username
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This action name already used! Please cehck again!'
            }

        } else {

            const finalData = {
                actionName,
                createBy: username,
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
        const data = await this.stockTakeModel.findOne({ _id })

        if (data) {

            const stockTakeItems: any[] = await this.getStockTakeItem(_id)

            return {
                _id: data._id,
                actionName: data.actionName,
                actionPlaceId: data.actionPlaceId,
                remark: data.remark,
                createdTime: data.createdTime,
                finishTime: data.finishTime,
                createBy: data.createBy,
                stockTakeItems,
                status: data.status
            }

        } else {
            return {
                msg: 'This form has been invalidated! Please check again!'
            }
        }
    }


    async update(updateData: UpdateStockTakeForm) {
        const { _id, ..._data } = updateData

        const checkForm = await this.stockTakeModel.findOne({ _id})

        if (checkForm?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Update Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'Ooooops! This stock take form no longer active! Please create a new form!'
            }
        }  else if (checkForm?.status === 2){

            await this.actionRecordService.saveRecord({
                actionName: 'Update Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'Ooooops! This stock take form has been completed! Please create a new form!'
            }
        } else {

            const finalData = {
                ..._data,
                updatedAt: new Date()
            }


            await this.stockTakeModel.updateOne({ _id }, finalData)

            await this.actionRecordService.saveRecord({
                actionName: 'Update Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            return {
                finished: true,
                msg: 'Updated successfully!'
            }

        }
    }

    async finishOrVoid(_id: string, status: number, username?: string) {

        const checkForm = await this.stockTakeModel.findOne({ _id })

        if (checkForm?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Finish Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'Ooooops! This stock take form no longer active! Please create a new form!'
            }
        }  else if (checkForm?.status === 2){

            await this.actionRecordService.saveRecord({
                actionName: 'Finish Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'Ooooops! This stock take form already completed! Please check again!'
            }
        } else {

            const finalData = {
                status,
                finishBy: username,
                updatedAt: new Date()
            }


            await this.stockTakeModel.updateOne({ _id }, finalData)

            await this.actionRecordService.saveRecord({
                actionName: 'Update Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            return {
                finished: true,
                msg: 'Updated successfully!'
            }

        }
    }


    async listStockTakeForm(query: ListStockTakeDto) {
        const { page, limit, name, placeIds } = query

        const skip = (page - 1) * limit

        const finalFilter = {
            ...name? {  actionName: { $regex: name, $options: 'i' } } : {},
            ...placeIds && placeIds.length > 0 ? { actionPlaceId: { $in: placeIds } } : {}
        }

        const lists = await this.stockTakeModel.aggregate([
            {
                $match: finalFilter
            },
            {
                $lookup: {
                  from: 'locations', // Ensure correct collection name
                  let: { placeIdStr: { $toObjectId: '$actionPlaceId' } }, // Convert actionPlaceId
                  pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$placeIdStr'] } } }],
                  as: 'location'
                }
            },
            { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
            {
                $limit: limit
            }
        ]).skip(skip).exec()

        const total = await this.stockTakeItemModel.find(finalFilter).countDocuments()
    
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    
    }


    //// stcok take item //////


    async stockTakeItemSubmit(data: StockTakeItemDtoSubmit) {

        const finalData = {
            ...data,
            checkTime: new Date()
        }

        await this.actionRecordService.saveRecord({
            actionName: 'Submit Stock Take Item',
            actionMethod: 'POST',
            actionFrom: 'Stock Take Item',
            actionData: finalData,
            actionSuccess: 'Success',
            createdAt: new Date()
        })

        const create = new this.stockTakeItemModel(finalData)
        return await create.save()
    }

    async getStockTakeItem(stockTakeId: string) {
        return await this.stockTakeItemModel.aggregate([
            {
                $match: {
                    stockTakeId
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
    }
}
