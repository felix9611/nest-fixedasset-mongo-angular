import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { InvRecord } from './InvRecord.schema'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { CreateInvRecordDto } from './InvRecord.dto'

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
}