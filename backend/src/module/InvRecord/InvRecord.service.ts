import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { InvRecord } from './InvRecord.schema'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { CreateInvRecordDto, ListRecordReqDto } from './InvRecord.dto'

@Injectable()
export class InvRecordService {
    constructor(
        @InjectModel(InvRecord.name) private invRecordModel: Model<InvRecord>,
        private actionRecordService: ActionRecordService
    ) {}

    async create(createData: CreateInvRecordDto) {
        
        await this.actionRecordService.saveRecord({
            actionName: 'Create InvRecord',
            actionMethod: 'POST',
            actionFrom: 'InvRecord',
            actionData: {
                ...createData,
                createdAt: new Date()
            },
            actionSuccess: 'Sussess',
            createdAt: new Date()
        })

        return await this.invRecordModel.create({
            ...createData,
            createdAt: new Date()
        })
    }

    async listRecord(query: ListRecordReqDto) {
        const { page, limit, assetCode, dateRange } = query

        const skip = (page - 1) * limit

        const finalFilter = {
            ... dateRange && dateRange.length > 0 ? { createdAt: { $gte: dateRange[0], $lte: dateRange[1] } } : {},
            ... assetCode? { assetCode } : {}
        }

        const lists = await this.invRecordModel.aggregate([
            {
                $match: finalFilter
            },
            {
                $lookup: {
                  from: 'assetlists',
                  let: { assetCodeStr: '$assetCode' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$assetCode', '$$assetCodeStr'] } } }
                  ],
                  as: 'assetlist'
                }
            },
            {
                $lookup: {
                  from: 'locations',
                  let: { placeFromObj: '$placeFrom'},
                  pipeline: [{ $match: { $expr: { $eq: [{ $toString: '$_id' }, '$$placeFromObj'] } } }],
                  as: 'placeFromData'
                }
            },
            {
                $lookup: {
                  from: 'locations',
                  let: { placeToObj: '$placeTo'},
                  pipeline: [{ $match: { $expr: { $eq: [{ $toString: '$_id' }, '$$placeToObj'] } } }],
                  as: 'placeToData'
                }
            },
            { $unwind: { path: '$assetlist', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$placeFromData', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$placeToData', preserveNullAndEmptyArrays: true } },
            { $skip: skip },
            { $limit: limit },
        ]).exec()

        const total = await this.invRecordModel.find(finalFilter).countDocuments().exec()

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }
}